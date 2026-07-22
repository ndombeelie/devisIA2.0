import React, { useState, useEffect } from 'react';

export default function Products({ company }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price_ht: '',
    tva_rate: '0',
    unit: 'unité',
    type: 'product',
    stock: ''
  });
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    loadData();
  }, [company.id]);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        window.electronAPI.getProducts(company.id),
        window.electronAPI.getCategories(company.id)
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        company_id: company.id,
        price_ht: parseFloat(formData.price_ht) || 0,
        tva_rate: parseFloat(formData.tva_rate) || 0,
        stock: formData.stock ? parseInt(formData.stock) : null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null
      };

      if (editingProduct) {
        await window.electronAPI.updateProduct({ ...data, id: editingProduct.id });
      } else {
        await window.electronAPI.createProduct(data);
      }
      loadData();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await window.electronAPI.createCategory({
        company_id: company.id,
        name: categoryName
      });
      loadData();
      setShowCategoryModal(false);
      setCategoryName('');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      await window.electronAPI.deleteProduct(id);
      loadData();
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category_id: product.category_id || '',
        price_ht: product.price_ht || '',
        tva_rate: product.tva_rate || '0',
        unit: product.unit || 'unité',
        type: product.type || 'product',
        stock: product.stock || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', description: '', category_id: '', price_ht: '',
        tva_rate: '0', unit: 'unité', type: 'product', stock: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '100%' }}>Chargement...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-2">
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>📦 Produits & Services</h2>
        <div className="flex gap-1">
          <button className="btn btn-secondary" onClick={() => setShowCategoryModal(true)}>
            📁 Catégories
          </button>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Nouveau produit
          </button>
        </div>
      </div>

      <div className="card">
        {products.length === 0 ? (
          <div className="text-center" style={{ padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3>Aucun produit</h3>
            <p className="text-muted" style={{ marginBottom: '24px' }}>
              Ajoutez vos produits et services pour créer des devis
            </p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              Ajouter un produit
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Type</th>
                  <th>Prix HT</th>
                  <th>TVA</th>
                  <th>Unité</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{product.name}</div>
                      {product.description && (
                        <div className="text-muted" style={{ fontSize: '12px' }}>
                          {product.description.substring(0, 50)}...
                        </div>
                      )}
                    </td>
                    <td>{product.category_name || '-'}</td>
                    <td>
                      <span className={`badge ${product.type === 'service' ? 'badge-primary' : 'badge-success'}`}>
                        {product.type === 'service' ? 'Service' : 'Produit'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{formatCurrency(product.price_ht)}</td>
                    <td>{product.tva_rate}%</td>
                    <td>{product.unit}</td>
                    <td>{product.stock || '-'}</td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openModal(product)}
                        >
                          Modifier
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(product.id)}
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

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nom *</label>
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
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="product">Produit</option>
                      <option value="service">Service</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Catégorie</label>
                    <select
                      className="form-select"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    >
                      <option value="">Sans catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Prix HT (USD) *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.price_ht}
                      onChange={(e) => setFormData({ ...formData, price_ht: e.target.value })}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">TVA (%)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.tva_rate}
                      onChange={(e) => setFormData({ ...formData, tva_rate: e.target.value })}
                      step="0.1"
                    />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Unité</label>
                    <select
                      className="form-select"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    >
                      <option value="unité">Unité</option>
                      <option value="heure">Heure</option>
                      <option value="jour">Jour</option>
                      <option value="m²">Mètre carré</option>
                      <option value="m">Mètre</option>
                      <option value="kg">Kilogramme</option>
                      <option value="forfait">Forfait</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="Illimité si vide"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">📁 Nouvelle catégorie</h3>
              <button className="modal-close" onClick={() => setShowCategoryModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateCategory}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nom de la catégorie</label>
                  <input
                    type="text"
                    className="form-input"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                </div>
                {categories.length > 0 && (
                  <div>
                    <label className="form-label">Catégories existantes</label>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {categories.map((cat) => (
                        <div key={cat.id} style={{
                          padding: '8px 12px',
                          background: 'var(--background)',
                          borderRadius: '6px',
                          marginBottom: '4px'
                        }}>
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCategoryModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
