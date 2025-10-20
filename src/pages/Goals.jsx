import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config/api.js";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", target_amount: "", current_amount: "", deadline: "" });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/goals`);
      setGoals(res.data);
    } catch (err) {
      setError("Failed to fetch goals.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/goals`, formData);
      setFormData({ name: "", target_amount: "", current_amount: "", deadline: "" });
      setShowForm(false);
      fetchGoals();
    } catch (err) {
      setError("Failed to add goal.");
    }
  };

  const handleUpdate = async (id, newAmount) => {
    try {
      await axios.put(`${API_BASE}/api/goals/${id}`, { current_amount: newAmount });
      fetchGoals();
    } catch (err) {
      setError("Failed to update goal.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await axios.delete(`${API_BASE}/api/goals/${id}`);
        fetchGoals();
      } catch (err) {
        setError("Failed to delete goal.");
      }
    }
  };

  if (loading) return <div className="loading">Loading goals... 🎯</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h2>🎯 Financial Goals</h2>
      <button className="btn-primary" onClick={() => setShowForm(true)}>Add New Goal</button>
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Goal</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Goal Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <input type="number" placeholder="Target Amount" value={formData.target_amount} onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })} required />
              <input type="number" placeholder="Current Amount" value={formData.current_amount} onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })} />
              <input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
              <button type="submit" className="btn-primary">Add Goal</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      <div className="goals-list">
        {goals.map(g => {
          const progress = (g.current_amount / g.target_amount) * 100;
          return (
            <div key={g.id} className="goal-card">
              <h3>{g.name}</h3>
              <p>Target: ${g.target_amount} | Current: ${g.current_amount}</p>
              <p>Deadline: {g.deadline} | Status: {g.status}</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
              </div>
              <div className="goal-actions">
                <input type="number" placeholder="Add Amount" onBlur={(e) => handleUpdate(g.id, parseFloat(g.current_amount) + parseFloat(e.target.value || 0))} />
                <button className="btn-delete" onClick={() => handleDelete(g.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
