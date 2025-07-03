import React, { useEffect, useState } from 'react';
import '../App.css';
import api from '../api';
import PackageModal from './PackageModal';
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

export default function CustomerDashboard() {
  const [packages, setPackages] = useState([]);
  const [modalPkg, setModalPkg] = useState(null);
  const [view, setView] = useState('view');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filter, setFilter] = useState({ destination: '', minPrice: '', maxPrice: '', minDays: '', maxDays: '' });
  const [searchResults, setSearchResults] = useState([]);
  const [filterResults, setFilterResults] = useState([]);
  const [bookings, setBookings] = useState([]);
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
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const user = JSON.parse(localStorage.getItem("user")); // ✅ now actually use it

    if (!username || !password || !user?.email) {
      setError("User not logged in. Please log in to view your bookings.");
      return;
    }

    const res = await api.get(`/bookings`, {
      headers: {
        Authorization: "Basic " + btoa(`${username}:${password}`)
      }
    });

    // ✅ Use logged-in user's email to filter
    const myBookings = res.data.filter(b => b.email === user.email);
    setBookings(myBookings);
  } catch (err) {
    console.error("Error fetching bookings", err);
    setError("Failed to load your bookings. Please try again later.");
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

  return (
    <div className="dashboard">
      <nav className="navbar">
        <button onClick={() => setView('view')}>View</button>
        <button onClick={() => setView('search')}>Search</button>
        <button onClick={() => setView('filter')}>Filter</button>
        <button onClick={() => { setView('bookings'); fetchBookings(); }}>Booking History</button>
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
        <span style={{ fontSize: '2.7rem', filter: 'drop-shadow(0 2px 6px #bfa14a80)' }}>🛷</span>
        <span>
          Welcome to{' '}
          <span style={{ color: '#bfa14a', position: 'relative' }}>
            Royal Tours
            <span className="shine"></span>
          </span>
          <br />
          <span style={{ fontSize: '1.3rem', color: '#7c2a2a', fontWeight: 400 }}>
            Your journey begins here!
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
          <h3>Explore Your Next Adventure</h3>
          <ul style={{ marginBottom: '1rem' }}>
            <li>Luxury Tours</li>
            <li>Wildlife Escapes</li>
            <li>Honeymoon Specials</li>
            <li>Group Packages</li>
            <li>24/7 Travel Support</li>
          </ul>
           {/* Wrap VoiceChatbox in a container with margin */}
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
        <h2>Tour Packages Dashboard</h2>
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

                    {/* Golden arrows */}
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

                <div style={{ marginTop: '1.2rem', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setModalPkg(pkg)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#bfa14a',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => window.location.href = `/booking?id=${pkg.id}`}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#7c2a2a',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Book Now
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
        <h2>My Booking History</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((b, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: "1px solid #ccc",
                marginBottom: 10,
                backgroundColor: (b.status === "Cancelled" || b.status === "Canceled") ? "#f8d7da" : "transparent",
                color: (b.status === "Cancelled" || b.status === "Canceled") ? "#721c24" : "inherit",
                padding: "10px",
                borderRadius: "6px"
              }}
            >
              <strong>Booking #{idx + 1}</strong><br />
              Name: {b.name}<br />
              Email: {b.email}<br />
              Phone: {b.phoneNumber}<br />
              Travelers: {b.travelers}<br />
              Date: {b.bookingDate}<br />
              Package: {b.selectedPackage}<br />
              {(b.status === "Cancelled" || b.status === "Canceled") ? (
      <>
        Status: <strong style={{ color: "#721c24" }}>{b.status}</strong><br />
        <div style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "5px 10px",
          borderRadius: "5px",
          marginTop: "5px"
        }}>
          ⚠️ Your booking has been canceled by the admin.
        </div>
      </>
    ) : (
      <>
        Status: <strong>{b.status || "Active"}</strong>
      </>
    )}

            </div>
          ))
        )}
      </section>
    )}


      {view === 'search' && (
      <section>
        {/* Search bar + mic */}
        <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '1rem',
    height: '48px' // ensures uniform height
  }}
>
  <input
    value={searchKeyword}
    onChange={(e) => setSearchKeyword(e.target.value)}
    placeholder="Search keyword..."
    style={{
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1.5px solid #ccc',
      flex: 1,
      fontSize: '1rem',
      height: '100%' // make it match container height
    }}
  />
  <button
    onClick={searchPackages}
    style={{
      height: '100%',
      padding: '0 16px',
      backgroundColor: '#bfa14a',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }}
  >
    Search
  </button>
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
          searchPackages();
        };
        recognition.start();
      } else {
        alert("Speech recognition not supported in this browser.");
      }
    }}
    style={{
      height: '100%',
      padding: '0 12px',
      backgroundColor: '#e0c3fc',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1.3rem'
    }}
  >
    🎤
  </button>
</div>


        {/* Error display */}
        {error && (
          <div style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "6px",
            margin: "10px 0",
            border: "1px solid #f5c6cb"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* No results */}
        {searchResults.length === 0 && !error && (
          <p style={{ color: '#bfa14a', marginTop: '2rem' }}>
            Package not found. Try another keyword.
          </p>
        )}

        {/* Display results */}
        {searchResults.map((p, i) => (
          <div key={p.id || i} className="package-card">
            {p.imageUrls?.[0] && (
              <img
                src={p.imageUrls[0]}
                alt="Package"
                className="slide-image"
                style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}
              />
            )}
            <h3>{p.name || "Unnamed Package"}</h3>
            <p><strong>Destination:</strong> {p.destination || "N/A"}</p>
            <p><strong>Duration:</strong> {p.duration || "N/A"} days</p>
            <p><strong>Price:</strong> ₹{p.price || "N/A"}</p>
            <p>{p.description || "No description available."}</p>
            <p><em>{p.itinerary || "No itinerary available."}</em></p>
            <button onClick={() => window.location.href = `/booking?id=${p.id}`}>
              Book Now
            </button>
          </div>
        ))}
      </section>
    )}


      {view === 'filter' && (
      <section>
        <input
          placeholder="Destination"
          value={filter.destination}
          onChange={(e) => setFilter({ ...filter, destination: e.target.value })}
        />
        <input
          placeholder="Min Price"
          type="number"
          value={filter.minPrice}
          onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
        />
        <input
          placeholder="Max Price"
          type="number"
          value={filter.maxPrice}
          onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
        />
        <input
          placeholder="Min Days"
          type="number"
          value={filter.minDays}
          onChange={(e) => setFilter({ ...filter, minDays: e.target.value })}
        />
        <input
          placeholder="Max Days"
          type="number"
          value={filter.maxDays}
          onChange={(e) => setFilter({ ...filter, maxDays: e.target.value })}
        />
        <button onClick={filterPackages}>Filter</button>

        {/* Error Message */}
        {error && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            ⚠️ {error}
          </p>
        )}

        {/* No Results Message */}
        {filterResults.length === 0 && !error && (
          <p style={{ color: '#bfa14a', marginTop: '10px' }}>
            Package not found. Try other filter values.
          </p>
        )}

        {filterResults.map((p, i) => (
          <div className="package-card" key={p.id}>
            <img src={p.imageUrls?.[0]} alt="Package" className="slide-image" />
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