import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TenantAdmin() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    settings: {
      currency: "USD",
      timezone: "America/New_York",
      logo: "/logos/default-logo.png",
      primaryColor: "#4f46e5"
    }
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/api/tenants");
      setTenants(response.data);
    } catch (err) {
      setError("Failed to fetch tenants");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`http://127.0.0.1:4000/api/tenants/${formData.id}`, formData);
      } else {
        await axios.post("http://127.0.0.1:4000/api/tenants", formData);
      }
      setShowForm(false);
      setFormData({
        name: "",
        domain: "",
        settings: {
          currency: "USD",
          timezone: "America/New_York",
          logo: "/logos/default-logo.png",
          primaryColor: "#4f46e5"
        }
      });
      fetchTenants();
    } catch (err) {
      setError("Failed to save tenant");
    }
  };

  const handleEdit = (tenant) => {
    setFormData(tenant);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      try {
        await axios.delete(`http://127.0.0.1:4000/api/tenants/${id}`);
        fetchTenants();
      } catch (err) {
        setError("Failed to delete tenant");
      }
    }
  };

  if (loading) return <div className="loading">Loading tenants... 🏢</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h2>🏢 Multi-Tenant Administration</h2>
      <p className="page-description">
        Manage multiple organizations and their isolated data environments.
        Each tenant operates independently with their own branding and settings.
      </p>

      <div className="actions">
        <button onClick={() => setShowForm(true)} className="btn-primary">
          ➕ Add New Tenant
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{formData.id ? "Edit Tenant" : "Add New Tenant"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Company Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Domain:</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Currency:</label>
                <select
                  value={formData.settings.currency}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {...formData.settings, currency: e.target.value}
                  })}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
              <div className="form-group">
                <label>Primary Color:</label>
                <input
                  type="color"
                  value={formData.settings.primaryColor}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {...formData.settings, primaryColor: e.target.value}
                  })}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {formData.id ? "Update" : "Create"} Tenant
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="tenant-grid">
        {tenants.map(tenant => (
          <div key={tenant.id} className="tenant-card">
            <div className="tenant-header">
              <h3>{tenant.name}</h3>
              <span className={`status ${tenant.status}`}>{tenant.status}</span>
            </div>
            <div className="tenant-details">
              <p><strong>Domain:</strong> {tenant.domain}</p>
              <p><strong>Currency:</strong> {tenant.settings.currency}</p>
              <p><strong>Created:</strong> {new Date(tenant.created_at).toLocaleDateString()}</p>
            </div>
            <div className="tenant-actions">
              <button onClick={() => handleEdit(tenant)} className="btn-edit">✏️ Edit</button>
              <button onClick={() => handleDelete(tenant.id)} className="btn-delete">🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
