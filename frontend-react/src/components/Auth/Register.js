import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // Use your axios helper

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    password: "",
    role: "customer", // Use lowercase if your backend expects it
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/", formData); // Adjust endpoint if needed
      setMessage("✅ Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("❌ Registration failed. Try a different username.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleRegister}>
        <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <select name="role" onChange={handleChange} value={formData.role}>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;