import React from "react";

function PackageModal({ pkg, onClose }) {
  if (!pkg) return null;

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>×</span>
        <h2>{pkg.name}</h2>
        <div><strong>Destination:</strong> {pkg.destination}</div>
        <div><strong>Duration:</strong> {pkg.duration} days</div>
        <div><strong>Price:</strong> ₹{pkg.price}</div>
        <div>{pkg.description}</div>
        <div>{pkg.itinerary && <em>{pkg.itinerary}</em>}</div>
        <div className="images-section">
          <strong>Images:</strong>
          <div className="images-container">
            {pkg.imageUrls && pkg.imageUrls.length > 0
              ? pkg.imageUrls.map((url, i) => (
                  <img key={i} src={url} alt="Package" className="package-image" />
                ))
              : "No images"}
          </div>
        </div>
        <button
          className="book-now-btn"
          onClick={() => window.location.href = `/booking?id=${pkg.id}`}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default PackageModal;
