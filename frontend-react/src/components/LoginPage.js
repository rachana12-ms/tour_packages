import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

function LoginPage({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const credentials = btoa(`${username}:${password}`);

    try {
      const response = await fetch(`http://localhost:8087/api/users/${username}`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (response.ok) {
  const user = await response.json();
  setUser(user);

  // ✅ Clear old user session before saving new one
  localStorage.clear();

  // ✅ Store fresh login credentials
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);

  // ✅ Save user object including email
  localStorage.setItem("user", JSON.stringify({
    username: user.username,
    email: user.email || "", // fallback if backend email is missing
    role: user.role || "CUSTOMER"
  }));

  navigate("/home");
}
else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
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
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>

        {error && <div className="message">{error}</div>}

        <div className="toggle">
          <span>Don't have an account?</span>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="link-button"
          >
            Register here
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

export default LoginPage;
