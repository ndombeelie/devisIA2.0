import React, { useState, useEffect } from 'react';

export default function Statistics({ company }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [company.id]);

  const loadStats = async () => {
    try {
      const data = await window.electronAPI.getDashboardStats(company.id);
      setStats(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '100%' }}>Chargement...</div>;
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-3">📊 Statistiques</h2>

      <div className="grid-4 mb-3">
        <div className="card text-center">
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>📄</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)' }}>
            {stats?.quotesThisMonth || 0}
          </div>
          <div className="text-muted">Devis ce mois</div>
        </div>
        <div className="card text-center">
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>✅</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--success)' }}>
            {stats?.quotesAccepted || 0}
          </div>
          <div className="text-muted">Devis acceptés</div>
        </div>
        <div className="card text-center">
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🧾</div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>
            {stats?.invoicesThisMonth || 0}
          </div>
          <div className="text-muted">Factures ce mois</div>
        </div>
        <div className="card text-center">
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>👥</div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>
            {stats?.totalClients || 0}
          </div>
          <div className="text-muted">Clients</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="card-title mb-2">📈 Résumé financier</h3>
          <div style={{ padding: '20px', background: 'var(--background)', borderRadius: '12px' }}>
            <div className="flex-between mb-2">
              <span>Revenus du mois</span>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>
                {new Intl.NumberFormat('fr-CD', {
                  style: 'currency',
                  currency: 'USD'
                }).format(stats?.revenueThisMonth || 0)}
              </span>
            </div>
            <div className="flex-between mb-2">
              <span>Factures impayées</span>
              <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--warning)' }}>
                {stats?.unpaidInvoices || 0}
              </span>
            </div>
            <div className="flex-between">
              <span>Devis refusés</span>
              <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--danger)' }}>
                {stats?.quotesRefused || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title mb-2">💡 Conseils IA</h3>
          <div style={{ padding: '20px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '12px', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '32px' }}>🤖</div>
              <div>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Analyse de vos performances :</strong>
                </p>
                <ul style={{ marginLeft: '20px', color: 'var(--text-secondary)' }}>
                  <li style={{ marginBottom: '8px' }}>
                    {stats?.quotesAccepted > stats?.quotesRefused 
                      ? '✅ Excellent taux de conversion de vos devis !'
                      : '📈 Essayez d\'améliorer vos propositions commerciales.'}
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    {stats?.unpaidInvoices > 3 
                      ? '⚠️ Plusieurs factures en attente de paiement. Relancez vos clients.'
                      : '✅ Gestion des paiements maîtrisée.'}
                  </li>
                  <li>
                    💡 Utilisez l'assistant IA pour créer des devis plus attractifs.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
