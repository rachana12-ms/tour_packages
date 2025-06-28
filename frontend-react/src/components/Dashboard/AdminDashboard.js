import React, { useEffect, useState } from "react";
import TourCard from "../Tour/TourCard";
import TourFilter from "../Tour/TourFilter";
import TourForm from "../Tour/TourForm";
import api from "../../api";

function AdminDashboard() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [editingTour, setEditingTour] = useState(null);

  const fetchTours = async () => {
    try {
      const res = await api.get("/tour-packages"); // Spring Boot endpoint
      setTours(res.data);
      setFilteredTours(res.data);
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tour-packages/${id}`);
      fetchTours();
      alert("❌ Package deleted");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (tour) => {
    console.log("Editing tour:", tour);
    setEditingTour(tour);
  };

  const handleFormSubmit = () => {
    fetchTours();
    setEditingTour(null);
  };

  return (
    <div className="admin-dashboard">
      <h2>Welcome, Admin!</h2>
      <TourForm tour={editingTour} onSubmit={handleFormSubmit} />
      <TourFilter onFilter={handleFilter} />

      <div className="tour-list">
        {filteredTours.length > 0 ? (
          filteredTours.map((tour) => (
            <TourCard
              key={tour.id} // Use 'id' for Spring Boot, not '_id'
              tour={tour}
              showEditDelete={true}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <p>⚠️ No results found</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;