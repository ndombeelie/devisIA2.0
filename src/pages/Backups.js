import React, { useState } from 'react';

export default function Backups({ company }) {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const result = await window.electronAPI.exportBackup({ 
        format, 
        companyId: company.id 
      });
      
      if (result.success) {
        alert(`Sauvegarde exportée avec succès !\n${result.path}`);
      } else if (!result.cancelled) {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const result = await window.electronAPI.importBackup();
      
      if (result.success) {
        alert('Sauvegarde importée avec succès !');
      } else if (!result.cancelled) {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'import');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-3">📁 Sauvegardes</h2>

      <div className="card mb-2">
        <h3 className="card-title mb-2">📤 Exporter les données</h3>
        <p className="text-muted mb-2">
          Téléchargez une copie de sauvegarde de toutes vos données.
        </p>
        <div className="flex gap-1">
          <button
            className="btn btn-primary"
            onClick={() => handleExport('json')}
            disabled={exporting}
          >
            {exporting ? 'Export en cours...' : '📥 Exporter en JSON'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleExport('sqlite')}
            disabled={exporting}
          >
            🗄️ Exporter la base SQLite
          </button>
        </div>
      </div>

      <div className="card mb-2">
        <h3 className="card-title mb-2">📥 Importer les données</h3>
        <p className="text-muted mb-2">
          Restaurez vos données à partir d'une sauvegarde précédente.
        </p>
        <button
          className="btn btn-secondary"
          onClick={handleImport}
          disabled={importing}
        >
          {importing ? 'Import en cours...' : '📂 Sélectionner un fichier'}
        </button>
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(245, 158, 11, 0.1)',
          borderRadius: '8px',
          fontSize: '13px'
        }}>
          ⚠️ <strong>Attention :</strong> L'import remplacera les données existantes.
        </div>
      </div>

      <div className="card">
        <h3 className="card-title mb-2">ℹ️ Informations</h3>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          <p><strong>Format JSON :</strong> Recommandé pour la compatibilité. Peut être ouvert avec n'importe quel éditeur de texte.</p>
          <p><strong>Format SQLite :</strong> Copie exacte de la base de données. Utile pour les sauvegardes complètes.</p>
          <p style={{ marginTop: '16px' }}>
            📁 Les données sont stockées localement sur votre ordinateur.
            Aucune donnée n'est envoyée sur Internet.
          </p>
        </div>
      </div>
    </div>
  );
}
