import React from "react";
import MetaData from "../components/SEO/MetaData";

const Terms = () => {
  return (
    <div className="page-container fade-in">
      <MetaData
        title="Terms of Service"
        description="ResumeTrust AI Terms of Service — Rules and guidelines for using our platform."
      />

      <div className="max-w-800 mx-auto py-10">
        <div className="text-center mb-10">
          <h1 className="hero-title">
            Terms of <span>Service</span>
          </h1>
          <p className="text-secondary">
            Last updated: April 7, 2026 · Effective immediately
          </p>
        </div>

        {/* Section 1 */}
        <div className="card mt-6">
          <h2
            className="section-title"
            style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}
          >
            📋 Acceptance of Terms
          </h2>
          <p className="text-secondary">
            By registering or using ResumeTrust AI, you agree to these terms. If
            you do not agree, please do not use the platform.
          </p>
        </div>

        {/* Section 2 */}
        <div className="card mt-6">
          <h2
            className="section-title"
            style={{ fontSize: "1.1rem", marginBottom: "1rem" }}
          >
            👤 User Roles & Responsibilities
          </h2>
          <div className="card mt-4" style={{ background: "var(--bg-hover)" }}>
            <h4
              style={{ color: "var(--text-primary)", marginBottom: "0.4rem" }}
            >
              Candidate Account
            </h4>
            <p
              className="text-secondary"
              style={{ fontSize: "0.875rem", lineHeight: "1.7" }}
            >
              You may only analyze your own registered GitHub profile.
              Attempting to analyze another user's profile will result in an
              automatic 403 block. You are responsible for providing accurate
              information at registration.
            </p>
          </div>
          <div className="card mt-4" style={{ background: "var(--bg-hover)" }}>
            <h4
              style={{ color: "var(--text-primary)", marginBottom: "0.4rem" }}
            >
              Recruiter Account
            </h4>
            <p
              className="text-secondary"
              style={{ fontSize: "0.875rem", lineHeight: "1.7" }}
            >
              You may analyze any candidate's publicly available GitHub profile.
              You agree not to misuse analysis results or share them without
              consent. A valid LinkedIn profile URL is required at registration.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="card mt-6">
          <h2
            className="section-title"
            style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}
          >
            🚫 Prohibited Activities
          </h2>
          <ul className="detail-list">
            <li>
              Attempting to bypass security gates or access others' accounts
            </li>
            <li>Uploading malicious files or content as resume</li>
            <li>Using automated scripts to spam the analysis API</li>
            <li>Sharing or selling analysis results commercially</li>
            <li>Misrepresenting your identity or GitHub profile</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="card mt-6">
          <h2
            className="section-title"
            style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}
          >
            ⚡ Service Limitations
          </h2>
          <div
            style={{
              borderLeft: "3px solid var(--accent)",
              paddingLeft: "1rem",
              background: "var(--accent-light)",
              borderRadius: "0 8px 8px 0",
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
            }}
          >
            <p
              className="text-secondary"
              style={{ fontSize: "0.875rem", margin: 0 }}
            >
              ResumeTrust AI uses Google Gemini AI and GitHub API which are
              subject to rate limits. Analysis results are AI-generated and
              should be treated as guidance, not absolute evaluation.
            </p>
          </div>
          <ul className="detail-list">
            <li>PDF files must be under 2MB</li>
            <li>
              Same profile analysis within 24 hours returns cached results
            </li>
            <li>
              Service availability depends on third-party APIs (Gemini, GitHub)
            </li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="card mt-6">
          <h2
            className="section-title"
            style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}
          >
            ⚖️ Disclaimer
          </h2>
          <p className="text-secondary">
            Analysis scores (ATS, Trust) are AI-generated estimates and should
            not be used as the sole basis for hiring decisions. ResumeTrust AI
            is not liable for any employment outcomes based on platform results.
          </p>
        </div>

        {/* Section 6 */}
        <div className="card mt-6">
          <h2
            className="section-title"
            style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}
          >
            ⚖️ Open Source License
          </h2>
          <p className="text-secondary">
            This project is licensed under the <strong>MIT License</strong>. You
            can view the full license text and copyright details on our{" "}
            <a
              href="https://github.com/Vinay-pandey-coder/ResumeTrust-ai/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)" }}
            >
              GitHub Repository
            </a>
            .
          </p>
        </div>

        {/* Footer */}
        <div
          className="text-center mt-10"
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
          }}
        >
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>
            Questions? Contact us at{" "}
            <a
              href="mailto:abhi837688@gmail.com"
              style={{ color: "var(--accent)" }}
            >
              abhi837688@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
