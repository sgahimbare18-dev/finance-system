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
        axios.get(`${API_BASE}/api/budgets`),
        axios.get(`${API_BASE}/api/expenses`),
        axios.get(`${API_BASE}/api/income`),
        axios.get(`${API_BASE}/api/payroll`),
        axios.get(`${API_BASE}/api/goals`),
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
      <div className="charts">
        <div className="chart">
          <h3>Financial Overview</h3>
          <Bar
            data={{
              labels: ["Budgets", "Expenses", "Income", "Payroll", "Goals"],
              datasets: [
                {
                  label: "Amount ($)",
                  data: [totalBudgets, totalExpenses, totalIncome, totalPayroll, totalGoals],
                  backgroundColor: ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6"],
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
        <div className="chart">
          <h3>Expense Categories</h3>
          <Pie
            data={{
              labels: [...new Set(data.expenses.map(e => e.category))],
              datasets: [
                {
                  data: [...new Set(data.expenses.map(e => e.category))].map(cat =>
                    data.expenses.filter(e => e.category === cat).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
                  ),
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
          <h3>Income vs Expenses Trend</h3>
          <Line
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // Mock months
              datasets: [
                {
                  label: "Income",
                  data: [totalIncome * 0.8, totalIncome * 0.9, totalIncome, totalIncome * 1.1, totalIncome * 1.2, totalIncome * 1.3], // Mock trend
                  borderColor: "#2ecc71",
                  backgroundColor: "rgba(46, 204, 113, 0.2)",
                },
                {
                  label: "Expenses",
                  data: [totalExpenses * 0.7, totalExpenses * 0.8, totalExpenses, totalExpenses * 1.1, totalExpenses * 1.2, totalExpenses * 1.3], // Mock trend
                  borderColor: "#e74c3c",
                  backgroundColor: "rgba(231, 76, 60, 0.2)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Monthly Trend" },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
