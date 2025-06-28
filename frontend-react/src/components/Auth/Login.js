import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // Your axios helper with Basic Auth support

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Try to fetch user info with Basic Auth
      const res = await api.get(`/users/${username}`, {
        auth: { username, password }
      });
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      localStorage.setItem("role", res.data.role); // Adjust if your backend returns role differently

      navigate("/dashboard");
    } catch (err) {
      setError("❌ Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;