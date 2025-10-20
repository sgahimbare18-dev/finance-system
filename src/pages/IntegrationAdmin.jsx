import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "../config/api.js";

export default function IntegrationAdmin() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "google_sheets",
    config: {}
  });

  const integrationTypes = [
    { value: "google_sheets", label: "Google Sheets", description: "Sync data with Google Sheets" },
    { value: "quickbooks", label: "QuickBooks", description: "Integrate with QuickBooks accounting" },
    { value: "excel", label: "Excel", description: "Import/Export Excel files" },
    { value: "hr_system", label: "HR System", description: "Connect to HR management systems" },
    { value: "crm", label: "CRM", description: "Integrate with CRM systems" }
  ];

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/integrations`);
      setIntegrations(response.data);
    } catch (err) {
      setError("Failed to fetch integrations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`${API_BASE}/api/integrations/${formData.id}`, formData);
      } else {
        await axios.post(`${API_BASE}/api/integrations`, formData);
      }
      setShowForm(false);
      setFormData({ name: "", type: "google_sheets", config: {} });
      fetchIntegrations();
    } catch (err) {
      setError("Failed to save integration");
    }
  };

  const handleSync = async (id) => {
    try {
      const response = await axios.post(`${API_BASE}/api/integrations/${id}/sync`);
      alert(`Sync completed! ${response.data.syncedRecords} records synced.`);
      fetchIntegrations();
    } catch (err) {
      setError("Failed to sync data");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this integration?")) {
      try {
        await axios.delete(`${API_BASE}/api/integrations/${id}`);
        fetchIntegrations();
      } catch (err) {
        setError("Failed to delete integration");
      }
    }
  };

  const getTypeInfo = (type) => {
    return integrationTypes.find(t => t.value === type) || { label: type, description: "" };
  };

  if (loading) return <div className="loading">Loading integrations... 🔗</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h2>🔗 Integration Layer</h2>
      <p className="page-description">
        Connect your finance system with external tools and services.
        Enable seamless data flow between HR systems, CRMs, accounting software, and more.
      </p>

      <div className="actions">
        <button onClick={() => setShowForm(true)} className="btn-primary">
          ➕ Add New Integration
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{formData.id ? "Edit Integration" : "Add New Integration"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Integration Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type:</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  {integrationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Configuration:</label>
                <textarea
                  placeholder="Enter configuration details (API keys, URLs, etc.)"
                  value={JSON.stringify(formData.config, null, 2)}
                  onChange={(e) => {
                    try {
                      const config = JSON.parse(e.target.value);
                      setFormData({...formData, config});
                    } catch (err) {
                      // Invalid JSON, keep as string for now
                    }
                  }}
                  rows={6}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {formData.id ? "Update" : "Create"} Integration
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="integrations-grid">
        {integrations.map(integration => {
          const typeInfo = getTypeInfo(integration.type);
          return (
            <div key={integration.id} className="integration-card">
              <div className="integration-header">
                <h3>{integration.name}</h3>
                <span className={`status ${integration.status}`}>{integration.status}</span>
              </div>
              <div className="integration-details">
                <p><strong>Type:</strong> {typeInfo.label}</p>
                <p><strong>Description:</strong> {typeInfo.description}</p>
                {integration.lastSync && (
                  <p><strong>Last Sync:</strong> {new Date(integration.lastSync).toLocaleString()}</p>
                )}
              </div>
              <div className="integration-actions">
                <button onClick={() => handleSync(integration.id)} className="btn-sync">
                  🔄 Sync Now
                </button>
                <button onClick={() => handleDelete(integration.id)} className="btn-delete">
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {integrations.length === 0 && (
        <div className="empty-state">
          <h3>No integrations configured</h3>
          <p>Connect your finance system with external tools to automate data flow and improve efficiency.</p>
        </div>
      )}
    </div>
  );
}
