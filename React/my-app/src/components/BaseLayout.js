import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "leaflet/dist/leaflet.css";

// like base.html from django template, deals with nav bar and footer
const BaseLayout = ({ children, user, setUser }) => {
  
  const navigate = useNavigate();

  // for logging out in nav bar
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout/', {
        method: 'GET', 
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest', 
        },
        credentials: 'include', 
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json(); 
      if (data.success) {
        setUser({ isAuthenticated: false }); 
        navigate("/login"); 
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (err) {
      console.error("Logout request failed:", err);
    }
  };
  
  // html
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">MyApp</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {user?.isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link">Welcome, {user.username}</span>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="#" onClick={handleLogout}>Logout</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">Sign Up</Link>
                  </li>
                </>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/">Map</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container my-5">{children}</div>

      <footer className="bg-light text-center py-4">
        <div className="container">
          <p className="mb-0">© 2024 My Web App. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BaseLayout;
