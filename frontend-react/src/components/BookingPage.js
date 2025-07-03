import React, { useEffect, useState, useRef } from "react";


function BookingPage() {
  const [pkg, setPkg] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    travelers: 1,
    phoneNumber: "",
    bookingDate: "",
    selectedPackage: ""
  });
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      setMessage("Invalid package ID.");
      return;
    }

    const packages = JSON.parse(localStorage.getItem("packages")) || [];
    const found = packages.find(p => String(p.id) === String(id));
    if (found) {
      setPkg(found);
      setForm(f => ({ ...f, selectedPackage: found.name }));
    } else {
      setMessage("Package not found.");
    }
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("lastBookingEmail");
    if (!email) return;

    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (!username || !password) return;

    fetch("http://localhost:8087/api/bookings", {
      headers: {
        Authorization: "Basic " + btoa(`${username}:${password}`)
      }
    })
      .then(res => res.ok ? res.json() : [])
      .then(bookings => {
        const stillExists = bookings.some(b => b.email === email);
        if (!stillExists) {
          setMessage("⚠️ Your booking has been canceled by the admin.");
          localStorage.removeItem("lastBookingEmail");
        }
      })
      .catch(err => console.error("Booking check failed", err));
  }, []);

  useEffect(() => {
    const handleKey = e => {
      if (e.key === "ArrowRight") setCurrentImg(i => (i + 1) % (pkg?.imageUrls?.length || 1));
      if (e.key === "ArrowLeft") setCurrentImg(i => (i - 1 + (pkg?.imageUrls?.length || 1)) % (pkg?.imageUrls?.length || 1));
    };
    const node = containerRef.current;
    if (node) node.addEventListener("keydown", handleKey);
    return () => node && node.removeEventListener("keydown", handleKey);
  }, [pkg]);

  const handleArrow = dir => {
    if (!pkg?.imageUrls?.length) return;
    setCurrentImg(i => (i + dir + pkg.imageUrls.length) % pkg.imageUrls.length);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.travelers || !form.selectedPackage) {
      setMessage("Please fill all the required fields.");
      return;
    }

    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (!username || !password) {
      setMessage("You must be logged in to make a booking.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const bookingData = {
      packageId: id,
      ...form
    };

    try {
      const res = await fetch("http://localhost:8087/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${username}:${password}`)
        },
        body: JSON.stringify(bookingData)
      });

      if (!res.ok) throw new Error("Booking failed");

      localStorage.setItem("lastBookingEmail", form.email);
      setMessage(`Booking successful!\nName: ${form.name}\nEmail: ${form.email}\nPreferred Date: ${form.bookingDate}\nPhone: ${form.phoneNumber}\nTravelers: ${form.travelers}\nSelected Package: ${form.selectedPackage}`);

      setForm({
        name: "",
        email: "",
        travelers: 1,
        phoneNumber: "",
        bookingDate: "",
        selectedPackage: pkg?.name || ""
      });
    } catch (err) {
      console.error("Error:", err);
      setMessage("Booking failed. Please try again later.");
    }
  };

  if (message && message.startsWith("Invalid")) {
    return <div style={{ color: "#7c2a2a", fontWeight: 700, marginTop: "3rem", textAlign: "center" }}>{message}</div>;
  }

  return (
    <div
      className="fixed-container"
      tabIndex={0}
      aria-label="Package Booking Container"
      ref={containerRef}
      style={{ margin: "2rem auto", maxWidth: 900 }}
    >
      <h2 style={{
        marginTop: "2.5rem",
        marginBottom: "1rem",
        color: "#7c2a2a",
        letterSpacing: "1px",
        textShadow: "0 2px 8px #bfa14a30",
        fontSize: "2rem"
      }}>Book Your Royal Experience</h2>
      
      <h1 id="pkgName">{pkg ? pkg.name : "Loading package details..."}</h1>
      <div className="package-details" aria-live="polite" aria-atomic="true">
        <p><strong>Destination:</strong> <span id="pkgDestination">{pkg?.destination}</span></p>
        <p><strong>Duration:</strong> <span id="pkgDuration">{pkg?.duration}</span> days</p>
        <p><strong>Price:</strong> ₹<span id="pkgPrice">{pkg?.price}</span></p>
        <p className="package-description" id="pkgDescription">{pkg?.description}</p>
        <p className="package-description" id="pkgItinerary">{pkg?.itinerary}</p>
      </div>

      

      {/* Image Slider */}
      <div className="slider" aria-label="Package Image Slider" style={{ marginBottom: 20, position: "relative", height: 300 }}>
        {(pkg?.imageUrls?.length ? pkg.imageUrls : []).map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`Slide ${idx + 1}`}
            className={currentImg === idx ? "active" : ""}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
              opacity: currentImg === idx ? 1 : 0,
              zIndex: currentImg === idx ? 1 : 0,
              transition: "opacity 0.6s ease-in-out",
              position: "absolute",
              top: 0,
              left: 0
            }}
          />
        ))}
        <div className="arrow left" onClick={() => handleArrow(-1)} style={{
          position: "absolute", top: "50%", left: "10px", fontSize: "2rem", cursor: "pointer", color: "#fff", zIndex: 2
        }}>&#8592;</div>
        <div className="arrow right" onClick={() => handleArrow(1)} style={{
          position: "absolute", top: "50%", right: "10px", fontSize: "2rem", cursor: "pointer", color: "#fff", zIndex: 2
        }}>&#8594;</div>
      </div>

      <button
        onClick={() => (window.location.href = "/")}
        style={{
          marginBottom: "1.5rem",
          padding: "10px 16px",
          fontSize: "1rem",
          background: "linear-gradient(90deg, #7c2a2a, #bfa14a)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 600,
          boxShadow: "0 2px 6px #bfa14a80",
          transition: "background 0.3s ease"
        }}
      >
        ← Back to homepage
      </button>

      <form id="bookingForm" className="booking-form" aria-label="Booking form" onSubmit={handleSubmit}>
        <label htmlFor="userName">Name</label>
        <input id="userName" name="name" type="text" placeholder="Your full name" required autoComplete="name" value={form.name} onChange={handleChange} />

        <label htmlFor="userEmail">Email</label>
        <input id="userEmail" name="email" type="email" placeholder="example@email.com" required autoComplete="email" value={form.email} onChange={handleChange} />

        <label htmlFor="travelers">Number of Travelers</label>
        <input id="travelers" name="travelers" type="number" min="1" max="10" required value={form.travelers} onChange={handleChange} />

        <label htmlFor="phoneNumber">Phone Number</label>
        <input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+1 (555) 123-4567" required autoComplete="tel" pattern="[+0-9\s\-\(\)]{7,}" value={form.phoneNumber} onChange={handleChange} />

        <label htmlFor="bookingDate">Preferred Date</label>
        <input id="bookingDate" name="bookingDate" type="date" required value={form.bookingDate} onChange={handleChange} />

      
        <label htmlFor="package">Select Package</label>
        <select id="package" name="selectedPackage" required value={form.selectedPackage} onChange={handleChange}>
          <option value="" disabled>Select a package</option>
          <option value="royal-palace">Royal Palace Tour</option>
          <option value="heritage-walk">Heritage Walk</option>
          <option value="luxury-dinner">Luxury Dinner</option>
          <option value="honeymoon">Honeymoon Getaway</option>
          <option value="family-trip">Family Vacation</option>
          <option value="friends-tour">Friends' Adventure Tour</option>
          <option value="office-trip">Office Team Outing</option>
          <option value="romantic-escape">Romantic Escape</option>
          <option value="adventure-trip">Adventure Trip</option>
          <option value="wellness-retreat">Wellness Retreat</option>
          <option value="beach-party">Beach Party</option>
          <option value="cultural-tour">Cultural Tour</option>
        </select>  

        <button type="submit">Book a call Now</button>
      </form>

      {message && (
        <div style={{ color: "#7c2a2a", fontWeight: 700, marginTop: "1.5rem", whiteSpace: "pre-line" }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default BookingPage;
