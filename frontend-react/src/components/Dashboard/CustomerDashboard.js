import React, { useEffect, useState } from "react";
import TourCard from "../Tour/TourCard";
import TourFilter from "../Tour/TourFilter";
import api from "../../api";

function CustomerDashboard() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchTours();
    // eslint-disable-next-line
  }, []);

  const fetchTours = async () => {
    try {
      const res = await api.get("/tour-packages"); // Correct endpoint for Spring Boot
      setTours(res.data);
      setFilteredTours(res.data);
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    }
  };

  const handleFilter = (filters) => {
    let result = tours.filter((tour) => {
      return (
        (!filters.destination || tour.destination.toLowerCase().includes(filters.destination.toLowerCase())) &&
        (!filters.keyword || tour.description.toLowerCase().includes(filters.keyword.toLowerCase())) &&
        (!filters.minPrice || tour.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || tour.price <= parseFloat(filters.maxPrice)) &&
        (!filters.duration || tour.duration === parseInt(filters.duration))
      );
    });

    setFilteredTours(result);
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {username}!</h2>
      <TourFilter onFilter={handleFilter} />

      <div className="tour-list">
        {filteredTours.length > 0 ? (
          filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} showBookButton={true} />
          ))
        ) : (
          <p>⚠️ No results found</p>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;