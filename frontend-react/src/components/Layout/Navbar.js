import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const isAuthenticated = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">🌍 Tourify</Link>
        {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        <Link to="/#filter">Filter</Link>
        <Link to="/#about">About</Link>
      </div>

      <div className="nav-right">
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
