import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function QuoteForm({ company }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [quoteNumber, setQuoteNumber] = useState('');
  
  const [quote, setQuote] = useState({
    client_id: '',
    date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    status: 'draft',
    subtotal: 0,
    tva_amount: 0,
    discount: 0,
    additional_fees: 0,
    total: 0,
    notes: '',
    terms: ''
  });

  const [items, setItems] = useState([{
    product_id: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    tva_rate: 0,
    discount: 0,
    total: 0
  }]);

  useEffect(() => {
    loadData();
    if (!id) {
      generateNumber();
    }
  }, [company.id, id]);

  const loadData = async () => {
    try {
      const [clientsData, productsData] = await Promise.all([
        window.electronAPI.getClients(company.id),
        window.electronAPI.getProducts(company.id)
      ]);
      setClients(clientsData);
      setProducts(productsData);

      if (id) {
        const quoteData = await window.electronAPI.getQuote(parseInt(id));
        if (quoteData) {
          setQuote({
            client_id: quoteData.client_id,
            date: quoteData.date?.split('T')[0] || new Date().toISOString().split('T')[0],
            expiry_date: quoteData.expiry_date?.split('T')[0] || '',
            status: quoteData.status,
            subtotal: quoteData.subtotal,
            tva_amount: quoteData.tva_amount,
            discount: quoteData.discount,
            additional_fees: quoteData.additional_fees,
            total: quoteData.total,
            notes: quoteData.notes || '',
            terms: quoteData.terms || ''
          });
          setQuoteNumber(quoteData.quote_number);
          setItems(quoteData.items.map(item => ({
            id: item.id,
            product_id: item.product_id,
            description: item.description || '',
            quantity: item.quantity,
            unit_price: item.unit_price,
            tva_rate: item.tva_rate,
            discount: item.discount,
            total: item.total
          })));
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const generateNumber = async () => {
    const num = await window.electronAPI.generateQuoteNumber(company.id);
    setQuoteNumber(num);
  };

  const calculateTotals = (updatedItems) => {
    let subtotal = 0;
    let tvaAmount = 0;

    updatedItems.forEach(item => {
      const lineTotal = (item.quantity * item.unit_price) - item.discount;
      subtotal += lineTotal;
      tvaAmount += lineTotal * (item.tva_rate / 100);
    });

    const total = subtotal + tvaAmount - quote.discount + quote.additional_fees;

    setQuote(prev => ({
      ...prev,
      subtotal: Math.round(subtotal * 100) / 100,
      tva_amount: Math.round(tvaAmount * 100) / 100,
      total: Math.round(total * 100) / 100
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // Si on sélectionne un produit, remplir automatiquement
    if (field === 'product_id' && value) {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        updatedItems[index].description = product.name;
        updatedItems[index].unit_price = product.price_ht;
        updatedItems[index].tva_rate = product.tva_rate;
      }
    }

    // Calculer le total de la ligne
    const item = updatedItems[index];
    item.total = (item.quantity * item.unit_price) - item.discount;

    setItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const addItem = () => {
    setItems([...items, {
      product_id: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      tva_rate: 0,
      discount: 0,
      total: 0
    }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const quoteData = {
        ...quote,
        company_id: company.id,
        quote_number: quoteNumber,
        client_id: parseInt(quote.client_id) || null
      };

      if (id) {
        await window.electronAPI.updateQuote({
          quote: { ...quoteData, id: parseInt(id) },
          items: items.map(item => ({
            ...item,
            product_id: item.product_id ? parseInt(item.product_id) : null
          }))
        });
      } else {
        await window.electronAPI.createQuote({
          quote: quoteData,
          items: items.map(item => ({
            ...item,
            product_id: item.product_id ? parseInt(item.product_id) : null
          }))
        });
      }

      navigate('/quotes');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="flex-between mb-2">
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>
          {id ? `📄 Modifier le devis ${quoteNumber}` : '📄 Nouveau devis'}
        </h2>
        <button className="btn btn-secondary" onClick={() => navigate('/quotes')}>
          ← Retour
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Informations générales */}
        <div className="card mb-2">
          <h3 className="card-title mb-2">Informations générales</h3>
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">N° Devis</label>
              <input
                type="text"
                className="form-input"
                value={quoteNumber}
                onChange={(e) => setQuoteNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Client *</label>
              <select
                className="form-select"
                value={quote.client_id}
                onChange={(e) => setQuote({ ...quote, client_id: e.target.value })}
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company_name || `${client.first_name} ${client.last_name}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Statut</label>
              <select
                className="form-select"
                value={quote.status}
                onChange={(e) => setQuote({ ...quote, status: e.target.value })}
              >
                <option value="draft">Brouillon</option>
                <option value="sent">Envoyé</option>
                <option value="accepted">Accepté</option>
                <option value="refused">Refusé</option>
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={quote.date}
                onChange={(e) => setQuote({ ...quote, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date d'échéance</label>
              <input
                type="date"
                className="form-input"
                value={quote.expiry_date}
                onChange={(e) => setQuote({ ...quote, expiry_date: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Lignes de devis */}
        <div className="card mb-2">
          <div className="flex-between mb-2">
            <h3 className="card-title">Lignes du devis</h3>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
              + Ajouter une ligne
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Produit</th>
                  <th style={{ width: '25%' }}>Description</th>
                  <th style={{ width: '10%' }}>Quantité</th>
                  <th style={{ width: '12%' }}>Prix unitaire</th>
                  <th style={{ width: '8%' }}>TVA %</th>
                  <th style={{ width: '10%' }}>Remise</th>
                  <th style={{ width: '10%' }}>Total</th>
                  <th style={{ width: '5%' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <select
                        className="form-select"
                        value={item.product_id}
                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                      >
                        <option value="">Sélectionner</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        value={item.tva_rate}
                        onChange={(e) => handleItemChange(index, 'tva_rate', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {formatCurrency(item.total)}
                    </td>
                    <td>
                      {items.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeItem(index)}
                        >
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totaux et notes */}
        <div className="grid-2">
          <div className="card">
            <h3 className="card-title mb-2">Notes et conditions</h3>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={quote.notes}
                onChange={(e) => setQuote({ ...quote, notes: e.target.value })}
                rows={3}
                placeholder="Notes internes..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Conditions générales</label>
              <textarea
                className="form-textarea"
                value={quote.terms}
                onChange={(e) => setQuote({ ...quote, terms: e.target.value })}
                rows={4}
                placeholder="Conditions de paiement, validité..."
              />
            </div>
          </div>

          <div className="card">
            <h3 className="card-title mb-2">Récapitulatif</h3>
            <div style={{ fontSize: '14px' }}>
              <div className="flex-between mb-1">
                <span>Sous-total HT</span>
                <span style={{ fontWeight: 500 }}>{formatCurrency(quote.subtotal)}</span>
              </div>
              <div className="flex-between mb-1">
                <span>TVA</span>
                <span style={{ fontWeight: 500 }}>{formatCurrency(quote.tva_amount)}</span>
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Remise globale</label>
                <input
                  type="number"
                  className="form-input"
                  value={quote.discount}
                  onChange={(e) => {
                    const discount = parseFloat(e.target.value) || 0;
                    setQuote(prev => ({
                      ...prev,
                      discount,
                      total: Math.round((prev.subtotal + prev.tva_amount - discount + prev.additional_fees) * 100) / 100
                    }));
                  }}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Frais supplémentaires</label>
                <input
                  type="number"
                  className="form-input"
                  value={quote.additional_fees}
                  onChange={(e) => {
                    const fees = parseFloat(e.target.value) || 0;
                    setQuote(prev => ({
                      ...prev,
                      additional_fees: fees,
                      total: Math.round((prev.subtotal + prev.tva_amount - prev.discount + fees) * 100) / 100
                    }));
                  }}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex-between" style={{
                padding: '16px',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: '8px',
                marginTop: '16px',
                fontSize: '18px',
                fontWeight: 600
              }}>
                <span>Total TTC</span>
                <span>{formatCurrency(quote.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 mt-2" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/quotes')}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            💾 Enregistrer le devis
          </button>
        </div>
      </form>
    </div>
  );
}
