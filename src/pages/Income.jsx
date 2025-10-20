import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config/api.js";

export default function Income() {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    source_name: "",
    category: "",
    amount: "",
    date_received: "",
    notes: "",
    recurrence: "None",
    recurrence_end: "",
  });
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/income`);
      setIncome(res.data);
    } catch (err) {
      setError("Failed to fetch income data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/income`, formData);
      setFormData({ source_name: "", category: "", amount: "", date_received: "", notes: "", recurrence: "None", recurrence_end: "" });
      setShowForm(false);
      fetchIncome();
    } catch (err) {
      setError("Failed to add income.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income entry?")) {
      try {
        await axios.delete(`${API_BASE}/api/income/${id}`);
        fetchIncome();
      } catch (err) {
        setError("Failed to delete income.");
      }
    }
  };

  if (loading) return <div>Loading income data... 💰</div>;
  if (error) return <div className="error">{error}</div>;

  const filteredIncome = income.filter(i =>
    i.source_name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory === "" || i.category === filterCategory) &&
    (filterDate === "" || i.date_received === filterDate)
  );

  const exportToCSV = () => {
    const csv = "Source,Category,Amount,Date,Notes\n" + filteredIncome.map(i => `${i.source_name},${i.category},${i.amount},${i.date_received},${i.notes}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "income.csv";
    a.click();
  };

  return (
    <div className="page">
      <h2>💰 Income</h2>
      <div className="filters">
        <input type="text" placeholder="Search by source" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {[...new Set(income.map(i => i.category))].map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        <button className="btn-secondary" onClick={() => setShowCalendar(!showCalendar)}>📅 Calendar View</button>
        <button className="btn-secondary" onClick={exportToCSV}>📥 Export CSV</button>
      </div>
      <button className="btn-primary" onClick={() => setShowForm(true)}>Add Income</button>
      {showCalendar && (
        <div className="calendar">
          <h4>Calendar View</h4>
          <div className="calendar-grid">
            {filteredIncome.map((i) => (
              <div key={i.id} className="calendar-item" style={{ gridColumn: new Date(i.date_received).getDate() }}>
                <strong>{i.source_name}</strong><br />${i.amount}
              </div>
            ))}
          </div>
        </div>
      )}
      <ul className="list">
        {filteredIncome.map((i) => (
          <li key={i.id} className="list-item">
            {i.source_name} — {i.category} — ${i.amount} — {i.date_received} — {i.notes}
            <button className="btn-delete" onClick={() => handleDelete(i.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Income</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="source_name"
                placeholder="Source Name"
                value={formData.source_name}
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
                type="date"
                name="date_received"
                value={formData.date_received}
                onChange={handleChange}
                required
              />
              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleChange}
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
