import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateQuotePDF = async (quote, company, client) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Couleurs
  const primaryColor = [37, 99, 235];
  
  // En-tête entreprise
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name || 'Mon Entreprise', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let companyInfo = [];
  if (company.address) companyInfo.push(company.address);
  if (company.phone) companyInfo.push(`Tél: ${company.phone}`);
  if (company.email) companyInfo.push(`Email: ${company.email}`);
  doc.text(companyInfo.join(' | '), 20, 30);
  
  // Titre DEVIS
  doc.setTextColor(...primaryColor);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('DEVIS', pageWidth / 2, 60, { align: 'center' });
  
  // Numéro et date
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° ${quote.quote_number}`, 20, 75);
  doc.text(`Date: ${formatDate(quote.date)}`, 20, 82);
  if (quote.expiry_date) {
    doc.text(`Validité: ${formatDate(quote.expiry_date)}`, 20, 89);
  }
  
  // Client
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(120, 70, 70, 35, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURER À:', 125, 78);
  doc.setFont('helvetica', 'normal');
  doc.text(client.company_name || `${client.first_name} ${client.last_name}`, 125, 85);
  if (client.address) doc.text(client.address, 125, 90);
  if (client.city) doc.text(`${client.city}, ${client.country || ''}`, 125, 95);
  
  // Tableau des articles
  const tableData = quote.items.map(item => [
    item.description,
    item.quantity,
    item.unit,
    formatCurrency(item.unit_price),
    `${item.tva_rate}%`,
    formatCurrency(item.total)
  ]);
  
  doc.autoTable({
    startY: 115,
    head: [['Description', 'Qté', 'Unité', 'Prix HT', 'TVA', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'center' },
      5: { halign: 'right' }
    }
  });
  
  // Totaux
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(pageWidth - 80, finalY, 60, 45, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.text('Sous-total HT:', pageWidth - 75, finalY + 10);
  doc.text(formatCurrency(quote.subtotal), pageWidth - 25, finalY + 10, { align: 'right' });
  
  doc.text('TVA:', pageWidth - 75, finalY + 18);
  doc.text(formatCurrency(quote.tva_amount), pageWidth - 25, finalY + 18, { align: 'right' });
  
  if (quote.discount > 0) {
    doc.text('Remise:', pageWidth - 75, finalY + 26);
    doc.text(`-${formatCurrency(quote.discount)}`, pageWidth - 25, finalY + 26, { align: 'right' });
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('Total TTC:', pageWidth - 75, finalY + 38);
  doc.text(formatCurrency(quote.total), pageWidth - 25, finalY + 38, { align: 'right' });
  
  // Conditions
  if (quote.terms) {
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const terms = doc.splitTextToSize(quote.terms, pageWidth - 40);
    doc.text(terms, 20, finalY + 60);
  }
  
  // Pied de page
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  if (company.rccm) doc.text(`RCCM: ${company.rccm}`, 20, 285);
  if (company.tax_number) doc.text(`N° Impôt: ${company.tax_number}`, 20, 290);
  
  return doc;
};

export const generateInvoicePDF = async (invoice, company, client) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const primaryColor = [37, 99, 235];
  
  // En-tête entreprise
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name || 'Mon Entreprise', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let companyInfo = [];
  if (company.address) companyInfo.push(company.address);
  if (company.phone) companyInfo.push(`Tél: ${company.phone}`);
  if (company.email) companyInfo.push(`Email: ${company.email}`);
  doc.text(companyInfo.join(' | '), 20, 30);
  
  // Titre FACTURE
  doc.setTextColor(...primaryColor);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURE', pageWidth / 2, 60, { align: 'center' });
  
  // Numéro et date
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° ${invoice.invoice_number}`, 20, 75);
  doc.text(`Date: ${formatDate(invoice.date)}`, 20, 82);
  if (invoice.due_date) {
    doc.text(`Échéance: ${formatDate(invoice.due_date)}`, 20, 89);
  }
  
  // Statut
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(pageWidth - 45, 70, 25, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('PAYÉE', pageWidth - 32.5, 76, { align: 'center' });
  
  // Client
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(120, 70, 70, 35, 3, 3, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURER À:', 125, 78);
  doc.setFont('helvetica', 'normal');
  doc.text(client.company_name || `${client.first_name} ${client.last_name}`, 125, 85);
  if (client.address) doc.text(client.address, 125, 90);
  if (client.city) doc.text(`${client.city}, ${client.country || ''}`, 125, 95);
  
  // Tableau des articles
  const tableData = invoice.items.map(item => [
    item.description,
    item.quantity,
    item.unit || 'unité',
    formatCurrency(item.unit_price),
    `${item.tva_rate}%`,
    formatCurrency(item.total)
  ]);
  
  doc.autoTable({
    startY: 115,
    head: [['Description', 'Qté', 'Unité', 'Prix HT', 'TVA', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    }
  });
  
  // Totaux
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(pageWidth - 80, finalY, 60, 35, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL TTC', pageWidth - 75, finalY + 15);
  doc.setFontSize(18);
  doc.text(formatCurrency(invoice.total), pageWidth - 25, finalY + 28, { align: 'right' });
  
  // Pied de page
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  if (company.rccm) doc.text(`RCCM: ${company.rccm}`, 20, 285);
  if (company.tax_number) doc.text(`N° Impôt: ${company.tax_number}`, 20, 290);
  
  return doc;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-CD', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};
