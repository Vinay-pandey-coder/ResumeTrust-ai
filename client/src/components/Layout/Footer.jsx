import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container grid-3 footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            ResumeTrust <span>AI</span>
          </Link>
          <p className="footer-tagline">
            Building a transparent hiring future. Secure, AI-powered resume
            analysis built with ❤️ for the developer community.
          </p>
          {/* Is h4 ko thoda chota ya low opacity de sakte ho taaki tagline zyada chamke */}
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: "bold",
              marginTop: "0.5rem",
              color: "var(--text-secondary)",
            }}
          >
            Licensed under MIT. Open Source & Privacy Focused.
          </p>
        </div>

        <div className="footer-links">
          <h4 className="footer-title">Platform</h4>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/pricing">Pricing</Link>
            </li>
            <li>
              <Link to="/analyze">Analyze Resume</Link>
            </li>
            <li>
              <Link to="/terms" target="_blank">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" target="_blank">
                Privacy Policy
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/Vinay-pandey-coder/ResumeTrust-ai/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
              >
                License
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-social">
          <h4 className="footer-title">Connect</h4>
          <ul>
            <li>
              <a
                href="https://github.com/Vinay-pandey-coder"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://x.com/VinayPa53449427"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/vinay-pandey-915310338/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>© 2026 ResumeTrust AI. Licensed under MIT.</p>
        <p>
          Built by{" "}
          <a
            href="https://github.com/Vinay-pandey-coder"
            target="_blank"
            className="hover-link"
          >
            Vinay Pandey
          </a>{" "}
          with ❤️ for the community.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
