const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Authentification
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
  
  // Entreprises
  getCompanies: () => ipcRenderer.invoke('companies:getAll'),
  getCompany: (id) => ipcRenderer.invoke('companies:getById', id),
  createCompany: (data) => ipcRenderer.invoke('companies:create', data),
  updateCompany: (data) => ipcRenderer.invoke('companies:update', data),
  deleteCompany: (id) => ipcRenderer.invoke('companies:delete', id),
  
  // Clients
  getClients: (companyId) => ipcRenderer.invoke('clients:getAll', companyId),
  searchClients: (params) => ipcRenderer.invoke('clients:search', params),
  getClient: (id) => ipcRenderer.invoke('clients:getById', id),
  createClient: (data) => ipcRenderer.invoke('clients:create', data),
  updateClient: (data) => ipcRenderer.invoke('clients:update', data),
  deleteClient: (id) => ipcRenderer.invoke('clients:delete', id),
  
  // Catégories
  getCategories: (companyId) => ipcRenderer.invoke('categories:getAll', companyId),
  createCategory: (data) => ipcRenderer.invoke('categories:create', data),
  
  // Produits
  getProducts: (companyId) => ipcRenderer.invoke('products:getAll', companyId),
  getProduct: (id) => ipcRenderer.invoke('products:getById', id),
  createProduct: (data) => ipcRenderer.invoke('products:create', data),
  updateProduct: (data) => ipcRenderer.invoke('products:update', data),
  deleteProduct: (id) => ipcRenderer.invoke('products:delete', id),
  
  // Devis
  getQuotes: (companyId) => ipcRenderer.invoke('quotes:getAll', companyId),
  getQuote: (id) => ipcRenderer.invoke('quotes:getById', id),
  createQuote: (data) => ipcRenderer.invoke('quotes:create', data),
  updateQuote: (data) => ipcRenderer.invoke('quotes:update', data),
  deleteQuote: (id) => ipcRenderer.invoke('quotes:delete', id),
  generateQuoteNumber: (companyId) => ipcRenderer.invoke('quotes:generateNumber', companyId),
  
  // Factures
  getInvoices: (companyId) => ipcRenderer.invoke('invoices:getAll', companyId),
  getInvoice: (id) => ipcRenderer.invoke('invoices:getById', id),
  createInvoice: (data) => ipcRenderer.invoke('invoices:create', data),
  convertQuoteToInvoice: (quoteId) => ipcRenderer.invoke('invoices:convertFromQuote', quoteId),
  
  // Paiements
  addPayment: (data) => ipcRenderer.invoke('payments:add', data),
  
  // Statistiques
  getDashboardStats: (companyId) => ipcRenderer.invoke('stats:getDashboard', companyId),
  
  // Sauvegarde
  exportBackup: (params) => ipcRenderer.invoke('backup:export', params),
  importBackup: () => ipcRenderer.invoke('backup:import'),
  
  // Paramètres
  getSetting: (params) => ipcRenderer.invoke('settings:get', params),
  setSetting: (params) => ipcRenderer.invoke('settings:set', params),
  
  // PDF
  saveQuotePDF: (params) => ipcRenderer.invoke('pdf:saveQuote', params),
  saveInvoicePDF: (params) => ipcRenderer.invoke('pdf:saveInvoice', params)
});
