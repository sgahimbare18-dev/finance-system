import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Reports() {
  const [data, setData] = useState({
    budgets: [],
    expenses: [],
    income: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetsRes, expensesRes, incomeRes] = await Promise.all([
        axios.get("http://127.0.0.1:4000/api/budgets"),
        axios.get("http://127.0.0.1:4000/api/expenses"),
        axios.get("http://127.0.0.1:4000/api/income"),
      ]);
      setData({
        budgets: budgetsRes.data,
        expenses: expensesRes.data,
        income: incomeRes.data,
      });
    } catch (err) {
      setError("Failed to fetch reports data.");
    } finally {
      setLoading(false);
    }
  };

  const totalBudgets = data.budgets.reduce((sum, b) => sum + parseFloat(b.amount_planned || 0), 0);
  const totalExpenses = data.expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const totalIncome = data.income.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);

  // Expense categories for pie chart
  const expenseCategories = {};
  data.expenses.forEach(e => {
    expenseCategories[e.category] = (expenseCategories[e.category] || 0) + parseFloat(e.amount || 0);
  });
  const categoryEntries = Object.entries(expenseCategories);

  if (loading) return <div className="loading">Loading reports... 📊</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h2>📊 Reports</h2>
      <div className="summary-cards">
        <div className="card">
          <h3>Total Budgets</h3>
          <p>${totalBudgets.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Total Expenses</h3>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Total Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Net Balance</h3>
          <p>${(totalIncome - totalExpenses).toFixed(2)}</p>
        </div>
      </div>
      <div className="chart">
        <h3>Expense Categories (Pie Chart)</h3>
        <div className="pie-chart" style={{
          background: `conic-gradient(${categoryEntries.map(([category, amount], index) => {
            const percentage = (amount / totalExpenses) * 100;
            const start = categoryEntries.slice(0, index).reduce((sum, [, amt]) => sum + (amt / totalExpenses) * 360, 0);
            const end = start + (percentage / 100) * 360;
            return `hsl(${index * 60}, 70%, 50%) ${start}deg ${end}deg`;
          }).join(', ')})`
        }}>
        </div>
        <div className="pie-legend">
          {categoryEntries.map(([category, amount], index) => {
            const percentage = (amount / totalExpenses) * 100;
            return (
              <div key={category} className="legend-item">
                <span className="legend-color" style={{ background: `hsl(${index * 60}, 70%, 50%)` }}></span>
                <span>{category}: ${amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chart">
        <h3>Budget vs. Actual Expenses</h3>
        {data.budgets.map(b => {
          const actual = data.expenses.filter(e => e.budget_id == b.id).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
          const percentage = (actual / b.amount_planned) * 100;
          return (
            <div key={b.id} className="budget-comparison">
              <span>{b.title} ({b.department})</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(percentage, 100)}%`, background: percentage > 100 ? '#dc2626' : '#4f46e5' }}></div>
              </div>
              <span>Planned: ${b.amount_planned} | Actual: ${actual.toFixed(2)} ({percentage.toFixed(1)}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
