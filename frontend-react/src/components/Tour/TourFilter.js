import React, { useState } from "react";

function TourFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    destination: "",
    keyword: "",
    minPrice: "",
    maxPrice: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form className="filter-form" onSubmit={handleFilter}>
      <h3>🔍 Filter Packages</h3>

      <input
        name="destination"
        placeholder="Destination"
        value={filters.destination}
        onChange={handleChange}
      />

      <input
        name="keyword"
        placeholder="Keyword (beach, adventure...)"
        value={filters.keyword}
        onChange={handleChange}
      />

      <input
        name="minPrice"
        type="number"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={handleChange}
      />

      <input
        name="maxPrice"
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={handleChange}
      />

      <input
        name="duration"
        type="number"
        placeholder="Duration (days)"
        value={filters.duration}
        onChange={handleChange}
      />

      <button type="submit">Apply Filters</button>
    </form>
  );
}

export default TourFilter;
