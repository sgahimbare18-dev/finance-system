import React, { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:4000/api/budgets");
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
      await axios.post("http://127.0.0.1:4000/api/budgets", formData);
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
        await axios.delete(`http://127.0.0.1:4000/api/budgets/${id}`);
        fetchBudgets();
      } catch (err) {
        setError("Failed to delete budget.");
      }
    }
  };

  if (loading) return <div className="loading">Loading budgets... 📋</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h2>📋 Budgets</h2>
      <button className="btn-primary" onClick={() => setShowForm(true)}>Add Budget</button>
      <ul className="list">
        {budgets.map((b) => (
          <li key={b.id} className="list-item">
            {b.department} — {b.title} — ${b.amount_planned} ({b.status})
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
