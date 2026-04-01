import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../UI/Button';

const Navbar = ({ isLoggedIn, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    onLogout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar fixed-top">
      <div className="container flex-between nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          ResumeTrust <span>AI</span>
        </Link>

        {/* Mobile View Toggle */}
        <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Desktop and Mobile Menu */}
        <div className={`nav-menu ${isOpen ? 'mobile-active' : ''}`}>
          <div className="nav-links">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
            <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
            <Link to="/pricing" className="nav-link" onClick={closeMenu}>Pricing</Link>
            
            {isLoggedIn && (
              <>
                <Link to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                <Link to="/analyze" className="nav-link" onClick={closeMenu}>Analyze</Link>
              </>
            )}
          </div>

          <div className="nav-actions">
            {isLoggedIn ? (
              <div className="user-profile flex-center">
                <span className="user-name">{user?.name}</span>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <div className="auth-buttons flex-center">
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/login" onClick={closeMenu} style={{ marginLeft: '10px' }}>
                  <Button variant="primary">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
