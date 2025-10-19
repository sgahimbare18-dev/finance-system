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

// ✅ Add your deployed backend link globally here
export const API_BASE_URL = "https://finance-system-1.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    // Example:
    // fetch(`${API_BASE_URL}/api/auth/signout`, { method: "POST" });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} apiUrl={API_BASE_URL} />;
  }

  return (
    <div className="app">
      <button className="hamburger-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>×</button>
        <h1 className="sidebar-title">💰 FINANCE-SYSTEM</h1>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-link" onClick={() => setSidebarOpen(false)}>📊 Dashboard</Link>
          <Link to="/budgets" className="nav-link" onClick={() => setSidebarOpen(false)}>📋 Budgets</Link>
          <Link to="/expenses" className="nav-link" onClick={() => setSidebarOpen(false)}>💸 Expenses</Link>
          <Link to="/income" className="nav-link" onClick={() => setSidebarOpen(false)}>💰 Income</Link>
          <Link to="/payroll" className="nav-link" onClick={() => setSidebarOpen(false)}>💼 Payroll</Link>
          <Link to="/reports" className="nav-link" onClick={() => setSidebarOpen(false)}>📈 Reports</Link>
          <Link to="/goals" className="nav-link" onClick={() => setSidebarOpen(false)}>🎯 Goals</Link>
          <div className="nav-section">
            <button
              className="nav-link enterprise-toggle"
              onClick={() => setEnterpriseOpen(!enterpriseOpen)}
            >
              🏢 Enterprise {enterpriseOpen ? '▼' : '▶'}
            </button>
            {enterpriseOpen && (
              <div className="enterprise-submenu">
                <Link to="/communications" className="nav-link submenu-link" onClick={() => setSidebarOpen(false)}>💬 Communications</Link>
                <Link to="/admin-invitations" className="nav-link submenu-link" onClick={() => setSidebarOpen(false)}>📧 Admin Invitations</Link>
                <Link to="/tenant-admin" className="nav-link submenu-link" onClick={() => setSidebarOpen(false)}>🏢 Tenant Admin</Link>
                <Link to="/rbac-admin" className="nav-link submenu-link" onClick={() => setSidebarOpen(false)}>🔐 RBAC Admin</Link>
                <Link to="/integration-admin" className="nav-link submenu-link" onClick={() => setSidebarOpen(false)}>🔗 Integrations</Link>
                <Link to="/whitelabel-admin" className="nav-link submenu-link" onClick={() => setSidebarOpen(false)}>🌍 White Label</Link>
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
          <Route path="/" element={<Dashboard apiUrl={API_BASE_URL} />} />
          <Route path="/budgets" element={<Budgets apiUrl={API_BASE_URL} />} />
          <Route path="/expenses" element={<Expenses apiUrl={API_BASE_URL} />} />
          <Route path="/income" element={<Income apiUrl={API_BASE_URL} />} />
          <Route path="/payroll" element={<Payroll apiUrl={API_BASE_URL} />} />
          <Route path="/reports" element={<Reports apiUrl={API_BASE_URL} />} />
          <Route path="/goals" element={<Goals apiUrl={API_BASE_URL} />} />
          <Route path="/communications" element={<Communications apiUrl={API_BASE_URL} />} />
          <Route path="/admin-invitations" element={<AdminInvitations apiUrl={API_BASE_URL} />} />
          <Route path="/tenant-admin" element={<TenantAdmin apiUrl={API_BASE_URL} />} />
          <Route path="/rbac-admin" element={<RBACAdmin apiUrl={API_BASE_URL} />} />
          <Route path="/integration-admin" element={<IntegrationAdmin apiUrl={API_BASE_URL} />} />
          <Route path="/whitelabel-admin" element={<WhiteLabelAdmin apiUrl={API_BASE_URL} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
