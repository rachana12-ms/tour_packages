import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import HomePage from "./components/Layout/HomePage";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import CustomerDashboard from "./components/Dashboard/CustomerDashboard";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import TourDetails from "./components/Tour/TourDetails";

import "./App.css";

function App() {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  console.log("role in localStorage:", localStorage.getItem("role")); // <-- Add here
  const isAuthenticated = !!(username && password);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" />
              : <HomePage />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-based dashboards */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              role === "admin"
                ? <AdminDashboard username={username} password={password} />
                : <CustomerDashboard username={username} password={password} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/tour/:id" element={<TourDetails username={username} password={password} />} />

        {/* Default Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;