import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config/api.js";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    department: "",
    title: "",
    amount_planned: "",
  });
  const [search, setSearch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/budgets`);
      setBudgets(res.data);
    } catch (err) {
      setError("Failed to fetch budgets.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/budgets`, formData);
      setFormData({ department: "", title: "", amount_planned: "" });
      setShowForm(false);
      fetchBudgets();
    } catch (err) {
      setError("Failed to add budget.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axios.delete(`${API_BASE}/api/budgets/${id}`);
        fetchBudgets();
      } catch (err) {
        setError("Failed to delete budget.");
      }
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/api/budgets/${id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `budget-${id}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Failed to download budget.");
    }
  };

  const handleDownloadAll = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/budgets/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'all-budgets.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Failed to download all budgets.");
    }
  };

  const filteredBudgets = budgets.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) &&
    (filterDepartment === "" || b.department === filterDepartment) &&
    (filterStatus === "" || b.status === filterStatus)
  );

  const exportToCSV = () => {
    const csv = "Department,Title,Amount Planned,Status\n" + filteredBudgets.map(b => `${b.department},${b.title},${b.amount_planned},${b.status}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "budgets.csv";
    a.click();
  };

  if (loading) return <div className="loading">Loading budgets... 📋</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h2>📋 Budgets</h2>
      <div className="filters">
        <input type="text" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
          <option value="">All Departments</option>
          {[...new Set(budgets.map(b => b.department))].map(dep => <option key={dep} value={dep}>{dep}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {[...new Set(budgets.map(b => b.status))].map(stat => <option key={stat} value={stat}>{stat}</option>)}
        </select>
        <button className="btn-secondary" onClick={exportToCSV}>📥 Export CSV</button>
      </div>
      <button className="btn-primary" onClick={() => setShowForm(true)}>Add Budget</button>
      <button className="btn-secondary" onClick={handleDownloadAll} style={{ marginLeft: '10px' }}>Download All Budgets</button>
      <ul className="list">
        {filteredBudgets.map((b) => (
          <li key={b.id} className="list-item">
            {b.department} — {b.title} — ${b.amount_planned} ({b.status})
            <button className="btn-secondary" onClick={() => handleDownload(b.id)} style={{ marginRight: '5px' }}>Download</button>
            <button className="btn-delete" onClick={() => handleDelete(b.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Budget</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="amount_planned"
                placeholder="Amount Planned"
                value={formData.amount_planned}
                onChange={handleChange}
                required
              />
              <button type="submit" className="btn-primary">Submit</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
