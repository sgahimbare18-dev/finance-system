import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Payroll from "./pages/Payroll";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";
import Login from "./pages/Login";
import TenantAdmin from "./pages/TenantAdmin";
import RBACAdmin from "./pages/RBACAdmin";
import IntegrationAdmin from "./pages/IntegrationAdmin";
import WhiteLabelAdmin from "./pages/WhiteLabelAdmin";
import Communications from "./pages/Communications";
import AdminInvitations from "./pages/AdminInvitations";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme;
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Optionally call backend signout if needed
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="sidebar-title">💰 Dicethelifecoach Finance</h1>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-link">📊 Dashboard</Link>
          <Link to="/budgets" className="nav-link">📋 Budgets</Link>
          <Link to="/expenses" className="nav-link">💸 Expenses</Link>
          <Link to="/income" className="nav-link">💰 Income</Link>
          <Link to="/payroll" className="nav-link">💼 Payroll</Link>
          <Link to="/reports" className="nav-link">📈 Reports</Link>
          <Link to="/goals" className="nav-link">🎯 Goals</Link>
          <div className="nav-section">
            <button
              className="nav-link enterprise-toggle"
              onClick={() => setEnterpriseOpen(!enterpriseOpen)}
            >
              🏢 Enterprise {enterpriseOpen ? '▼' : '▶'}
            </button>
            {enterpriseOpen && (
              <div className="enterprise-submenu">
                <Link to="/communications" className="nav-link submenu-link">💬 Communications</Link>
                <Link to="/admin-invitations" className="nav-link submenu-link">📧 Admin Invitations</Link>
                <Link to="/tenant-admin" className="nav-link submenu-link">🏢 Tenant Admin</Link>
                <Link to="/rbac-admin" className="nav-link submenu-link">🔐 RBAC Admin</Link>
                <Link to="/integration-admin" className="nav-link submenu-link">🔗 Integrations</Link>
                <Link to="/whitelabel-admin" className="nav-link submenu-link">🌍 White Label</Link>
              </div>
            )}
          </div>
        </nav>
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={() => {
            const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
            document.body.className = newTheme;
            localStorage.setItem('theme', newTheme);
          }}>
            {document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/income" element={<Income />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/admin-invitations" element={<AdminInvitations />} />
          <Route path="/tenant-admin" element={<TenantAdmin />} />
          <Route path="/rbac-admin" element={<RBACAdmin />} />
          <Route path="/integration-admin" element={<IntegrationAdmin />} />
          <Route path="/whitelabel-admin" element={<WhiteLabelAdmin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
