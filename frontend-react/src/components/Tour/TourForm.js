import React, { useEffect, useState } from "react";
import api from "../../api";

function TourForm({ tour, onSubmit }) {
  const [form, setForm] = useState({
    destination: "",
    price: "",
    duration: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (tour) {
      setForm({
        destination: tour.destination || "",
        price: tour.price || "",
        duration: tour.duration || "",
        description: tour.description || "",
        image: tour.image || "",
      });
    } else {
      setForm({
        destination: "",
        price: "",
        duration: "",
        description: "",
        image: "",
      });
    }
  }, [tour]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (tour && tour.id) {
      console.log("Updating tour with id:", tour.id, "Data:", form);
      await api.put(`/tour-packages/${tour.id}`, { ...form, id: tour.id });
      alert("✅ Package updated successfully");
    } else {
      await api.post("/tour-packages", form);
      alert("✅ Package added successfully");
    }
    setForm({
      destination: "",
      price: "",
      duration: "",
      description: "",
      image: "",
    });
    onSubmit && onSubmit();
  } catch (err) {
    alert("❌ Failed to submit: " + (err.response?.data?.message || err.message));
    console.error(err);
  }
};

  return (
    <form className="tour-form" onSubmit={handleSubmit}>
      <h3>{tour ? "Edit Package" : "Create New Package"}</h3>

      <input
        name="destination"
        value={form.destination}
        onChange={handleChange}
        placeholder="Destination"
        required
      />
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <input
        name="duration"
        type="number"
        value={form.duration}
        onChange={handleChange}
        placeholder="Duration (in days)"
        required
      />
      <input
        name="image"
        value={form.image}
        onChange={handleChange}
        placeholder="Image URL (optional)"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Tour description & itinerary"
        rows="3"
        required
      />
      <button type="submit">{tour ? "Update" : "Create"}</button>
    </form>
  );
}

export default TourForm;