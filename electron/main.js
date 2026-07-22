const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const isDev = require('electron-is-dev');

let mainWindow;
let db;

// Initialisation base de données
function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'devisai.db');
  db = new Database(dbPath);
  
  // Création des tables
  db.exec(`
    -- Table utilisateurs
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Table entreprises
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo TEXT,
      address TEXT,
      phone TEXT,
      email TEXT,
      rccm TEXT,
      id_national TEXT,
      tax_number TEXT,
      tva_enabled INTEGER DEFAULT 0,
      signature TEXT,
      stamp TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Table clients
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      first_name TEXT,
      last_name TEXT,
      company_name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      country TEXT DEFAULT 'RD Congo',
      city TEXT DEFAULT 'Kinshasa',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    );

    -- Table catégories produits
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    );

    -- Table produits/services
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      category_id INTEGER,
      name TEXT NOT NULL,
      description TEXT,
      price_ht REAL NOT NULL,
      tva_rate REAL DEFAULT 0,
      unit TEXT DEFAULT 'unité',
      image TEXT,
      stock INTEGER,
      type TEXT DEFAULT 'product',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    -- Table devis
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      client_id INTEGER,
      quote_number TEXT UNIQUE NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiry_date DATETIME,
      status TEXT DEFAULT 'draft',
      subtotal REAL DEFAULT 0,
      tva_amount REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      additional_fees REAL DEFAULT 0,
      total REAL DEFAULT 0,
      notes TEXT,
      terms TEXT,
      signature TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id),
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );

    -- Table lignes de devis
    CREATE TABLE IF NOT EXISTS quote_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote_id INTEGER,
      product_id INTEGER,
      description TEXT,
      quantity REAL DEFAULT 1,
      unit_price REAL,
      tva_rate REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      total REAL,
      FOREIGN KEY (quote_id) REFERENCES quotes(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    -- Table factures
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      client_id INTEGER,
      quote_id INTEGER,
      invoice_number TEXT UNIQUE NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      due_date DATETIME,
      status TEXT DEFAULT 'pending',
      subtotal REAL DEFAULT 0,
      tva_amount REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      total REAL DEFAULT 0,
      paid_amount REAL DEFAULT 0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id),
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (quote_id) REFERENCES quotes(id)
    );

    -- Table lignes de facture
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER,
      product_id INTEGER,
      description TEXT,
      quantity REAL DEFAULT 1,
      unit_price REAL,
      tva_rate REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      total REAL,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    -- Table paiements
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER,
      amount REAL NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      method TEXT,
      reference TEXT,
      notes TEXT,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id)
    );

    -- Table historique
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Table paramètres
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      key TEXT NOT NULL,
      value TEXT,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    );

    -- Insérer admin par défaut
    INSERT OR IGNORE INTO users (email, password) VALUES ('admin@gmail.com', 'admin@123');
  `);
  
  return db;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'DevisAI Desktop'
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// ============ IPC HANDLERS ============

// Authentification
ipcMain.handle('auth:login', async (event, { email, password }) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
    if (user) {
      return { success: true, user: { id: user.id, email: user.email } };
    }
    return { success: false, error: 'Email ou mot de passe incorrect' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Entreprises
ipcMain.handle('companies:getAll', async () => {
  return db.prepare('SELECT * FROM companies ORDER BY created_at DESC').all();
});

ipcMain.handle('companies:getById', async (event, id) => {
  return db.prepare('SELECT * FROM companies WHERE id = ?').get(id);
});

ipcMain.handle('companies:create', async (event, data) => {
  const stmt = db.prepare(`
    INSERT INTO companies (name, logo, address, phone, email, rccm, id_national, tax_number, tva_enabled, signature, stamp)
    VALUES (@name, @logo, @address, @phone, @email, @rccm, @id_national, @tax_number, @tva_enabled, @signature, @stamp)
  `);
  const result = stmt.run(data);
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle('companies:update', async (event, data) => {
  const stmt = db.prepare(`
    UPDATE companies SET 
      name = @name, logo = @logo, address = @address, phone = @phone, 
      email = @email, rccm = @rccm, id_national = @id_national, 
      tax_number = @tax_number, tva_enabled = @tva_enabled, 
      signature = @signature, stamp = @stamp
    WHERE id = @id
  `);
  stmt.run(data);
  return data;
});

ipcMain.handle('companies:delete', async (event, id) => {
  db.prepare('DELETE FROM companies WHERE id = ?').run(id);
  return { success: true };
});

// Clients
ipcMain.handle('clients:getAll', async (event, companyId) => {
  return db.prepare('SELECT * FROM clients WHERE company_id = ? ORDER BY created_at DESC').all(companyId);
});

ipcMain.handle('clients:search', async (event, { companyId, query }) => {
  const searchQuery = `%${query}%`;
  return db.prepare(`
    SELECT * FROM clients 
    WHERE company_id = ? AND (
      first_name LIKE ? OR last_name LIKE ? OR company_name LIKE ? 
      OR email LIKE ? OR phone LIKE ?
    )
    ORDER BY created_at DESC
  `).all(companyId, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery);
});

ipcMain.handle('clients:getById', async (event, id) => {
  return db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
});

ipcMain.handle('clients:create', async (event, data) => {
  const stmt = db.prepare(`
    INSERT INTO clients (company_id, first_name, last_name, company_name, email, phone, address, country, city, notes)
    VALUES (@company_id, @first_name, @last_name, @company_name, @email, @phone, @address, @country, @city, @notes)
  `);
  const result = stmt.run(data);
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle('clients:update', async (event, data) => {
  const stmt = db.prepare(`
    UPDATE clients SET 
      first_name = @first_name, last_name = @last_name, company_name = @company_name,
      email = @email, phone = @phone, address = @address, country = @country, 
      city = @city, notes = @notes
    WHERE id = @id
  `);
  stmt.run(data);
  return data;
});

ipcMain.handle('clients:delete', async (event, id) => {
  db.prepare('DELETE FROM clients WHERE id = ?').run(id);
  return { success: true };
});

// Catégories
ipcMain.handle('categories:getAll', async (event, companyId) => {
  return db.prepare('SELECT * FROM categories WHERE company_id = ? ORDER BY name').all(companyId);
});

ipcMain.handle('categories:create', async (event, data) => {
  const stmt = db.prepare('INSERT INTO categories (company_id, name, description) VALUES (@company_id, @name, @description)');
  const result = stmt.run(data);
  return { id: result.lastInsertRowid, ...data };
});

// Produits
ipcMain.handle('products:getAll', async (event, companyId) => {
  return db.prepare(`
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.company_id = ? 
    ORDER BY p.created_at DESC
  `).all(companyId);
});

ipcMain.handle('products:getById', async (event, id) => {
  return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
});

ipcMain.handle('products:create', async (event, data) => {
  const stmt = db.prepare(`
    INSERT INTO products (company_id, category_id, name, description, price_ht, tva_rate, unit, image, stock, type)
    VALUES (@company_id, @category_id, @name, @description, @price_ht, @tva_rate, @unit, @image, @stock, @type)
  `);
  const result = stmt.run(data);
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle('products:update', async (event, data) => {
  const stmt = db.prepare(`
    UPDATE products SET 
      category_id = @category_id, name = @name, description = @description,
      price_ht = @price_ht, tva_rate = @tva_rate, unit = @unit, 
      image = @image, stock = @stock, type = @type
    WHERE id = @id
  `);
  stmt.run(data);
  return data;
});

ipcMain.handle('products:delete', async (event, id) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return { success: true };
});

// Devis - Génération numéro automatique
function generateQuoteNumber(companyId) {
  const year = new Date().getFullYear();
  const count = db.prepare('SELECT COUNT(*) as count FROM quotes WHERE company_id = ?').get(companyId);
  const num = String(count.count + 1).padStart(5, '0');
  return `DEV-${year}-${num}`;
}

ipcMain.handle('quotes:getAll', async (event, companyId) => {
  return db.prepare(`
    SELECT q.*, c.first_name, c.last_name, c.company_name as client_company
    FROM quotes q
    LEFT JOIN clients c ON q.client_id = c.id
    WHERE q.company_id = ?
    ORDER BY q.created_at DESC
  `).all(companyId);
});

ipcMain.handle('quotes:getById', async (event, id) => {
  const quote = db.prepare(`
    SELECT q.*, c.first_name, c.last_name, c.company_name, c.email as client_email, 
           c.phone as client_phone, c.address as client_address, c.city, c.country
    FROM quotes q
    LEFT JOIN clients c ON q.client_id = c.id
    WHERE q.id = ?
  `).get(id);
  
  if (quote) {
    quote.items = db.prepare(`
      SELECT qi.*, p.name as product_name
      FROM quote_items qi
      LEFT JOIN products p ON qi.product_id = p.id
      WHERE qi.quote_id = ?
    `).all(id);
  }
  return quote;
});

ipcMain.handle('quotes:create', async (event, { quote, items }) => {
  const insertQuote = db.prepare(`
    INSERT INTO quotes (company_id, client_id, quote_number, date, expiry_date, status, 
                        subtotal, tva_amount, discount, additional_fees, total, notes, terms, signature)
    VALUES (@company_id, @client_id, @quote_number, @date, @expiry_date, @status, 
            @subtotal, @tva_amount, @discount, @additional_fees, @total, @notes, @terms, @signature)
  `);
  
  const insertItem = db.prepare(`
    INSERT INTO quote_items (quote_id, product_id, description, quantity, unit_price, tva_rate, discount, total)
    VALUES (@quote_id, @product_id, @description, @quantity, @unit_price, @tva_rate, @discount, @total)
  `);
  
  const transaction = db.transaction(() => {
    const result = insertQuote.run(quote);
    const quoteId = result.lastInsertRowid;
    
    items.forEach(item => {
      insertItem.run({ ...item, quote_id: quoteId });
    });
    
    return quoteId;
  });
  
  const quoteId = transaction();
  return { id: quoteId, ...quote };
});

ipcMain.handle('quotes:update', async (event, { quote, items }) => {
  const updateQuote = db.prepare(`
    UPDATE quotes SET 
      client_id = @client_id, date = @date, expiry_date = @expiry_date, status = @status,
      subtotal = @subtotal, tva_amount = @tva_amount, discount = @discount, 
      additional_fees = @additional_fees, total = @total, notes = @notes, 
      terms = @terms, signature = @signature, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);
  
  const deleteItems = db.prepare('DELETE FROM quote_items WHERE quote_id = ?');
  const insertItem = db.prepare(`
    INSERT INTO quote_items (quote_id, product_id, description, quantity, unit_price, tva_rate, discount, total)
    VALUES (@quote_id, @product_id, @description, @quantity, @unit_price, @tva_rate, @discount, @total)
  `);
  
  const transaction = db.transaction(() => {
    updateQuote.run(quote);
    deleteItems.run(quote.id);
    items.forEach(item => {
      insertItem.run({ ...item, quote_id: quote.id });
    });
  });
  
  transaction();
  return quote;
});

ipcMain.handle('quotes:delete', async (event, id) => {
  db.prepare('DELETE FROM quote_items WHERE quote_id = ?').run(id);
  db.prepare('DELETE FROM quotes WHERE id = ?').run(id);
  return { success: true };
});

ipcMain.handle('quotes:generateNumber', async (event, companyId) => {
  return generateQuoteNumber(companyId);
});

// Factures
function generateInvoiceNumber(companyId) {
  const year = new Date().getFullYear();
  const count = db.prepare('SELECT COUNT(*) as count FROM invoices WHERE company_id = ?').get(companyId);
  const num = String(count.count + 1).padStart(5, '0');
  return `FAC-${year}-${num}`;
}

ipcMain.handle('invoices:getAll', async (event, companyId) => {
  return db.prepare(`
    SELECT i.*, c.first_name, c.last_name, c.company_name as client_company
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    WHERE i.company_id = ?
    ORDER BY i.created_at DESC
  `).all(companyId);
});

ipcMain.handle('invoices:getById', async (event, id) => {
  const invoice = db.prepare(`
    SELECT i.*, c.first_name, c.last_name, c.company_name, c.email as client_email,
           c.phone as client_phone, c.address as client_address, c.city, c.country
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    WHERE i.id = ?
  `).get(id);
  
  if (invoice) {
    invoice.items = db.prepare(`
      SELECT ii.*, p.name as product_name
      FROM invoice_items ii
      LEFT JOIN products p ON ii.product_id = p.id
      WHERE ii.invoice_id = ?
    `).all(id);
    
    invoice.payments = db.prepare('SELECT * FROM payments WHERE invoice_id = ?').all(id);
  }
  return invoice;
});

ipcMain.handle('invoices:create', async (event, { invoice, items }) => {
  const insertInvoice = db.prepare(`
    INSERT INTO invoices (company_id, client_id, quote_id, invoice_number, date, due_date, status,
                          subtotal, tva_amount, discount, total, notes)
    VALUES (@company_id, @client_id, @quote_id, @invoice_number, @date, @due_date, @status,
            @subtotal, @tva_amount, @discount, @total, @notes)
  `);
  
  const insertItem = db.prepare(`
    INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, tva_rate, discount, total)
    VALUES (@invoice_id, @product_id, @description, @quantity, @unit_price, @tva_rate, @discount, @total)
  `);
  
  const transaction = db.transaction(() => {
    const result = insertInvoice.run(invoice);
    const invoiceId = result.lastInsertRowid;
    
    items.forEach(item => {
      insertItem.run({ ...item, invoice_id: invoiceId });
    });
    
    return invoiceId;
  });
  
  const invoiceId = transaction();
  return { id: invoiceId, ...invoice };
});

ipcMain.handle('invoices:convertFromQuote', async (event, quoteId) => {
  const quote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(quoteId);
  const items = db.prepare('SELECT * FROM quote_items WHERE quote_id = ?').all(quoteId);
  
  if (!quote) return { success: false, error: 'Devis non trouvé' };
  
  const invoice = {
    company_id: quote.company_id,
    client_id: quote.client_id,
    quote_id: quoteId,
    invoice_number: generateInvoiceNumber(quote.company_id),
    date: new Date().toISOString(),
    due_date: null,
    status: 'pending',
    subtotal: quote.subtotal,
    tva_amount: quote.tva_amount,
    discount: quote.discount,
    total: quote.total,
    notes: quote.notes
  };
  
  const insertInvoice = db.prepare(`
    INSERT INTO invoices (company_id, client_id, quote_id, invoice_number, date, due_date, status,
                          subtotal, tva_amount, discount, total, notes)
    VALUES (@company_id, @client_id, @quote_id, @invoice_number, @date, @due_date, @status,
            @subtotal, @tva_amount, @discount, @total, @notes)
  `);
  
  const insertItem = db.prepare(`
    INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, tva_rate, discount, total)
    VALUES (@invoice_id, @product_id, @description, @quantity, @unit_price, @tva_rate, @discount, @total)
  `);
  
  const transaction = db.transaction(() => {
    const result = insertInvoice.run(invoice);
    const invoiceId = result.lastInsertRowid;
    
    items.forEach(item => {
      insertItem.run({ ...item, invoice_id: invoiceId });
    });
    
    return invoiceId;
  });
  
  const invoiceId = transaction();
  return { success: true, invoiceId };
});

// Paiements
ipcMain.handle('payments:add', async (event, data) => {
  const stmt = db.prepare(`
    INSERT INTO payments (invoice_id, amount, date, method, reference, notes)
    VALUES (@invoice_id, @amount, @date, @method, @reference, @notes)
  `);
  const result = stmt.run(data);
  
  // Mettre à jour le montant payé
  db.prepare(`
    UPDATE invoices SET paid_amount = (
      SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = ?
    ) WHERE id = ?
  `).run(data.invoice_id, data.invoice_id);
  
  return { id: result.lastInsertRowid, ...data };
});

// Statistiques
ipcMain.handle('stats:getDashboard', async (event, companyId) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  return {
    quotesThisMonth: db.prepare(`
      SELECT COUNT(*) as count FROM quotes 
      WHERE company_id = ? AND strftime('%Y-%m', date) = ?
    `).get(companyId, currentMonth).count,
    
    quotesAccepted: db.prepare(`
      SELECT COUNT(*) as count FROM quotes WHERE company_id = ? AND status = 'accepted'
    `).get(companyId).count,
    
    quotesRefused: db.prepare(`
      SELECT COUNT(*) as count FROM quotes WHERE company_id = ? AND status = 'refused'
    `).get(companyId).count,
    
    invoicesThisMonth: db.prepare(`
      SELECT COUNT(*) as count FROM invoices 
      WHERE company_id = ? AND strftime('%Y-%m', date) = ?
    `).get(companyId, currentMonth).count,
    
    revenueThisMonth: db.prepare(`
      SELECT COALESCE(SUM(total), 0) as total FROM invoices 
      WHERE company_id = ? AND strftime('%Y-%m', date) = ?
    `).get(companyId, currentMonth).total,
    
    totalClients: db.prepare('SELECT COUNT(*) as count FROM clients WHERE company_id = ?').get(companyId).count,
    
    unpaidInvoices: db.prepare(`
      SELECT COUNT(*) as count FROM invoices 
      WHERE company_id = ? AND status IN ('pending', 'partial')
    `).get(companyId).count
  };
});

// Sauvegarde
ipcMain.handle('backup:export', async (event, { format, companyId }) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Exporter les données',
    defaultPath: `devisai-backup-${Date.now()}.${format}`,
    filters: [
      { name: 'JSON', extensions: ['json'] },
      { name: 'SQLite', extensions: ['sqlite', 'db'] }
    ]
  });
  
  if (!filePath) return { success: false, cancelled: true };
  
  try {
    if (format === 'json') {
      const data = {
        companies: db.prepare('SELECT * FROM companies WHERE id = ?').all(companyId),
        clients: db.prepare('SELECT * FROM clients WHERE company_id = ?').all(companyId),
        products: db.prepare('SELECT * FROM products WHERE company_id = ?').all(companyId),
        quotes: db.prepare('SELECT * FROM quotes WHERE company_id = ?').all(companyId),
        quote_items: db.prepare(`
          SELECT qi.* FROM quote_items qi
          JOIN quotes q ON qi.quote_id = q.id
          WHERE q.company_id = ?
        `).all(companyId),
        invoices: db.prepare('SELECT * FROM invoices WHERE company_id = ?').all(companyId),
        invoice_items: db.prepare(`
          SELECT ii.* FROM invoice_items ii
          JOIN invoices i ON ii.invoice_id = i.id
          WHERE i.company_id = ?
        `).all(companyId),
        payments: db.prepare(`
          SELECT p.* FROM payments p
          JOIN invoices i ON p.invoice_id = i.id
          WHERE i.company_id = ?
        `).all(companyId)
      };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } else {
      fs.copyFileSync(db.name, filePath);
    }
    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('backup:import', async () => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Importer une sauvegarde',
    filters: [
      { name: 'JSON', extensions: ['json'] }
    ],
    properties: ['openFile']
  });
  
  if (!filePaths || filePaths.length === 0) return { success: false, cancelled: true };
  
  try {
    const data = JSON.parse(fs.readFileSync(filePaths[0], 'utf-8'));
    // Implémenter la logique d'import
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Paramètres
ipcMain.handle('settings:get', async (event, { companyId, key }) => {
  const setting = db.prepare('SELECT value FROM settings WHERE company_id = ? AND key = ?').get(companyId, key);
  return setting ? setting.value : null;
});

ipcMain.handle('settings:set', async (event, { companyId, key, value }) => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO settings (company_id, key, value)
    VALUES (?, ?, ?)
  `);
  stmt.run(companyId, key, value);
  return { success: true };
});

// Export PDF
ipcMain.handle('pdf:saveQuote', async (event, { quote, company }) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Exporter le devis en PDF',
    defaultPath: `${quote.quote_number}.pdf`,
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  
  if (!filePath) return { success: false, cancelled: true };
  
  // Le PDF sera généré côté renderer, on retourne juste le chemin
  return { success: true, path: filePath };
});

ipcMain.handle('pdf:saveInvoice', async (event, { invoice, company }) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Exporter la facture en PDF',
    defaultPath: `${invoice.invoice_number}.pdf`,
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  
  if (!filePath) return { success: false, cancelled: true };
  
  return { success: true, path: filePath };
});
