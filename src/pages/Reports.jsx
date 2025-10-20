import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config/api.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

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
        axios.get(`${API_BASE}/api/budgets`),
        axios.get(`${API_BASE}/api/expenses`),
        axios.get(`${API_BASE}/api/income`),
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
      <div className="charts">
        <div className="chart">
          <h3>Expense Categories</h3>
          <Pie
            data={{
              labels: categoryEntries.map(([category]) => category),
              datasets: [
                {
                  data: categoryEntries.map(([, amount]) => amount),
                  backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#ff9f40"],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "right" },
                title: { display: true, text: "Expenses by Category" },
              },
            }}
          />
        </div>
        <div className="chart">
          <h3>Financial Overview</h3>
          <Bar
            data={{
              labels: ["Budgets", "Expenses", "Income", "Net Balance"],
              datasets: [
                {
                  label: "Amount ($)",
                  data: [totalBudgets, totalExpenses, totalIncome, totalIncome - totalExpenses],
                  backgroundColor: ["#3498db", "#e74c3c", "#2ecc71", "#f39c12"],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Total Amounts" },
              },
            }}
          />
        </div>
      </div>

      <div className="spacer" style={{ margin: '40px 0' }}></div>

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
