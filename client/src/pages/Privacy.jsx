import React from 'react';
import MetaData from '../components/SEO/MetaData';

const Privacy = () => {
  return (
    <div className="page-container fade-in px-6">
      <MetaData
        title="Privacy Policy"
        description="ResumeTrust AI Privacy Policy — How we collect, use, and protect your data."
      />

      <div className="max-w-900 mx-auto py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="legal-tag">Protection Protocol</div>
          <h1 className="hero-title mb-4">Privacy <span>Policy</span></h1>
          <p className="text-secondary max-w-600 mx-auto mb-6">
            A clear breakdown of what we collect, protect, and never store to ensure your professional identity remains secure.
          </p>
          <div className="flex-center">
            <span className="text-xs font-bold text-accent bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
              Latest Version: April 7, 2026
            </span>
          </div>
        </div>

        {/* Section 1: Data We Collect - Modern Grid */}
        <section className="legal-card">
          <h2 className="section-title text-xl mb-2">📥 Data We Collect</h2>
          <p className="legal-text mb-4">We only collect the minimum amount of data required to provide our auditing services.</p>

          <div className="collect-grid">
            <div className="collect-item">
              <h4 className="text-white font-bold text-sm mb-3">Account Info</h4>
              <p className="text-xs text-secondary leading-relaxed">Name, email, hashed password, and your registered professional handles.</p>
            </div>
            <div className="collect-item">
              <h4 className="text-white font-bold text-sm mb-3">Analysis Logic</h4>
              <p className="text-xs text-secondary leading-relaxed">ATS scores, trust velocity, and matched skills metadata to power your dashboard.</p>
            </div>
            <div className="collect-item">
              <h4 className="text-white font-bold text-sm mb-3">Public Traces</h4>
              <p className="text-xs text-secondary leading-relaxed">Publicly available GitHub repository metadata. We never access private project data.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Data We Do NOT Store - High Trust Block */}
        <section className="high-trust-card">
          <h2 className="section-title text-xl mb-6">🗑️ Our "Zero Storage" Guarantee</h2>
          <p className="legal-text mb-8">
            Your trust is our priority. We have engineered our pipeline to ensure sensitive documents are never permanently archived.
          </p>

          <div className="bg-black/20 p-6 rounded-2xl border border-white/5 mb-8">
            <p className="text-sm text-secondary italic">
              "Your PDF resume is permanently purged from our secure servers immediately after the AI text extraction process. We do not keep copies of your CV."
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="badge badge-danger px-4 py-2 text-[0.65rem] uppercase font-bold">No PDF Storage</span>
            <span className="badge badge-danger px-4 py-2 text-[0.65rem] uppercase font-bold">No Private Repos</span>
            <span className="badge badge-danger px-4 py-2 text-[0.65rem] uppercase font-bold">No Plaintext PW</span>
            <span className="badge badge-danger px-4 py-2 text-[0.65rem] uppercase font-bold">No Tracking Cookies</span>
          </div>
        </section>

        {/* Section 3: Protection - Security Board */}
        <section className="legal-card">
          <h2 className="section-title text-xl mb-4">🔒 Institutional Grade Security</h2>
          <p className="legal-text mb-6">We employ multiple layers of encryption and protection to safeguard your professional data.</p>

          <div className="security-board">
            <span className="badge badge-success border-success/20">JWT Encryption</span>
            <span className="badge badge-success border-success/20">Bcrypt Hashing</span>
            <span className="badge badge-success border-success/20">SSL/HTTPS</span>
            <span className="badge badge-success border-success/20">Rate Limiting</span>
            <span className="badge badge-success border-success/20">CORS Lockdown</span>
            <span className="badge badge-success border-success/20">Helmet.js Implementation</span>
          </div>

          <p className="legal-text mt-6 text-sm italic">
            All data at rest is stored in MongoDB Atlas with institutional-grade AES-256 encryption.
          </p>
        </section>

        {/* Section 4: Data Retention & Third-Party - List Variation */}
        <div className="legal-grid">
          <section className="legal-card mb-0">
            <h2 className="section-title text-xl mb-6">🧹 Data Retention</h2>
            <ul className="legal-list">
              <li>Analysis records are cleared after <strong className="text-white">30 days</strong>.</li>
              <li>Account data is kept until <strong className="text-white">Deletion Request</strong>.</li>
              <li>PDF ephemeral storage lasts only <strong className="text-white">Seconds</strong>.</li>
              <li>Cached results expire in <strong className="text-white">24 Hours</strong>.</li>
            </ul>
          </section>

          <section className="legal-card mb-0">
            <h2 className="section-title text-xl mb-6">🤝 Ecosystem Partners</h2>
            <p className="text-xs text-secondary mb-6 leading-relaxed">We partner with standard-setting providers to ensure platform stability:</p>
            <ul className="legal-list">
              <li className="text-xs"><strong className="text-white/80">Google Gemini</strong> for AI Logic</li>
              <li className="text-xs"><strong className="text-white/80">GitHub</strong> for Audit Sources</li>
              <li className="text-xs"><strong className="text-white/80">MongoDB Atlas</strong> for Cloud Data</li>
              <li className="text-xs"><strong className="text-white/80">Vercel & Render</strong> for Infrastructure</li>
            </ul>
          </section>
        </div>

        {/* Section 5: Your Rights - Action Points */}
        <section className="legal-card mt-6">
          <h2 className="section-title text-xl mb-8">⚖️ Your Data Access Rights</h2>

          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="action-point border border-white/5">
              <span className="text-2xl">🗑️</span>
              <div>
                <p className="text-white font-bold text-sm mb-1">Request Deletion</p>
                <p className="text-xs text-secondary">Instantly wipe all account and history data from our records.</p>
              </div>
            </div>
            <div className="action-point border border-white/5">
              <span className="text-2xl">📥</span>
              <div>
                <p className="text-white font-bold text-sm mb-1">Data Portability</p>
                <p className="text-xs text-secondary">Download a full report of your analysis and verification history.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Support Strip */}
        <div className="support-strip">
          <h3 className="text-white font-bold text-xl mb-2">Privacy Concerns?</h3>
          <p className="text-secondary text-sm mb-6">Our security lead is available to answer any technical questions regarding data handling.</p>
          <a
            href="mailto:abhi837688@gmail.com"
            className="text-accent font-bold text-lg hover:underline decoration-2 underline-offset-8"
          >
            abhi837688@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Privacy;