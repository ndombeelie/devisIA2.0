import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function InvoiceForm({ company }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [invoice, setInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payment, setPayment] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'cash',
    reference: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      loadInvoice();
    }
  }, [id]);

  const loadInvoice = async () => {
    try {
      const data = await window.electronAPI.getInvoice(parseInt(id));
      setInvoice(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      await window.electronAPI.addPayment({
        invoice_id: parseInt(id),
        amount: parseFloat(payment.amount),
        date: payment.date,
        method: payment.method,
        reference: payment.reference,
        notes: payment.notes
      });
      setShowPaymentModal(false);
      setPayment({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        method: 'cash',
        reference: '',
        notes: ''
      });
      loadInvoice();
    } catch (error) {
      console.error('Erreur:', error);
    }
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

  if (loading) {
    return <div className="flex-center" style={{ height: '100%' }}>Chargement...</div>;
  }

  if (!invoice) {
    return (
      <div className="text-center" style={{ padding: '60px 20px' }}>
        <h3>Facture non trouvée</h3>
        <button className="btn btn-primary mt-2" onClick={() => navigate('/invoices')}>
          Retour aux factures
        </button>
      </div>
    );
  }

  const remainingAmount = invoice.total - (invoice.paid_amount || 0);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="flex-between mb-2">
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>
          🧾 Facture {invoice.invoice_number}
        </h2>
        <button className="btn btn-secondary" onClick={() => navigate('/invoices')}>
          ← Retour
        </button>
      </div>

      {/* Informations */}
      <div className="card mb-2">
        <div className="grid-2">
          <div>
            <h4 className="mb-1" style={{ fontWeight: 600 }}>Client</h4>
            <p style={{ marginBottom: '4px' }}>
              <strong>{invoice.company_name || `${invoice.first_name} ${invoice.last_name}`}</strong>
            </p>
            {invoice.client_email && <p className="text-muted">{invoice.client_email}</p>}
            {invoice.client_phone && <p className="text-muted">{invoice.client_phone}</p>}
            {invoice.client_address && (
              <p className="text-muted">{invoice.client_address}, {invoice.city}</p>
            )}
          </div>
          <div className="text-right">
            <p><strong>Date :</strong> {formatDate(invoice.date)}</p>
            {invoice.due_date && (
              <p><strong>Échéance :</strong> {formatDate(invoice.due_date)}</p>
            )}
            <p>
              <strong>Statut : </strong>
              <span className={`badge ${
                invoice.status === 'paid' ? 'badge-success' : 
                invoice.status === 'partial' ? 'badge-warning' : 'badge-primary'
              }`}>
                {invoice.status === 'paid' ? 'Payée' : 
                 invoice.status === 'partial' ? 'Partielle' : 'En attente'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="card mb-2">
        <h4 className="mb-2" style={{ fontWeight: 600 }}>Articles</h4>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>TVA</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unit_price)}</td>
                  <td>{item.tva_rate}%</td>
                  <td style={{ fontWeight: 500 }}>{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right mt-2">
          <div className="flex-between" style={{ maxWidth: '300px', marginLeft: 'auto' }}>
            <span>Sous-total HT</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex-between" style={{ maxWidth: '300px', marginLeft: 'auto' }}>
            <span>TVA</span>
            <span>{formatCurrency(invoice.tva_amount)}</span>
          </div>
          <div className="flex-between" style={{ 
            maxWidth: '300px', 
            marginLeft: 'auto',
            padding: '12px',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '8px',
            marginTop: '8px',
            fontWeight: 600
          }}>
            <span>Total TTC</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Paiements */}
      <div className="card mb-2">
        <div className="flex-between mb-2">
          <h4 style={{ fontWeight: 600 }}>💳 Paiements</h4>
          {remainingAmount > 0 && (
            <button className="btn btn-success btn-sm" onClick={() => setShowPaymentModal(true)}>
              + Ajouter un paiement
            </button>
          )}
        </div>

        <div className="grid-3 mb-2">
          <div style={{ padding: '16px', background: 'var(--background)', borderRadius: '8px' }}>
            <div className="text-muted" style={{ fontSize: '13px' }}>Total facture</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>{formatCurrency(invoice.total)}</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
            <div className="text-muted" style={{ fontSize: '13px' }}>Payé</div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--success)' }}>
              {formatCurrency(invoice.paid_amount || 0)}
            </div>
          </div>
          <div style={{ padding: '16px', background: remainingAmount > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
            <div className="text-muted" style={{ fontSize: '13px' }}>Reste à payer</div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: remainingAmount > 0 ? 'var(--warning)' : 'var(--success)' }}>
              {formatCurrency(remainingAmount)}
            </div>
          </div>
        </div>

        {invoice.payments?.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Méthode</th>
                  <th>Référence</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {invoice.payments.map((p, index) => (
                  <tr key={index}>
                    <td>{formatDate(p.date)}</td>
                    <td className="text-success" style={{ fontWeight: 500 }}>{formatCurrency(p.amount)}</td>
                    <td>
                      {p.method === 'cash' ? 'Espèces' :
                       p.method === 'transfer' ? 'Virement' :
                       p.method === 'check' ? 'Chèque' : p.method}
                    </td>
                    <td>{p.reference || '-'}</td>
                    <td>{p.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Paiement */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">💳 Ajouter un paiement</h3>
              <button className="modal-close" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddPayment}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Montant (USD) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={payment.amount}
                    onChange={(e) => setPayment({ ...payment, amount: e.target.value })}
                    max={remainingAmount}
                    step="0.01"
                    required
                  />
                  <small className="text-muted">Reste à payer: {formatCurrency(remainingAmount)}</small>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={payment.date}
                      onChange={(e) => setPayment({ ...payment, date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Méthode</label>
                    <select
                      className="form-select"
                      value={payment.method}
                      onChange={(e) => setPayment({ ...payment, method: e.target.value })}
                    >
                      <option value="cash">Espèces</option>
                      <option value="transfer">Virement bancaire</option>
                      <option value="check">Chèque</option>
                      <option value="mobile">Mobile money</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Référence</label>
                  <input
                    type="text"
                    className="form-input"
                    value={payment.reference}
                    onChange={(e) => setPayment({ ...payment, reference: e.target.value })}
                    placeholder="N° chèque, réf. virement..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-textarea"
                    value={payment.notes}
                    onChange={(e) => setPayment({ ...payment, notes: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-success">
                  Enregistrer le paiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
