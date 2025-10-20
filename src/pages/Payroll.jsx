import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config/api.js";

export default function Payroll() {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: "",
    month: "",
    amount_paid: "",
    status: "Pending",
    payment_date: "",
  });

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/payroll`);
      setPayroll(res.data);
    } catch (err) {
      setError("Failed to fetch payroll data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/payroll`, formData);
      setFormData({ employee_id: "", month: "", amount_paid: "", status: "Pending", payment_date: "" });
      setShowForm(false);
      fetchPayroll();
    } catch (err) {
      setError("Failed to add payroll.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payroll entry?")) {
      try {
        await axios.delete(`${API_BASE}/api/payroll/${id}`);
        fetchPayroll();
      } catch (err) {
        setError("Failed to delete payroll.");
      }
    }
  };

  if (loading) return <div>Loading payroll data... 💼</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h2>💼 Payroll</h2>
      <button className="btn-primary" onClick={() => setShowForm(true)}>Add Payroll</button>
      <ul className="list">
        {payroll.map((p) => (
          <li key={p.id} className="list-item">
            Employee {p.employee_id} — {p.month} — ${p.amount_paid} — {p.status} — {p.payment_date}
            <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Payroll</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                name="employee_id"
                placeholder="Employee ID"
                value={formData.employee_id}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="month"
                placeholder="Month (e.g., January 2023)"
                value={formData.month}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="amount_paid"
                placeholder="Amount Paid"
                value={formData.amount_paid}
                onChange={handleChange}
                required
              />
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
              <input
                type="date"
                name="payment_date"
                value={formData.payment_date}
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
