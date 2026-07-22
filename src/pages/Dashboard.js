import React, { useState, useEffect } from 'react';

export default function Dashboard({ company }) {
  const [stats, setStats] = useState(null);
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [company.id]);

  const loadData = async () => {
    try {
      const [dashboardStats, quotes] = await Promise.all([
        window.electronAPI.getDashboardStats(company.id),
        window.electronAPI.getQuotes(company.id)
      ]);
      setStats(dashboardStats);
      setRecentQuotes(quotes.slice(0, 5));
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: currency,
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
      pending: { label: 'En attente', class: 'badge-warning' },
      paid: { label: 'Payé', class: 'badge-success' },
      partial: { label: 'Partiel', class: 'badge-warning' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '100%' }}>Chargement...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex-between mb-3">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600 }}>
            Bienvenue, {company.name} 👋
          </h1>
          <p className="text-muted">
            Voici un aperçu de votre activité de ce mois
          </p>
        </div>
        <div className="flex gap-1">
          <button className="btn btn-primary" onClick={() => window.location.href = '/quotes/new'}>
            📄 Nouveau devis
          </button>
          <button className="btn btn-secondary" onClick={() => window.location.href = '/invoices/new'}>
            🧾 Nouvelle facture
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-4 mb-3">
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="flex-between">
            <div>
              <div className="text-muted" style={{ fontSize: '13px', marginBottom: '8px' }}>
                Devis ce mois
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>
                {stats?.quotesThisMonth || 0}
              </div>
            </div>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(37, 99, 235, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              📄
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="flex-between">
            <div>
              <div className="text-muted" style={{ fontSize: '13px', marginBottom: '8px' }}>
                Devis acceptés
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--success)' }}>
                {stats?.quotesAccepted || 0}
              </div>
            </div>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ✅
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="flex-between">
            <div>
              <div className="text-muted" style={{ fontSize: '13px', marginBottom: '8px' }}>
                Factures impayées
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--warning)' }}>
                {stats?.unpaidInvoices || 0}
              </div>
            </div>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⏳
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="flex-between">
            <div>
              <div className="text-muted" style={{ fontSize: '13px', marginBottom: '8px' }}>
                Revenus du mois
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--success)' }}>
                {formatCurrency(stats?.revenueThisMonth)}
              </div>
            </div>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              💰
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row 2 */}
      <div className="grid-3 mb-3">
        <div className="card">
          <div className="text-muted" style={{ fontSize: '13px', marginBottom: '4px' }}>
            Clients total
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600 }}>{stats?.totalClients || 0}</div>
        </div>
        <div className="card">
          <div className="text-muted" style={{ fontSize: '13px', marginBottom: '4px' }}>
            Factures ce mois
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600 }}>{stats?.invoicesThisMonth || 0}</div>
        </div>
        <div className="card">
          <div className="text-muted" style={{ fontSize: '13px', marginBottom: '4px' }}>
            Devis refusés
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--danger)' }}>
            {stats?.quotesRefused || 0}
          </div>
        </div>
      </div>

      {/* Recent Quotes */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📄 Devis récents</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => window.location.href = '/quotes'}>
            Voir tout →
          </button>
        </div>

        {recentQuotes.length === 0 ? (
          <div className="text-center" style={{ padding: '40px' }}>
            <p className="text-muted">Aucun devis pour le moment</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>N° Devis</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotes.map((quote) => (
                  <tr key={quote.id}>
                    <td style={{ fontWeight: 500 }}>{quote.quote_number}</td>
                    <td>
                      {quote.client_company || `${quote.first_name} ${quote.last_name}`}
                    </td>
                    <td>{formatDate(quote.date)}</td>
                    <td style={{ fontWeight: 500 }}>{formatCurrency(quote.total)}</td>
                    <td>{getStatusBadge(quote.status)}</td>
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
