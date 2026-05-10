import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../UI/Button';

const Navbar = ({ isLoggedIn, user, onLogout, openLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const handleAuthClick = (isRegister = false) => {
    closeMenu();
    navigate(isRegister ? '/register' : '/login');
  };

  // [NEW]: Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Simple active link check helper
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} ref={navRef}>
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
            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>Home</Link>
            <Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={closeMenu}>About</Link>
            <Link to="/pricing" className={`nav-link ${isActive('/pricing')}`} onClick={closeMenu}>Pricing</Link>
          </div>

          <div className="nav-links-right">
            {isLoggedIn ? (
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`} onClick={closeMenu}>Dashboard</Link>
                <Link to="/analyze" className={`nav-link ${isActive('/analyze')}`} onClick={closeMenu}>Analyze</Link>

                <div className="nav-user flex items-center">
                  <span className="user-name cursor-pointer" onClick={()=>{navigate('/profile')}}>{user?.name?.split(' ')[0]}</span>
                  <Button variant="outline" onClick={handleLogout} className="text-xs py-1.5 px-4">Logout</Button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Button variant="outline" onClick={() => handleAuthClick(false)} className="px-10">Login</Button>
                <Button variant="primary" onClick={() => handleAuthClick(true)} className="px-10 shadow-lg shadow-indigo-500/20">Register</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;