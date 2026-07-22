import React, { useState, useEffect } from 'react';

export default function Companies({ onSelectCompany }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    rccm: '',
    id_national: '',
    tax_number: '',
    tva_enabled: false
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await window.electronAPI.getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await window.electronAPI.updateCompany({ ...formData, id: editingCompany.id });
      } else {
        await window.electronAPI.createCompany(formData);
      }
      loadCompanies();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette entreprise ?')) {
      await window.electronAPI.deleteCompany(id);
      loadCompanies();
    }
  };

  const openModal = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setFormData(company);
    } else {
      setEditingCompany(null);
      setFormData({
        name: '', address: '', phone: '', email: '', rccm: '',
        id_national: '', tax_number: '', tva_enabled: false
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCompany(null);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100%' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '40px' }}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🏢 Sélectionnez une entreprise</h2>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Nouvelle entreprise
          </button>
        </div>

        {companies.length === 0 ? (
          <div className="text-center" style={{ padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
            <h3 style={{ marginBottom: '8px' }}>Aucune entreprise</h3>
            <p className="text-muted" style={{ marginBottom: '24px' }}>
              Créez votre première entreprise pour commencer
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => openModal()}>
              Créer une entreprise
            </button>
          </div>
        ) : (
          <div className="grid-2">
            {companies.map((company) => (
              <div
                key={company.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => onSelectCompany(company)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'var(--primary)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '20px'
                    }}>
                      {company.name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '16px' }}>{company.name}</div>
                      <div className="text-muted" style={{ fontSize: '13px' }}>
                        {company.email || company.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {company.address && <div>📍 {company.address}</div>}
                  {company.rccm && <div>RCCM: {company.rccm}</div>}
                </div>
                <div className="flex" style={{ gap: '8px', marginTop: '16px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => { e.stopPropagation(); openModal(company); }}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => { e.stopPropagation(); handleDelete(company.id); }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCompany ? 'Modifier l\'entreprise' : 'Nouvelle entreprise'}
              </h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nom de l'entreprise *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Adresse</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">RCCM</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.rccm}
                      onChange={(e) => setFormData({ ...formData, rccm: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ID National</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.id_national}
                      onChange={(e) => setFormData({ ...formData, id_national: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Numéro d'impôt</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.tax_number}
                      onChange={(e) => setFormData({ ...formData, tax_number: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">TVA</label>
                    <select
                      className="form-select"
                      value={formData.tva_enabled ? '1' : '0'}
                      onChange={(e) => setFormData({ ...formData, tva_enabled: e.target.value === '1' })}
                    >
                      <option value="0">Non assujetti</option>
                      <option value="1">Assujetti TVA</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCompany ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
