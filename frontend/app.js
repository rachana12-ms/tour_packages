// ====== State ======
let loggedInUser = null;
let authHeader = "";

// ====== Section Elements ======
const landingSection = document.getElementById("landing-section");
const authSection = document.getElementById("auth-section");
const loginBox = document.getElementById("login-box");
const registerBox = document.getElementById("register-box");
const dashboardSection = document.getElementById("dashboard-section");
const aboutSection = document.getElementById("about-section");
const contactSection = document.getElementById("contact-section");
const logoutBtn = document.getElementById("logout-btn");

// ====== Dashboard Elements ======
const welcomeMsg = document.getElementById("welcome-msg");
const filterBar = document.getElementById("filter-bar");
const tourList = document.getElementById("tour-list");
const tourDetails = document.getElementById("tour-details");
const homeTitle = document.getElementById("home-title");
const adminActions = document.getElementById("admin-actions");
const createForm = document.getElementById("create-form");

// ====== Section Navigation ======
function hideAllSections() {
  landingSection.style.display = "none";
  authSection.style.display = "none";
  dashboardSection.style.display = "none";
  aboutSection.style.display = "none";
  contactSection.style.display = "none";
}

function showLanding() {
  hideAllSections();
  landingSection.style.display = "block";
  logoutBtn.style.display = "none";
  updateNavBar();
}

function showLogin() {
  hideAllSections();
  authSection.style.display = "block";
  loginBox.style.display = "block";
  registerBox.style.display = "none";
  logoutBtn.style.display = "none";
  updateNavBar();
}

function showRegister() {
  hideAllSections();
  authSection.style.display = "block";
  loginBox.style.display = "none";
  registerBox.style.display = "block";
  logoutBtn.style.display = "none";
  updateNavBar();
}

function showHome() {
  if (!loggedInUser) {
    showLogin();
    return;
  }
  hideAllSections();
  dashboardSection.style.display = "block";
  aboutSection.style.display = "none";
  contactSection.style.display = "none";
  renderDashboard();
  logoutBtn.style.display = "inline-block";
  updateNavBar();
}

function showAbout() {
  hideAllSections();
  aboutSection.style.display = "block";
  logoutBtn.style.display = loggedInUser ? "inline-block" : "none";
  updateNavBar();
}

function showContact() {
  hideAllSections();
  contactSection.style.display = "block";
  logoutBtn.style.display = loggedInUser ? "inline-block" : "none";
  updateNavBar();
}

function showFilter() {
  showHome();
  filterBar.style.display = "flex";
  homeTitle.innerText = "Filter/Search Tour Packages";
}

// ====== Navigation Bar Update ======
function updateNavBar() {
  const navLinks = document.getElementById("nav-links");
  if (loggedInUser) {
    navLinks.style.display = "flex";
    logoutBtn.style.display = "inline-block";
  } else {
    navLinks.style.display = "flex";
    logoutBtn.style.display = "none";
  }
}

// ====== Auth Logic ======
function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const error = document.getElementById("login-error");
  const auth = 'Basic ' + btoa(username + ':' + password);

  fetch(`http://localhost:8087/api/users/${username}`, {
    headers: { 'Authorization': auth }
  })
    .then(res => {
      if (res.ok) {
        authHeader = auth;
        return res.json();
      } else {
        throw new Error("Invalid credentials");
      }
    })
    .then(user => {
      loggedInUser = user;
      error.innerText = "";
      showHome();
    })
    .catch(() => {
      error.innerText = "❌ Invalid username or password.";
    });
}

function register() {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value;
  const fullname = document.getElementById("register-fullname").value.trim();
  const role = document.getElementById("register-role").value;
  const error = document.getElementById("register-error");

  fetch('http://localhost:8087/api/users/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, fullName: fullname, role })
  })
    .then(res => {
      if (res.ok) {
        error.innerText = "✅ Registration successful. Please login.";
        setTimeout(showLogin, 1200);
      } else {
        error.innerText = "❌ Registration failed. Try a different username.";
      }
    });
}

function logout() {
  loggedInUser = null;
  authHeader = "";
  showLanding();
}

// ====== Dashboard Rendering ======
function renderDashboard() {
  // Welcome message
  welcomeMsg.innerHTML = loggedInUser
    ? `Welcome, <b>${loggedInUser.fullName || loggedInUser.username}</b>!`
    : "";

  // Show/hide admin actions
  if (loggedInUser && loggedInUser.role === "admin") {
    adminActions.style.display = "block";
    createForm.style.display = "block";
  } else {
    adminActions.style.display = "none";
    createForm.style.display = "none";
  }

  // Hide filter bar by default
  filterBar.style.display = "none";
  homeTitle.innerText = "Recommended Tour Packages";
  tourDetails.style.display = "none";
  loadTours();
}

// ====== Tour Cards & Details ======
// Map destination names to image filenames
const destinationImages = {
  "Paris": "paris.jpg",
  "London": "london.jpg",
  "New York": "newyork.jpg",
  // Add more mappings as needed
};

function getImageForDestination(destination) {
  return destinationImages[destination] || "default.jpg";
}

// In renderTours:
function renderTours(packages) {
  tourList.innerHTML = "";
  if (!packages || packages.length === 0) {
    tourList.innerHTML = `<p>⚠️ No results found.</p>`;
    return;
  }
  packages.forEach(pkg => {
    const imgSrc = `images/${getImageForDestination(pkg.destination)}`;
    const card = document.createElement("div");
    card.className = "tour-card";
    card.innerHTML = `
      <img src="${imgSrc}" alt="${pkg.destination}">
      <b>${pkg.destination}</b>
      <div>₹${pkg.price} &bull; ${pkg.duration} days</div>
      <div>${pkg.description}</div>
    `;
    card.onclick = () => showDetails(pkg.id);
    tourList.appendChild(card);
  });
}

// In showDetails:
function showDetails(id) {
  fetch(`http://localhost:8087/api/tour-packages/${id}`, {
    headers: { 'Authorization': authHeader }
  })
    .then(res => res.json())
    .then(result => {
      // If backend returns a list, use the first item
      const pkg = Array.isArray(result) ? result[0] : result;
      if (!pkg || !pkg.destination) {
        tourDetails.innerHTML = "<p>⚠️ Package details not found.</p>";
        tourDetails.style.display = "block";
        return;
      }
      const imgSrc = `images/${getImageForDestination(pkg.destination)}`;
      tourDetails.style.display = "block";
      tourDetails.innerHTML = `
        <h3>${pkg.destination}</h3>
        <img src="${imgSrc}" alt="${pkg.destination}" style="width:220px;border-radius:8px;">
        <p><b>Duration:</b> ${pkg.duration} days</p>
        <p><b>Price:</b> ₹${pkg.price}</p>
        <p><b>Description:</b> ${pkg.description}</p>
        <p><b>Itinerary:</b> ${pkg.itinerary}</p>
        ${loggedInUser && loggedInUser.role === "customer"
          ? `<button onclick="bookNow()">Book Package</button>`
          : ""}
        ${loggedInUser && loggedInUser.role === "admin"
          ? `<button onclick="deletePackage(${pkg.id})" style="background:#e53935;">Delete</button>`
          : ""}
        <button onclick="tourDetails.style.display='none'">Close</button>
      `;
    })
    .catch(() => {
      tourDetails.innerHTML = "<p>⚠️ Failed to load package details.</p>";
      tourDetails.style.display = "block";
    });
}

function bookNow() {
  alert("✅ Package booked successfully!");
  tourDetails.style.display = "none";
}

function deletePackage(id) {
  if (!confirm("Are you sure you want to delete this package?")) return;
  fetch(`http://localhost:8087/api/tour-packages/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': authHeader }
  })
    .then(res => {
      if (res.ok) {
        alert("✅ Package deleted successfully.");
        tourDetails.style.display = "none";
        loadTours();
      } else {
        alert("❌ Failed to delete package.");
      }
    });
}

// ====== Admin: Create Package ======
if (createForm) {
  createForm.onsubmit = function (e) {
    e.preventDefault();
    const formData = new FormData(createForm);
     const newPackage = {
      destination: formData.get("destination"),
      duration: Number(formData.get("duration")),
      price: Number(formData.get("price")),
      description: formData.get("description"),
      itinerary: formData.get("itinerary"),
      image: formData.get("image") // <-- Use just the filename, e.g., "paris.jpg"
    };
    fetch('http://localhost:8087/api/tour-packages', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPackage)
    })
      .then(res => {
        if (res.ok) {
          alert("✅ Package added successfully.");
          createForm.reset();
          loadTours();
        } else {
          alert("❌ Failed to add package.");
        }
      });
  };
}

// ====== Filtering & Searching ======
function loadTours() {
  fetch('http://localhost:8087/api/tour-packages', {
    headers: { 'Authorization': authHeader }
  })
    .then(res => res.json())
    .then(data => {
      renderTours(data);
    });
}

function filterTours() {
  const dest = document.getElementById("filter-destination").value;
  const maxPrice = document.getElementById("filter-maxprice").value;
  const duration = document.getElementById("filter-duration").value;
  let params = [];
  if (dest) params.push(`destination=${encodeURIComponent(dest)}`);
  if (maxPrice) params.push(`maxPrice=${encodeURIComponent(maxPrice)}`);
  if (duration) params.push(`duration=${encodeURIComponent(duration)}`);
  let url = `http://localhost:8087/api/tour-packages/filter`;
  if (params.length > 0) url += `?${params.join("&")}`;
  fetch(url, { headers: { 'Authorization': authHeader } })
    .then(res => res.json())
    .then(data => renderTours(data));
}

function searchTours() {
  const keyword = document.getElementById("search-keyword").value;
  if (!keyword) return;
  fetch(`http://localhost:8087/api/tour-packages/search/keyword?keyword=${encodeURIComponent(keyword)}`, {
    headers: { 'Authorization': authHeader }
  })
    .then(res => res.json())
    .then(data => renderTours(data));
}

// ====== Initial UI State ======
showLanding();

// ====== Expose for HTML buttons ======
window.showHome = showHome;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showAbout = showAbout;
window.showContact = showContact;
window.filterTours = filterTours;
window.searchTours = searchTours;
window.logout = logout;
window.deletePackage = deletePackage;
window.bookNow = bookNow;