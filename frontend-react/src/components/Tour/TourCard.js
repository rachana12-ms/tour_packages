import React from "react";
import { useNavigate } from "react-router-dom";

function TourCard({ tour, showBookButton = false, showEditDelete = false, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="tour-card">
      <img src={tour.image || "/default-tour.jpg"} alt={tour.destination} className="tour-image" />

      <div className="tour-content">
        <h3>{tour.destination}</h3>
        <p><strong>Price:</strong> ₹{tour.price}</p>
        <p><strong>Duration:</strong> {tour.duration} days</p>

        <button onClick={() => navigate(`/tour/${tour.id}`)}>View Details</button>

        {showBookButton && (
          <button
            onClick={() => alert("✅ Package booked successfully!")}
            className="book-button"
          >
            Book Package
          </button>
        )}

        {showEditDelete && (
          <>
            <button onClick={() => onEdit(tour)} className="edit-button">✏️ Edit</button>
            <button onClick={() => onDelete(tour.id)} className="delete-button">❌ Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

export default TourCard;