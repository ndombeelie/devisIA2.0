import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/', icon: '🏠', label: 'Tableau de bord' },
  { path: '/quotes', icon: '📄', label: 'Devis' },
  { path: '/invoices', icon: '🧾', label: 'Factures' },
  { path: '/clients', icon: '👥', label: 'Clients' },
  { path: '/products', icon: '📦', label: 'Produits' },
  { path: '/ai-assistant', icon: '🤖', label: 'IA Assistant' },
  { path: '/statistics', icon: '📊', label: 'Statistiques' },
  { path: '/backups', icon: '📁', label: 'Sauvegardes' },
  { path: '/settings', icon: '⚙️', label: 'Paramètres' },
];

export default function Layout({ children, onLogout, currentCompany, onChangeCompany }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const location = useLocation();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '70px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--primary)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            D
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>DevisAI</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Desktop</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                fontWeight: isActive ? 500 : 400,
                marginBottom: '4px',
                transition: 'all 0.2s ease'
              })}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Company Selector */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border)'
        }}>
          <button
            onClick={onChangeCompany}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 500,
              flexShrink: 0
            }}>
              {currentCompany?.name?.charAt(0) || 'E'}
            </div>
            {sidebarOpen && (
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentCompany?.name || 'Sélectionner'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Changer d'entreprise
                </div>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          height: '64px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                padding: '8px'
              }}
            >
              ☰
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: 600 }}>
              {menuItems.find(m => m.path === location.pathname)?.label || 'DevisAI Desktop'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="btn btn-secondary btn-sm"
            >
              🚪 Déconnexion
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          background: 'var(--background)'
        }}>
          {children}
        </div>
      </main>
    </div>
  );
}
