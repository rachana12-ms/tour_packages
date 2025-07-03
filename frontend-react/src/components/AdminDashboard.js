// File: src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import '../App.css';
import api from '../api'; // adjust path if needed
import PackageModal from './PackageModal'; // ✅ Imported the modal component
import VoiceChatbox from './VoiceChatbox';


const SLIDES = [
  'https://wallpaperaccess.com/full/1318411.png',
  'https://brabbu.com/blog/wp-content/uploads/2015/10/10-best-inspirational-travel-quotes1.jpg',
  'https://wallpaperaccess.com/full/650107.jpg',
  'https://tse4.mm.bing.net/th/id/OIP.hIjFqj1YlTBLkxeve0cfqQHaFj?rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3',
  'https://wallpaperaccess.com/full/1318336.jpg',
  'https://wallpaperaccess.com/full/650127.jpg',
  'https://wallpaperaccess.com/full/1318364.jpg',
  'https://wallpapercave.com/wp/wp7050287.jpg'
];

export default function AdminDashboard() {
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [modalPkg, setModalPkg] = useState(null);
  const [view, setView] = useState('view');
  const [form, setForm] = useState({
    id: '', name: '', destination: '', duration: '', price: '', description: '', itinerary: '', imageUrls: ['']
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filter, setFilter] = useState({ destination: '', minPrice: '', maxPrice: '', minDays: '', maxDays: '' });
  const [searchResults, setSearchResults] = useState([]);
  const [filterResults, setFilterResults] = useState([]);
  const [slideIdx, setSlideIdx] = useState(0);
  const [slideIndices, setSlideIndices] = useState({});
  const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);  // 🌟 Add this line

  useEffect(() => {
    if (view === 'view') fetchPackages();
    const timer = setInterval(() => setSlideIdx(i => (i + 1) % SLIDES.length), 3500);
    return () => clearInterval(timer);
  }, [view]);

  const fetchPackages = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.get(`/tour-packages`);
      setPackages(res.data);
      localStorage.setItem("packages", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError("Failed to load tour packages. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


const fetchBookings = async () => {
  try {
    setLoading(true);
    const res = await api.get(`/bookings`);
    setBookings(res.data);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    alert("❌ Failed to fetch bookings. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const addPackage = async (e) => {
  e.preventDefault();
  try {
    await api.post(`/tour-packages`, form);
    alert("✅ Package added successfully.");
    setForm({ name: '', destination: '', duration: '', price: '', description: '', itinerary: '', imageUrls: [''] });
    fetchPackages();
    setView('view');
  } catch (err) {
    console.error("Error adding package:", err);
    alert("❌ Failed to add package. Please check your input and try again.");
  }
};

const updatePackage = async (e) => {
  e.preventDefault();
  try {
    await api.put(`/tour-packages/${form.id}`, form);
    alert("✅ Package updated successfully.");
    setForm({ id: '', name: '', destination: '', duration: '', price: '', description: '', itinerary: '', imageUrls: [''] });
    fetchPackages();
    setView('view');
  } catch (err) {
    console.error("Error updating package:", err);
    alert("❌ Failed to update package. Make sure the ID is correct.");
  }
};

const deletePackage = async (e) => {
  e.preventDefault();
  try {
    await api.delete(`/tour-packages/${form.id}`);
    alert("✅ Package deleted successfully.");
    setForm({ id: '' });
    fetchPackages();
    setView('view');
  } catch (err) {
    console.error("Error deleting package:", err);
    alert("❌ Failed to delete package. Please ensure the ID is correct.");
  }
};


  const deleteBooking = async (id) => {
    try {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");

      await api.put(`/bookings/cancel/${id}`, null, {
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      });

      alert(`Booking #${id} has been cancelled.`);
      fetchBookings(); // Refresh the list after cancel
    } catch (err) {
      console.error("Cancel booking failed", err);
      alert("Failed to cancel booking.");
    }
  };

 const searchPackages = async () => {
    try {
      setError(null);
      const res = await api.get(`/tour-packages/search/keyword?keyword=${searchKeyword}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please check your internet connection or try again.");
    }
  };


  const filterPackages = async () => {
    try {
      setError(null);
      const params = new URLSearchParams(filter).toString();
      const res = await api.get(`/tour-packages/filter?${params}`);
      setFilterResults(res.data);
    } catch (error) {
      console.error("Filter API failed:", error);
      setError("Filtering failed. Please revise your filter options.");
    }
  };

  const handleImageChange = (i, val) => {
    const urls = [...form.imageUrls];
    urls[i] = val;
    setForm({ ...form, imageUrls: urls });
  };

  const addImageField = () => {
    setForm({ ...form, imageUrls: [...form.imageUrls, ''] });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextSlide = (pkgId, images) => {
    setSlideIndices(idx => ({
      ...idx,
      [pkgId]: typeof idx[pkgId] === 'number' ? (idx[pkgId] + 1) % images.length : 1 % images.length
    }));
  };

  const prevSlide = (pkgId, images) => {
    setSlideIndices(idx => ({
      ...idx,
      [pkgId]: typeof idx[pkgId] === 'number' ? (idx[pkgId] - 1 + images.length) % images.length : images.length - 1
    }));
  };

  const handleEdit = (pkg) => {
    setForm(pkg);
    setView('update');
  };

  const handleDelete = async (id) => {
    await api.delete(`/tour-packages/${id}`);
    fetchPackages();
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <button onClick={() => setView('view')}>View</button>
        <button onClick={() => setView('add')}>Add</button>
        <button onClick={() => setView('update')}>Update</button>
        <button onClick={() => setView('delete')}>Delete</button>
        <button onClick={() => setView('search')}>Search</button>
        <button onClick={() => setView('filter')}>Filter</button>
        <button onClick={() => { setView('bookings'); fetchBookings(); }}>Bookings</button>
        <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
          Logout
        </button>
      </nav>

      <div
  id="welcomeMsg"
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.2rem',
    background: 'linear-gradient(90deg, #fff8e1 60%, #e0c3fc 100%)',
    borderRadius: '22px',
    boxShadow: '0 6px 32px #bfa14a30',
    padding: '1.5rem 2.5rem',
    margin: '2.5rem auto 2rem auto',
    maxWidth: '650px',
    fontSize: '2.1rem',
    fontWeight: 'bold',
    color: '#7c2a2a',
    letterSpacing: '1.5px',
    border: '2.5px solid #bfa14a',
    position: 'relative',
    overflow: 'hidden'
  }}
>
  <span style={{ fontSize: '2.7rem', filter: 'drop-shadow(0 2px 6px #bfa14a80)' }}>🛡️</span>
  <span>
    Welcome to{' '}
    <span style={{ color: '#bfa14a', position: 'relative' }}>
      Admin Portal
      <span className="shine"></span>
    </span>
    <br />
    <span style={{ fontSize: '1.3rem', color: '#7c2a2a', fontWeight: 400 }}>
      Manage all your tours with ease!
    </span>
  </span>
</div>


      <div className="services-slideshow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div className="slideshow-images">
        {SLIDES.map((src, i) => (
          <img
            key={src}
            src={src}
            className={`slide${i === slideIdx ? ' active' : ''}`}
            alt=""
            style={{ opacity: i === slideIdx ? 1 : 0, transition: 'opacity 1s' }}
          />
        ))}
      </div>
      <div className="services-info">
        <h3>Our Services</h3>
        <ul>
          <li>Luxury Heritage Tours</li>
          <li>Hill Station Retreats</li>
          <li>Adventure & Wildlife Packages</li>
          <li>Custom Group & Family Tours</li>
          <li>24/7 Travel Assistance</li>
        </ul>
        <p style={{ marginTop: 10, fontWeight: 600, color: '#2c3e50' }}>
          📞 Call now to confirm your bookings: <span style={{ color: '#d63031' }}>+91-98765-43210</span>
        </p>
        {/* ✅ Correct placement of VoiceChatbox */}
        <div style={{ marginTop: '1.2rem' }}>
        <VoiceChatbox />
        </div>
      </div>
    </div>

    
     {error && (
      <div style={{
        backgroundColor: "#fdecea",
        color: "#b00020",
        padding: "10px 16px",
        borderRadius: "6px",
        border: "1px solid #f5c2c7",
        margin: "12px auto",
        width: "90%",
        textAlign: "center"
      }}>
        ⚠️ {error}
      </div>
    )}

      {view === 'view' && (
  <section>
    <h2 style={{ color: '#7c2a2a', marginBottom: '1.5rem' }}>Tour Packages Dashboard</h2>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className="package-list">
        {packages.map(pkg => (
          <div
            className="package-card"
            key={pkg.id}
            style={{
              border: '1.5px solid #bfa14a',
              borderRadius: '12px',
              padding: '1.2rem',
              margin: '1.5rem 0',
              backgroundColor: '#fffbe6',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          >
            <h3 style={{ color: '#7c2a2a', fontSize: '1.6rem', marginBottom: '1rem' }}>{pkg.name}</h3>

            {pkg.imageUrls?.length > 0 && (
              <div className="slideshow-container" style={{ position: 'relative', marginBottom: '1rem' }}>
                <img
                  src={pkg.imageUrls[slideIndices[pkg.id] || 0]}
                  alt="Package"
                  className="slide-image"
                  style={{ width: '100%', borderRadius: '10px', objectFit: 'cover', height: '250px' }}
                />
                {pkg.imageUrls.length > 1 && (
                  <>
                    <button
                      className="prev"
                      onClick={() => prevSlide(pkg.id, pkg.imageUrls)}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '10px',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '2rem',
                        color: '#bfa14a',
                        cursor: 'pointer'
                      }}
                    >
                      &#x276E;
                    </button>
                    <button
                      className="next"
                      onClick={() => nextSlide(pkg.id, pkg.imageUrls)}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '2rem',
                        color: '#bfa14a',
                        cursor: 'pointer'
                      }}
                    >
                      &#x276F;
                    </button>
                  </>
                )}
              </div>
            )}

            <p><strong>Destination:</strong> {pkg.destination}</p>
            <p><strong>Duration:</strong> {pkg.duration} days</p>
            <p><strong>Price:</strong> ₹{pkg.price}</p>
            <p><strong>Description:</strong> {pkg.description}</p>
            {pkg.itinerary && (
              <p><strong>Itinerary:</strong> <em>{pkg.itinerary}</em></p>
            )}

            {/* ✅ Three stacked buttons: View, Edit, Delete */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1.2rem' }}>
              <button
                onClick={() => setModalPkg(pkg)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#bfa14a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                View Details
              </button>

              <button
                onClick={() => handleEdit(pkg)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#bfa14a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Edit Package
              </button>

              <button
                onClick={() => handleDelete(pkg.id)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#bfa14a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Delete Package
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
)}


      {view === 'bookings' && (
        <section>
          <h2>All Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            bookings
            .filter(b => b.status !== "Cancelled" && b.status !== "Canceled")
            .map((b, idx) => (
              <div key={idx} style={{ borderBottom: "1px solid #ccc", marginBottom: 10 }}>
                <strong>Booking #{idx + 1}</strong><br />
                Name: {b.name}<br />
                Email: {b.email}<br />
                Phone: {b.phoneNumber}<br />
                Travelers: {b.travelers}<br />
                Date: {b.bookingDate}<br />
                Package: {b.selectedPackage}<br />
                <button onClick={() => deleteBooking(b.id)} style={{ marginTop: "0.5rem" }}>Cancel Booking</button>
              </div>
            ))
          )}
        </section>
      )}

      {(view === 'add' || view === 'update') && (
        <form onSubmit={view === 'add' ? addPackage : updatePackage}>
          {view === 'update' && <input name="id" placeholder="ID" value={form.id} onChange={handleChange} required />}
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} required />
          <input name="duration" type="number" placeholder="Duration" value={form.duration} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input name="itinerary" placeholder="Itinerary" value={form.itinerary} onChange={handleChange} />
          {form.imageUrls.map((url, i) => (
            <input key={i} value={url} onChange={(e) => handleImageChange(i, e.target.value)} placeholder="Image URL" />
          ))}
          <button type="button" onClick={addImageField}>+ Add Image</button>
          <button type="submit">{view === 'add' ? 'Add' : 'Update'}</button>
        </form>
      )}

      {view === 'delete' && (
        <form onSubmit={deletePackage}>
          <input name="id" placeholder="ID to Delete" value={form.id} onChange={handleChange} required />
          <button type="submit">Delete</button>
        </form>
      )}

      {view === 'search' && (
      <section>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search keyword..."
          />
          <button onClick={searchPackages}>Search</button>
          <button
            onClick={() => {
              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.lang = 'en-IN';
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.onresult = (event) => {
                  const transcript = event.results[0][0].transcript;
                  setSearchKeyword(transcript);
                  searchPackages(); // auto-search
                };
                recognition.start();
              } else {
                alert("Speech recognition not supported in this browser.");
              }
            }}
          >🎤</button>
        </div>
      {searchResults.map((p, i) => (
      <div key={p.id || i} className="package-card">
        {p.imageUrls?.length > 0 && (
          <div className="slideshow-container" style={{ position: "relative" }}>
            <img
              src={p.imageUrls[0]} // Optionally replace with: p.imageUrls[slideIndices[p.id] || 0]
              alt="Package"
              className="slide-image"
            />
            {/* Uncomment below if you want arrows */}
            {/* {p.imageUrls.length > 1 && (
              <>
                <button className="prev" onClick={() => prevSlide(p.id, p.imageUrls)}>&#10094;</button>
                <button className="next" onClick={() => nextSlide(p.id, p.imageUrls)}>&#10095;</button>
              </>
            )} */}
          </div>
        )}
        <h3>{p.name}</h3>
        <p><strong>Destination:</strong> {p.destination}</p>
        <p><strong>Duration:</strong> {p.duration} days</p>
        <p><strong>Price:</strong> ₹{p.price}</p>
        <p>{p.description}</p>
        <p><em>{p.itinerary}</em></p>
        <button onClick={() => window.location.href = `/booking?id=${p.id}`}>Book Now</button>
      </div>
    ))}
    
      </section>
    )}


{view === 'filter' && (
  <section>
    <input placeholder="Destination" value={filter.destination} onChange={(e) => setFilter({ ...filter, destination: e.target.value })} />
    <input placeholder="Min Price" type="number" value={filter.minPrice} onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })} />
    <input placeholder="Max Price" type="number" value={filter.maxPrice} onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })} />
    <input placeholder="Min Days" type="number" value={filter.minDays} onChange={(e) => setFilter({ ...filter, minDays: e.target.value })} />
    <input placeholder="Max Days" type="number" value={filter.maxDays} onChange={(e) => setFilter({ ...filter, maxDays: e.target.value })} />
    <button onClick={filterPackages}>Filter</button>

    {filterResults.map((p, i) => (
      <div className="package-card" key={p.id}>
        {p.imageUrls?.length > 0 && (
          <div className="slideshow-container" style={{ position: "relative" }}>
            <img src={p.imageUrls[0]} alt="Package" className="slide-image" />
          </div>
        )}
        <h3>{p.name}</h3>
        <p><strong>Destination:</strong> {p.destination}</p>
        <p><strong>Duration:</strong> {p.duration} days</p>
        <p><strong>Price:</strong> ₹{p.price}</p>
        <p>{p.description}</p>
        <p><em>{p.itinerary}</em></p>
        <button onClick={() => window.location.href = `/booking?id=${p.id}`}>Book Now</button>
      </div>
    ))}
  </section>
)}
      


      {/* ✅ Package Modal */}
      {modalPkg && <PackageModal pkg={modalPkg} onClose={() => setModalPkg(null)} />}
      <footer className="dashboard-footer" style={{ marginTop: '3rem', background: '#fff8e1', padding: '2rem', borderTop: '2px solid #bfa14a', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', color: '#7c2a2a' }}>
      <div className="about-footer" style={{ flex: '1', padding: '1rem' }}>
        <h3>About Royal Tours</h3>
        <p>
          Royal Tours is a passionate team of travel experts dedicated to bringing you the best experiences across India. Our packages are handpicked for comfort, adventure, and cultural richness. We believe in creating journeys that become cherished memories.
        </p>
      </div>
      <div className="contact-footer" style={{ flex: '1', padding: '1rem' }}>
        <h3>Contact Us</h3>
        <p>
          Email: <a href="mailto:info@royaltours.com">info@royaltours.com</a><br />
          Phone: +91-9876543210<br />
          Address: 123, Palace Road, Bengaluru, India
        </p>
      </div>
    </footer>
    
    </div>
  );
}
