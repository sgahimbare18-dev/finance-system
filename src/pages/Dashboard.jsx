import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState({
    budgets: [],
    expenses: [],
    income: [],
    payroll: [],
    goals: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [budgetsRes, expensesRes, incomeRes, payrollRes, goalsRes] = await Promise.all([
        axios.get("http://127.0.0.1:4000/api/budgets"),
        axios.get("http://127.0.0.1:4000/api/expenses"),
        axios.get("http://127.0.0.1:4000/api/income"),
        axios.get("http://127.0.0.1:4000/api/payroll"),
        axios.get("http://127.0.0.1:4000/api/goals"),
      ]);
      setData({
        budgets: budgetsRes.data,
        expenses: expensesRes.data,
        income: incomeRes.data,
        payroll: payrollRes.data,
        goals: goalsRes.data,
      });
    } catch (err) {
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const totalBudgets = data.budgets.reduce((sum, b) => sum + parseFloat(b.amount_planned || 0), 0);
  const totalExpenses = data.expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const totalIncome = data.income.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
  const totalPayroll = data.payroll.reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);
  const totalGoals = data.goals.reduce((sum, g) => sum + parseFloat(g.target_amount || 0), 0);
  const achievedGoals = data.goals.filter(g => g.status === "Achieved").length;

  const maxValue = Math.max(totalBudgets, totalExpenses, totalIncome, totalPayroll, totalGoals) || 1;

  const budgetOverruns = data.budgets.filter(b => {
    const actual = data.expenses.filter(e => e.budget_id == b.id).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    return actual > b.amount_planned;
  });

  if (loading) return <div className="loading">Loading dashboard... 📊</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h2>📊 Dashboard</h2>
      <div className="summary-cards">
        <div className="card">
          <h3>Budgets</h3>
          <p>${totalBudgets.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Expenses</h3>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Payroll</h3>
          <p>${totalPayroll.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Goals</h3>
          <p>${totalGoals.toFixed(2)} ({achievedGoals} achieved)</p>
        </div>
      </div>
      {budgetOverruns.length > 0 && (
        <div className="alert">
          ⚠️ Budget overruns: {budgetOverruns.map(b => b.title).join(", ")}
        </div>
      )}
      {achievedGoals > 0 && (
        <div className="alert success">
          🎉 Goal achievements: {achievedGoals} goals reached!
        </div>
      )}
      <div className="chart">
        <h3>Simple Bar Chart</h3>
        <div className="bar" style={{ width: `${(totalBudgets / maxValue) * 100}%` }}>Budgets</div>
        <div className="bar" style={{ width: `${(totalExpenses / maxValue) * 100}%` }}>Expenses</div>
        <div className="bar" style={{ width: `${(totalIncome / maxValue) * 100}%` }}>Income</div>
        <div className="bar" style={{ width: `${(totalPayroll / maxValue) * 100}%` }}>Payroll</div>
        <div className="bar" style={{ width: `${(totalGoals / maxValue) * 100}%` }}>Goals</div>
      </div>
    </div>
  );
}
