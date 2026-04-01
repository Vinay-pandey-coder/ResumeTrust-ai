import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container grid-3 footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            ResumeTrust <span>AI</span>
          </Link>
          <p className="footer-tagline">
            Building trust in tech hiring through AI-powered 
            resume verification and GitHub insights.
          </p>
        </div>

        <div className="footer-links">
          <h4 className="footer-title">Platform</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/analyze">Analyze Resume</Link></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4 className="footer-title">Connect</h4>
          <ul>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} ResumeTrust AI. All rights reserved.</p>
        <p>Made with &hearts; for the developer community.</p>
      </div>
    </footer>
  );
};

export default Footer;
