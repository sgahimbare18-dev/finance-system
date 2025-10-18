import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RBACAdmin() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: []
  });

  const availablePermissions = [
    "budgets:read", "budgets:write", "budgets:delete",
    "expenses:read", "expenses:write", "expenses:delete",
    "income:read", "income:write", "income:delete",
    "payroll:read", "payroll:write", "payroll:delete",
    "goals:read", "goals:write", "goals:delete",
    "reports:read", "reports:write", "reports:delete",
    "users:read", "users:write", "users:delete"
  ];

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/api/rbac/roles");
      setRoles(response.data);
    } catch (err) {
      setError("Failed to fetch roles");
    }
  };

  const fetchUsers = async () => {
    try {
      // Mock user data - in production, this would come from an API
      setUsers([
        { id: 1, email: "cbella@dicthelifecoach.com", role: "Super Admin" },
        { id: 2, email: "sgahimbare@dicethelifecoach.com", role: "Finance Officer" }
      ]);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`http://127.0.0.1:4000/api/rbac/roles/${formData.id}`, formData);
      } else {
        await axios.post("http://127.0.0.1:4000/api/rbac/roles", formData);
      }
      setShowForm(false);
      setFormData({ name: "", description: "", permissions: [] });
      fetchRoles();
    } catch (err) {
      setError("Failed to save role");
    }
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleAssignRole = async (userId, roleId) => {
    try {
      await axios.post("http://127.0.0.1:4000/api/rbac/assign", { userId, roleId });
      fetchUsers();
    } catch (err) {
      setError("Failed to assign role");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axios.delete(`http://127.0.0.1:4000/api/rbac/roles/${id}`);
        fetchRoles();
      } catch (err) {
        setError("Failed to delete role");
      }
    }
  };

  if (loading) return <div className="loading">Loading RBAC settings... 🔐</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h2>🔐 Role-Based Access Control (RBAC)</h2>
      <p className="page-description">
        Manage user roles and permissions to control access to different features and data.
        Create custom roles with granular permission settings.
      </p>

      <div className="actions">
        <button onClick={() => setShowForm(true)} className="btn-primary">
          ➕ Create New Role
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{formData.id ? "Edit Role" : "Create New Role"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Role Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Permissions:</label>
                <div className="permissions-grid">
                  {availablePermissions.map(permission => (
                    <label key={permission} className="permission-item">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                      />
                      {permission}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {formData.id ? "Update" : "Create"} Role
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rbac-sections">
        <div className="rbac-section">
          <h3>Roles</h3>
          <div className="roles-list">
            {roles.map(role => (
              <div key={role.id} className="role-card">
                <div className="role-header">
                  <h4>{role.name}</h4>
                  <button onClick={() => handleDelete(role.id)} className="btn-delete">🗑️</button>
                </div>
                <p>{role.description}</p>
                <div className="permissions">
                  <strong>Permissions:</strong>
                  <div className="permission-tags">
                    {role.permissions.map(perm => (
                      <span key={perm} className="permission-tag">{perm}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rbac-section">
          <h3>User Role Assignments</h3>
          <div className="users-list">
            {users.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <strong>{user.email}</strong>
                  <span className="current-role">Current Role: {user.role}</span>
                </div>
                <div className="role-assignment">
                  <select
                    onChange={(e) => handleAssignRole(user.email, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Change Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
