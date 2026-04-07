import React from 'react';
import MetaData from '../components/SEO/MetaData';

const Privacy = () => {
  return (
    <div className="page-container fade-in">
      <MetaData
        title="Privacy Policy"
        description="ResumeTrust AI Privacy Policy — How we collect, use, and protect your data."
      />

      <div className="max-w-800 mx-auto py-10">

        <div className="text-center mb-10">
          <h1 className="hero-title">Privacy <span>Policy</span></h1>
          <p className="text-secondary">Last updated: April 7, 2026 · We take your privacy seriously</p>
        </div>

        {/* Section 1 */}
        <div className="card mt-6">
          <h2 className="section-title" style={{fontSize: '1.1rem', marginBottom: '1rem'}}>
            📥 Data We Collect
          </h2>
          <div className="card mt-4" style={{background: 'var(--bg-hover)'}}>
            <h4 style={{color: 'var(--text-primary)', marginBottom: '0.4rem'}}>Account Information</h4>
            <p className="text-secondary" style={{fontSize: '0.875rem', lineHeight: '1.7'}}>
              Name, email, hashed password, GitHub handle (candidates) or LinkedIn URL (recruiters).
              Passwords are never stored in plain text — bcryptjs hashing is used.
            </p>
          </div>
          <div className="card mt-4" style={{background: 'var(--bg-hover)'}}>
            <h4 style={{color: 'var(--text-primary)', marginBottom: '0.4rem'}}>Analysis Data</h4>
            <p className="text-secondary" style={{fontSize: '0.875rem', lineHeight: '1.7'}}>
              ATS score, Trust score, skills matched, missing skills, recommendations, and red flags.
              This data is stored to power your history dashboard.
            </p>
          </div>
          <div className="card mt-4" style={{background: 'var(--bg-hover)'}}>
            <h4 style={{color: 'var(--text-primary)', marginBottom: '0.4rem'}}>GitHub Data (Public Only)</h4>
            <p className="text-secondary" style={{fontSize: '0.875rem', lineHeight: '1.7'}}>
              We fetch only publicly available GitHub data — repos, languages, star counts,
              and follower counts. We never access private repositories.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="card mt-6">
          <h2 className="section-title" style={{fontSize: '1.1rem', marginBottom: '0.75rem'}}>
            🗑️ Data We Do NOT Store
          </h2>
          <div style={{
            borderLeft: '3px solid var(--accent)',
            background: 'var(--accent-light)',
            borderRadius: '0 8px 8px 0',
            padding: '0.75rem 1rem',
            marginBottom: '1rem'
          }}>
            <p className="text-secondary" style={{fontSize: '0.875rem', margin: 0}}>
              Your PDF resume is permanently deleted from our server immediately after text
              extraction. We never store your actual resume file.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 mt-4">
            <span className="badge badge-danger">❌ PDF files</span>
            <span className="badge badge-danger">❌ Plain text passwords</span>
            <span className="badge badge-danger">❌ Private GitHub data</span>
            <span className="badge badge-danger">❌ Payment information</span>
          </div>
        </div>

        {/* Section 3 */}
        <div className="card mt-6">
          <h2 className="section-title" style={{fontSize: '1.1rem', marginBottom: '0.75rem'}}>
            🔒 How We Protect Your Data
          </h2>
          <div className="flex flex-wrap gap-8 mb-6">
            <span className="badge badge-success">✓ JWT encryption</span>
            <span className="badge badge-success">✓ bcryptjs hashing</span>
            <span className="badge badge-success">✓ HTTPS only</span>
            <span className="badge badge-success">✓ Rate limiting</span>
            <span className="badge badge-success">✓ CORS restricted</span>
            <span className="badge badge-success">✓ Helmet.js headers</span>
          </div>
          <p className="text-secondary">
            All data is transmitted over encrypted HTTPS connections. MongoDB Atlas provides
            encrypted storage at rest.
          </p>
        </div>

        {/* Section 4 */}
        <div className="card mt-6">
          <h2 className="section-title" style={{fontSize: '1.1rem', marginBottom: '0.75rem'}}>
            🧹 Data Retention
          </h2>
          <ul className="detail-list">
            <li>Analysis records are automatically deleted after 30 days via weekly cleanup</li>
            <li>Account data is retained until you request deletion</li>
            <li>PDF files are deleted immediately after analysis (within seconds)</li>
            <li>Cached analysis results expire after 24 hours</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="card mt-6">
          <h2 className="section-title" style={{fontSize: '1.1rem', marginBottom: '0.75rem'}}>
            🤝 Third-Party Services
          </h2>
          <p className="text-secondary mb-6">
            We use the following third-party services to power the platform:
          </p>
          <ul className="detail-list">
            <li><strong style={{color: 'var(--text-primary)'}}>Google Gemini AI</strong> — Resume analysis (subject to Google's privacy policy)</li>
            <li><strong style={{color: 'var(--text-primary)'}}>GitHub REST API</strong> — Public profile data (subject to GitHub's privacy policy)</li>
            <li><strong style={{color: 'var(--text-primary)'}}>MongoDB Atlas</strong> — Encrypted cloud database</li>
            <li><strong style={{color: 'var(--text-primary)'}}>Render</strong> — Backend hosting</li>
            <li><strong style={{color: 'var(--text-primary)'}}>Vercel</strong> — Frontend hosting</li>
          </ul>
        </div>

        {/* Section 6 */}
        <div className="card mt-6">
          <h2 className="section-title" style={{fontSize: '1.1rem', marginBottom: '0.75rem'}}>
            ✉️ Your Rights
          </h2>
          <ul className="detail-list">
            <li>Request deletion of your account and all associated data</li>
            <li>Request a copy of your stored analysis history</li>
            <li>Update your account information at any time</li>
          </ul>
          <p className="text-secondary mt-6">
            To exercise these rights, contact us at the email below.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-10" style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem'
        }}>
          <p className="text-muted" style={{fontSize: '0.875rem'}}>
            Questions? Contact us at{' '}
            <a href="mailto:abhi837688@gmail.com" style={{color: 'var(--accent)'}}>
              abhi837688@gmail.com
            </a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Privacy;