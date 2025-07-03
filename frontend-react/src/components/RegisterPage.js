import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

function RegisterPage({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState(""); // Optional
  const [fullName, setFullName] = useState(""); // Optional
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const payload = {
      username,
      password,
      role,
    };

    // Only include optional fields if filled
    if (email.trim()) payload.email = email;
    if (fullName.trim()) payload.fullName = fullName;

    try {
      const response = await fetch("http://localhost:8087/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const user = await response.json();
        setUser(user); // Store user info in app state
        navigate("/home");
      } else {
        setError("Registration failed. Username might be taken.");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="welcome">
        <h1>Welcome to Royal Tours</h1>
        <p>“Travel isn’t always pretty. It isn’t always comfortable. But that’s okay. The journey changes you.”</p>
      </div>

      <div className="auth-box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="text"
            placeholder="Full Name (optional)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">Register</button>
        </form>

        {error && <div className="message">{error}</div>}

        <div className="toggle">
          <span>Already have an account?</span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="link-button"
          >
            Login here
          </button>
        </div>
      </div>

      <footer>
        <h4>About Us</h4>
        <p>Royal Tours brings the world closer to you with unforgettable journeys and personalized travel experiences.</p>
        <p>&copy; 2025 Royal Tours. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default RegisterPage;
