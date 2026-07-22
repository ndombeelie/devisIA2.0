import React, { useState, useEffect } from 'react';

export default function Settings({ company }) {
  const [settings, setSettings] = useState({
    currency: 'USD',
    theme: 'light',
    quote_prefix: 'DEV',
    invoice_prefix: 'FAC'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, [company.id]);

  const loadSettings = async () => {
    try {
      const currency = await window.electronAPI.getSetting({ companyId: company.id, key: 'currency' });
      const theme = await window.electronAPI.getSetting({ companyId: company.id, key: 'theme' });
      const quotePrefix = await window.electronAPI.getSetting({ companyId: company.id, key: 'quote_prefix' });
      const invoicePrefix = await window.electronAPI.getSetting({ companyId: company.id, key: 'invoice_prefix' });
      
      setSettings({
        currency: currency || 'USD',
        theme: theme || 'light',
        quote_prefix: quotePrefix || 'DEV',
        invoice_prefix: invoicePrefix || 'FAC'
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all([
        window.electronAPI.setSetting({ companyId: company.id, key: 'currency', value: settings.currency }),
        window.electronAPI.setSetting({ companyId: company.id, key: 'theme', value: settings.theme }),
        window.electronAPI.setSetting({ companyId: company.id, key: 'quote_prefix', value: settings.quote_prefix }),
        window.electronAPI.setSetting({ companyId: company.id, key: 'invoice_prefix', value: settings.invoice_prefix })
      ]);
      alert('Paramètres enregistrés !');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '100%' }}>Chargement...</div>;
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-3">⚙️ Paramètres</h2>

      <div className="card mb-2">
        <h3 className="card-title mb-2">💰 Devise</h3>
        <div className="form-group">
          <label className="form-label">Devise par défaut</label>
          <select
            className="form-select"
            value={settings.currency}
            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
          >
            <option value="USD">USD - Dollar américain</option>
            <option value="CDF">CDF - Franc congolais</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>
      </div>

      <div className="card mb-2">
        <h3 className="card-title mb-2">📄 Numérotation</h3>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Préfixe devis</label>
            <input
              type="text"
              className="form-input"
              value={settings.quote_prefix}
              onChange={(e) => setSettings({ ...settings, quote_prefix: e.target.value })}
              maxLength={10}
            />
            <small className="text-muted">
              Exemple: {settings.quote_prefix}-2026-00001
            </small>
          </div>
          <div className="form-group">
            <label className="form-label">Préfixe facture</label>
            <input
              type="text"
              className="form-input"
              value={settings.invoice_prefix}
              onChange={(e) => setSettings({ ...settings, invoice_prefix: e.target.value })}
              maxLength={10}
            />
            <small className="text-muted">
              Exemple: {settings.invoice_prefix}-2026-00001
            </small>
          </div>
        </div>
      </div>

      <div className="card mb-2">
        <h3 className="card-title mb-2">🎨 Apparence</h3>
        <div className="form-group">
          <label className="form-label">Thème</label>
          <select
            className="form-select"
            value={settings.theme}
            onChange={(e) => {
              const theme = e.target.value;
              setSettings({ ...settings, theme });
              document.documentElement.setAttribute('data-theme', theme);
              localStorage.setItem('theme', theme);
            }}
          >
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </div>
      </div>

      <div className="card mb-2">
        <h3 className="card-title mb-2">🤖 Assistant IA</h3>
        <div className="form-group">
          <label className="form-label">Clé API OpenRouter (optionnelle)</label>
          <input
            type="password"
            className="form-input"
            placeholder="sk-or-..."
          />
          <small className="text-muted">
            Obtenez votre clé sur <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">openrouter.ai</a>
          </small>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        💾 Enregistrer les paramètres
      </button>
    </div>
  );
}
