import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config/api.js";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    budget_id: "",
    category: "",
    amount: "",
    description: "",
    date: "",
    recurrence: "None",
    recurrence_end: "",
  });
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/expenses`);
      setExpenses(res.data);
    } catch (err) {
      setError("Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/expenses`, formData);
      setFormData({ budget_id: "", category: "", amount: "", description: "", date: "", recurrence: "None", recurrence_end: "" });
      setShowForm(false);
      fetchExpenses();
    } catch (err) {
      setError("Failed to add expense.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(`${API_BASE}/api/expenses/${id}`);
        fetchExpenses();
      } catch (err) {
        setError("Failed to delete expense.");
      }
    }
  };

  if (loading) return <div className="loading">Loading expenses... 💸</div>;
  if (error) return <div className="error">{error}</div>;

  const filteredExpenses = expenses.filter(e =>
    e.description.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory === "" || e.category === filterCategory) &&
    (filterDate === "" || e.date === filterDate)
  );

  const exportToCSV = () => {
    const csv = "Category,Amount,Description,Date\n" + filteredExpenses.map(e => `${e.category},${e.amount},${e.description},${e.date}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
  };

  return (
    <div className="page">
      <h2>💸 Expenses</h2>
      <div className="filters">
        <input type="text" placeholder="Search by description" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {[...new Set(expenses.map(e => e.category))].map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        <button className="btn-secondary" onClick={() => setShowCalendar(!showCalendar)}>📅 Calendar View</button>
        <button className="btn-secondary" onClick={exportToCSV}>📥 Export CSV</button>
      </div>
      <button className="btn-primary" onClick={() => setShowForm(true)}>Add Expense</button>
      {showCalendar && (
        <div className="calendar">
          <h4>Calendar View</h4>
          <div className="calendar-grid">
            {filteredExpenses.map((e) => (
              <div key={e.id} className="calendar-item" style={{ gridColumn: new Date(e.date).getDate() }}>
                <strong>{e.category}</strong><br />${e.amount}
              </div>
            ))}
          </div>
        </div>
      )}
      <ul className="list">
        {filteredExpenses.map((e) => (
          <li key={e.id} className="list-item">
            {e.category} — ${e.amount} — {e.description} — {e.date}
            <button className="btn-delete" onClick={() => handleDelete(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Expense</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                name="budget_id"
                placeholder="Budget ID"
                value={formData.budget_id}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <select name="recurrence" value={formData.recurrence} onChange={handleChange}>
                <option value="None">No Recurrence</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
              <input
                type="date"
                name="recurrence_end"
                placeholder="Recurrence End Date"
                value={formData.recurrence_end}
                onChange={handleChange}
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
