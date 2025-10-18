import React, { useState, useEffect } from "react";
import axios from "axios";

export default function WhiteLabelAdmin() {
  const [settings, setSettings] = useState({
    domain: "",
    logo: "",
    favicon: "",
    primaryColor: "#4f46e5",
    secondaryColor: "#7c3aed",
    fontFamily: "Inter, sans-serif",
    companyName: "",
    supportEmail: "",
    customCSS: "",
    customJS: "",
    enabled: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/api/whitelabel");
      setSettings(response.data);
    } catch (err) {
      setError("Failed to fetch white-label settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://127.0.0.1:4000/api/whitelabel", settings);
      alert("White-label settings updated successfully!");
    } catch (err) {
      setError("Failed to update settings");
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('logo', file);

      try {
        const response = await axios.post("http://127.0.0.1:4000/api/whitelabel/logo", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSettings(prev => ({ ...prev, logo: response.data.logoUrl }));
      } catch (err) {
        setError("Failed to upload logo");
      }
    }
  };

  const resetToDefaults = () => {
    setSettings({
      domain: "",
      logo: "/logos/default-logo.png",
      favicon: "/favicons/default-favicon.ico",
      primaryColor: "#4f46e5",
      secondaryColor: "#7c3aed",
      fontFamily: "Inter, sans-serif",
      companyName: "Finance Management System",
      supportEmail: "support@dicethelifecoach.com",
      customCSS: "",
      customJS: "",
      enabled: true
    });
  };

  if (loading) return <div className="loading">Loading white-label settings... 🎨</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h2>🌍 White-Label Support</h2>
      <p className="page-description">
        Customize the application branding and appearance for different clients.
        Create unique experiences with custom domains, logos, colors, and themes.
      </p>

      <div className="actions">
        <button onClick={() => setPreviewMode(!previewMode)} className="btn-secondary">
          {previewMode ? "✏️ Edit Mode" : "👁️ Preview Mode"}
        </button>
        <button onClick={resetToDefaults} className="btn-warning">
          🔄 Reset to Defaults
        </button>
      </div>

      {previewMode ? (
        <div className="preview-section">
          <h3>Preview</h3>
          <div
            className="preview-app"
            style={{
              '--preview-primary': settings.primaryColor,
              '--preview-secondary': settings.secondaryColor,
              '--preview-font': settings.fontFamily
            }}
          >
            <div className="preview-navbar" style={{ backgroundColor: settings.primaryColor }}>
              <div className="preview-logo">
                {settings.logo && <img src={settings.logo} alt="Logo" style={{ height: '30px' }} />}
                <span>{settings.companyName || "Finance System"}</span>
              </div>
              <div className="preview-nav-links">
                <a href="#" style={{ color: 'white' }}>Dashboard</a>
                <a href="#" style={{ color: 'white' }}>Budgets</a>
                <a href="#" style={{ color: 'white' }}>Reports</a>
              </div>
            </div>
            <div className="preview-content" style={{ fontFamily: settings.fontFamily }}>
              <h1 style={{ color: settings.primaryColor }}>Welcome to {settings.companyName}</h1>
              <p>This is how your customized application will look to users.</p>
              <button style={{
                backgroundColor: settings.primaryColor,
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px'
              }}>
                Sample Button
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="whitelabel-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Company Name:</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                  placeholder="Your Company Name"
                />
              </div>
              <div className="form-group">
                <label>Domain:</label>
                <input
                  type="text"
                  value={settings.domain}
                  onChange={(e) => setSettings({...settings, domain: e.target.value})}
                  placeholder="app.yourcompany.com"
                />
              </div>
              <div className="form-group">
                <label>Support Email:</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                  placeholder="support@yourcompany.com"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Branding</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Logo:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                {settings.logo && (
                  <div className="logo-preview">
                    <img src={settings.logo} alt="Current logo" style={{ height: '50px' }} />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Primary Color:</label>
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Secondary Color:</label>
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Font Family:</label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => setSettings({...settings, fontFamily: e.target.value})}
                >
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="Roboto, sans-serif">Roboto</option>
                  <option value="Open Sans, sans-serif">Open Sans</option>
                  <option value="Lato, sans-serif">Lato</option>
                  <option value="Poppins, sans-serif">Poppins</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Advanced Customization</h3>
            <div className="form-group">
              <label>Custom CSS:</label>
              <textarea
                value={settings.customCSS}
                onChange={(e) => setSettings({...settings, customCSS: e.target.value})}
                placeholder="Enter custom CSS rules..."
                rows={6}
              />
            </div>
            <div className="form-group">
              <label>Custom JavaScript:</label>
              <textarea
                value={settings.customJS}
                onChange={(e) => setSettings({...settings, customJS: e.target.value})}
                placeholder="Enter custom JavaScript code..."
                rows={6}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              💾 Save White-Label Settings
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
