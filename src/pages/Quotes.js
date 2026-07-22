import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Quotes({ company }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadQuotes();
  }, [company.id]);

  const loadQuotes = async () => {
    try {
      const data = await window.electronAPI.getQuotes(company.id);
      setQuotes(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce devis ?')) {
      await window.electronAPI.deleteQuote(id);
      loadQuotes();
    }
  };

  const handleConvertToInvoice = async (quoteId) => {
    if (window.confirm('Convertir ce devis en facture ?')) {
      const result = await window.electronAPI.convertQuoteToInvoice(quoteId);
      if (result.success) {
        alert('Facture créée avec succès !');
        navigate('/invoices');
      }
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
      draft: { label: 'Brouillon', class: 'badge-primary' },
      sent: { label: 'Envoyé', class: 'badge-warning' },
      accepted: { label: 'Accepté', class: 'badge-success' },
      refused: { label: 'Refusé', class: 'badge-danger' },
      expired: { label: 'Expiré', class: 'badge-danger' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const filteredQuotes = filter === 'all' 
    ? quotes 
    : quotes.filter(q => q.status === filter);

  if (loading) {
    return <div className="flex-center" style={{ height: '100%' }}>Chargement...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-2">
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>📄 Gestion des devis</h2>
        <button className="btn btn-primary" onClick={() => navigate('/quotes/new')}>
          + Nouveau devis
        </button>
      </div>

      <div className="card">
        <div className="flex gap-1 mb-2">
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button
            className={`btn btn-sm ${filter === 'draft' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('draft')}
          >
            Brouillons
          </button>
          <button
            className={`btn btn-sm ${filter === 'sent' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('sent')}
          >
            Envoyés
          </button>
          <button
            className={`btn btn-sm ${filter === 'accepted' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('accepted')}
          >
            Acceptés
          </button>
          <button
            className={`btn btn-sm ${filter === 'refused' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('refused')}
          >
            Refusés
          </button>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="text-center" style={{ padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <h3>Aucun devis</h3>
            <p className="text-muted" style={{ marginBottom: '24px' }}>
              Créez votre premier devis professionnel
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/quotes/new')}>
              Créer un devis
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>N° Devis</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Échéance</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id}>
                    <td style={{ fontWeight: 500 }}>{quote.quote_number}</td>
                    <td>
                      {quote.client_company || `${quote.first_name} ${quote.last_name}`}
                    </td>
                    <td>{formatDate(quote.date)}</td>
                    <td>{quote.expiry_date ? formatDate(quote.expiry_date) : '-'}</td>
                    <td style={{ fontWeight: 500 }}>{formatCurrency(quote.total)}</td>
                    <td>{getStatusBadge(quote.status)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/quotes/edit/${quote.id}`)}
                        >
                          Voir
                        </button>
                        {quote.status === 'accepted' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleConvertToInvoice(quote.id)}
                          >
                            Facturer
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(quote.id)}
                        >
                          Supprimer
                        </button>
                      </div>
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
