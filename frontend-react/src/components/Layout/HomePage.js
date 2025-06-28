import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>Welcome to Royal Tours 🌴</h1>
        <p>
          Discover and book the most exquisite tour packages across India.<br />
          From royal palaces to serene hills, we curate journeys that create memories for a lifetime.
        </p>
        <div className="about">
          <strong>About Us:</strong>
          <p>
            Royal Tours is a passionate team of travel experts dedicated to bringing you the best experiences. Our packages are handpicked for comfort, adventure, and cultural richness.
          </p>
        </div>
        <div className="contact">
          <strong>Contact Us:</strong>
          <p>
            Email: <a href="mailto:info@royaltours.com">info@royaltours.com</a><br />
            Phone: +91-9876543210<br />
            Address: 123, Palace Road, Bengaluru, India
          </p>
        </div>
        <div className="hero-buttons">
          <button onClick={() => navigate("/login")}>🔐 Login</button>
          <button onClick={() => navigate("/register")}>📝 Register</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;