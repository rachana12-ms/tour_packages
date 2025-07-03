import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import HomeOverlay from "./components/HomeOverlay";
import CustomerDashboard from "./components/CustomerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import BookingPage from './components/BookingPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/home" /> : <LoginPage setUser={setUser} />
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            user ? <Navigate to="/home" /> : <RegisterPage setUser={setUser} />
          }
        />

        {/* HomeOverlay (choose dashboard) */}
        <Route
          path="/home"
          element={
            user ? (
              <HomeOverlay user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Dashboard: Admin or Customer */}
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === "admin" ? (
                <AdminDashboard user={user} setUser={setUser} />
              ) : (
                <CustomerDashboard user={user} setUser={setUser} />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Booking Page (accessible without login for now) */}
        <Route path="/booking" element={<BookingPage />} />

        {/* Optional: Admin page from "/" */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Fallback 404 */}
        <Route path="*" element={<h2>404 - Page not found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
