import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Payroll from "./pages/Payroll";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";

export default function App(){
  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="sidebar-title">💰 Dicethelifecoach Finance</h1>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-link">📊 Dashboard</Link>
          <Link to="/budgets" className="nav-link">📋 Budgets</Link>
          <Link to="/expenses" className="nav-link">💸 Expenses</Link>
          <Link to="/income" className="nav-link">💰 Income</Link>
          <Link to="/payroll" className="nav-link">💼 Payroll</Link>
          <Link to="/reports" className="nav-link">📈 Reports</Link>
          <Link to="/goals" className="nav-link">🎯 Goals</Link>
        </nav>
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={() => document.body.classList.toggle('dark')}>🌙 Toggle Theme</button>
        </div>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/budgets" element={<Budgets/>} />
          <Route path="/expenses" element={<Expenses/>} />
          <Route path="/income" element={<Income/>} />
          <Route path="/payroll" element={<Payroll/>} />
          <Route path="/reports" element={<Reports/>} />
          <Route path="/goals" element={<Goals/>} />
        </Routes>
      </main>
    </div>
  );
}
