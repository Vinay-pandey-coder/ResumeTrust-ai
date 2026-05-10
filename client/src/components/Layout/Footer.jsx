import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid-p footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            ResumeTrust <span>AI</span>
          </Link>
          <p className="footer-tagline">
            Building a transparent hiring future. Secure, AI-powered resume
            analysis built with ❤️ for the global developer community.
          </p>
          <p className="text-muted mt-4 text-xs font-bold uppercase tracking-widest opacity-60">
            Licensed under MIT • Privacy Focused
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

        <div className="footer-links">
          <h4 className="footer-title">Legal</h4>
          <ul>
            <li><Link to="/terms" target="_blank">Terms of Service</Link></li>
            <li><Link to="/privacy" target="_blank">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4 className="footer-title">Connect</h4>
          <ul>
            <li>
              <a href="https://github.com/Vinay-pandey-coder" target="_blank" rel="noopener noreferrer">
                <span>GitHub</span>
              </a>
            </li>
            <li>
              <a href="https://x.com/VinayPa53449427" target="_blank" rel="noopener noreferrer">
                <span>Twitter</span>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/vinay-pandey-915310338/" target="_blank" rel="noopener noreferrer">
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom container">
        <div className="footer-bottom-unified">
          <p>© 2026 ResumeTrust AI. Professional Grade Auditing.</p>
          <span className="footer-bottom-divider">•</span>
          <p className="text-xs">
            Built by <a href="https://github.com/Vinay-pandey-coder" target="_blank" className="font-bold text-accent">Vinay Pandey</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
