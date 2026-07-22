import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Companies from './pages/Companies';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Quotes from './pages/Quotes';
import QuoteForm from './pages/QuoteForm';
import Invoices from './pages/Invoices';
import InvoiceForm from './pages/InvoiceForm';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Backups from './pages/Backups';
import AIAssistant from './pages/AIAssistant';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const user = localStorage.getItem('user');
    const company = localStorage.getItem('currentCompany');
    
    if (user) {
      setIsAuthenticated(true);
      if (company) {
        setCurrentCompany(JSON.parse(company));
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('currentCompany');
    setIsAuthenticated(false);
    setCurrentCompany(null);
  };

  const selectCompany = (company) => {
    setCurrentCompany(company);
    localStorage.setItem('currentCompany', JSON.stringify(company));
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'var(--background)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" />
          <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : !currentCompany ? (
          <>
            <Route 
              path="/companies" 
              element={<Companies onSelectCompany={selectCompany} />} 
            />
            <Route path="*" element={<Navigate to="/companies" replace />} />
          </>
        ) : (
          <>
            <Route 
              path="/*" 
              element={
                <Layout 
                  onLogout={handleLogout} 
                  currentCompany={currentCompany}
                  onChangeCompany={() => setCurrentCompany(null)}
                >
                  <Routes>
                    <Route path="/" element={<Dashboard company={currentCompany} />} />
                    <Route path="/clients" element={<Clients company={currentCompany} />} />
                    <Route path="/products" element={<Products company={currentCompany} />} />
                    <Route path="/quotes" element={<Quotes company={currentCompany} />} />
                    <Route path="/quotes/new" element={<QuoteForm company={currentCompany} />} />
                    <Route path="/quotes/edit/:id" element={<QuoteForm company={currentCompany} />} />
                    <Route path="/invoices" element={<Invoices company={currentCompany} />} />
                    <Route path="/invoices/new" element={<InvoiceForm company={currentCompany} />} />
                    <Route path="/invoices/edit/:id" element={<InvoiceForm company={currentCompany} />} />
                    <Route path="/statistics" element={<Statistics company={currentCompany} />} />
                    <Route path="/settings" element={<Settings company={currentCompany} />} />
                    <Route path="/backups" element={<Backups company={currentCompany} />} />
                    <Route path="/ai-assistant" element={<AIAssistant company={currentCompany} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              } 
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
