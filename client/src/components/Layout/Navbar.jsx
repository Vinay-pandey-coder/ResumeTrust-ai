import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../UI/Button';

const Navbar = ({ isLoggedIn, user, onLogout, openLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    onLogout();
    closeMenu();
    navigate('/');
  };

  // [NEW]: Login/Register click handler logic
  const handleAuthClick = (isRegister = false) => {
    closeMenu();
    // Agar hum pehle se /login par hain, toh state update trigger karne ke liye
    // hum navigate('/') karke wapas navigate('/login') kar sakte hain ya
    // seedha openLogin helper call kar sakte hain jo humne Home mein pass kiya tha.
    if (openLogin) {
      openLogin(isRegister);
    }
    navigate('/login');
  };

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          ResumeTrust <span>AI</span>
        </Link>

        {/* Mobile Hamburger Icon */}
        <button
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="nav-links-center">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
            <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
            <Link to="/pricing" className="nav-link" onClick={closeMenu}>Pricing</Link>
          </div>

          <div className="nav-links-right">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                <Link to="/analyze" className="nav-link" onClick={closeMenu}>Analyze</Link>

                <div className="nav-user flex-center">
                  <span className="user-name">{user?.name?.split(' ')[0]}</span>
                  <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                {/* [UPDATED]: Link ki jagah button handler use kiya hai state sync ke liye */}
                <Button variant="outline" onClick={() => handleAuthClick(false)}>Login</Button>
                <Button variant="primary" onClick={() => handleAuthClick(true)}>Register</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;