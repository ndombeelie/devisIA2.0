import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Invoices({ company }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadInvoices();
  }, [company.id]);

  const loadInvoices = async () => {
    try {
      const data = await window.electronAPI.getInvoices(company.id);
      setInvoices(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
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
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', class: 'badge-warning' },
      paid: { label: 'Payée', class: 'badge-success' },
      partial: { label: 'Partielle', class: 'badge-warning' },
      overdue: { label: 'En retard', class: 'badge-danger' },
      cancelled: { label: 'Annulée', class: 'badge-danger' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const filteredInvoices = filter === 'all'
    ? invoices
    : invoices.filter(i => i.status === filter);

  if (loading) {
    return <div className="flex-center" style={{ height: '100%' }}>Chargement...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-2">
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>🧾 Gestion des factures</h2>
        <button className="btn btn-primary" onClick={() => navigate('/invoices/new')}>
          + Nouvelle facture
        </button>
      </div>

      <div className="card">
        <div className="flex gap-1 mb-2">
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            Toutes
          </button>
          <button
            className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('pending')}
          >
            En attente
          </button>
          <button
            className={`btn btn-sm ${filter === 'partial' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('partial')}
          >
            Partielles
          </button>
          <button
            className={`btn btn-sm ${filter === 'paid' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('paid')}
          >
            Payées
          </button>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="text-center" style={{ padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧾</div>
            <h3>Aucune facture</h3>
            <p className="text-muted" style={{ marginBottom: '24px' }}>
              Les factures apparaîtront ici après conversion de devis acceptés
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>N° Facture</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Échéance</th>
                  <th>Montant total</th>
                  <th>Payé</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td style={{ fontWeight: 500 }}>{invoice.invoice_number}</td>
                    <td>
                      {invoice.client_company || `${invoice.first_name} ${invoice.last_name}`}
                    </td>
                    <td>{formatDate(invoice.date)}</td>
                    <td>{invoice.due_date ? formatDate(invoice.due_date) : '-'}</td>
                    <td style={{ fontWeight: 500 }}>{formatCurrency(invoice.total)}</td>
                    <td className="text-success">{formatCurrency(invoice.paid_amount)}</td>
                    <td>{getStatusBadge(invoice.status)}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
