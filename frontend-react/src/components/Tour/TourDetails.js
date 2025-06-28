import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

function TourDetails() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);

  useEffect(() => {
  const fetchTour = async () => {
    try {
      const res = await api.get(`/tour-packages/${id}`);
      // If the response is an array, use the first item
      const tourData = Array.isArray(res.data) ? res.data[0] : res.data;
      setTour(tourData);
      console.log("Fetched tour details:", tourData);
    } catch (err) {
      console.error("Failed to load tour", err);
    }
  };

  fetchTour();
}, [id]);

  if (!tour) return <p>Loading tour details...</p>;

  return (
    <div className="tour-details">
      <h2>{tour.destination}</h2>
      <img src={tour.image || "/default-tour.jpg"} alt={tour.destination} />
      <p><strong>Price:</strong> ₹{tour.price}</p>
      <p><strong>Duration:</strong> {tour.duration} days</p>
      <p><strong>Description:</strong></p>
      <p>{tour.description}</p>

      <button
        onClick={() => alert("✅ Package booked successfully")}
        className="book-button"
      >
        Book Package
      </button>
    </div>
  );
}

export default TourDetails;