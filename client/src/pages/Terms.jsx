import React from "react";
import MetaData from "../components/SEO/MetaData";

const Terms = () => {
  return (
    <div className="page-container fade-in">
      <MetaData
        title="Terms of Service"
        description="ResumeTrust AI Terms of Service — Rules and guidelines for using our platform."
      />

      <div className="max-w-900 mx-auto py-20 px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="legal-tag">Legal Documentation</div>
          <h1 className="hero-title mb-4">
            Terms of <span>Service</span>
          </h1>
          <p className="text-secondary max-w-600 mx-auto mb-6">
            Clear rules and guidelines for using ResumeTrust AI responsibly to ensure a secure professional auditing environment.
          </p>
          <div className="flex-center gap-4">
            <span className="text-xs font-bold text-accent bg-indigo-500/10 px-4 py-2 rounded-full">
              Updated: April 7, 2026
            </span>
          </div>
        </div>

        {/* Section 1: Acceptance */}
        <section className="legal-card">
          <h2 className="section-title text-xl mb-6">📋 Acceptance of Terms</h2>
          <p className="legal-text">
            By registering or using ResumeTrust AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not access or use our platform. These terms constitute a legally binding agreement between you and ResumeTrust AI.
          </p>
        </section>

        {/* Section 2: User Roles - Grid Layout */}
        <section className="legal-card">
          <h2 className="section-title text-xl mb-2">👤 User Roles & Responsibilities</h2>
          <p className="legal-text mb-8">We offer specialized roles with distinct permissions to maintain data integrity.</p>
          
          <div className="legal-grid">
            <div className="card p-8 bg-white/[0.03] border-white/5">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <span>👤</span> Candidate Account
              </h4>
              <p className="text-secondary text-sm leading-relaxed">
                As a candidate, you may only analyze your own registered GitHub profile. Attempting to analyze another user's profile will result in an automatic 403 authorization block and potential account suspension.
              </p>
            </div>
            
            <div className="card p-8 bg-white/[0.03] border-white/5">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <span>🏢</span> Recruiter Account
              </h4>
              <p className="text-secondary text-sm leading-relaxed">
                Recruiters are permitted to analyze publicly available GitHub profiles for evaluation purposes. You agree not to misuse analysis results or share verified data without the candidate's explicit consent.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Prohibited Activities */}
        <section className="legal-card">
          <h2 className="section-title text-xl mb-6">🚫 Prohibited Activities</h2>
          <p className="legal-text">To maintain a high-trust environment, the following activities are strictly forbidden:</p>
          <ul className="legal-list">
            <li>Attempting to bypass security gates or unauthorized scraping of analysis data.</li>
            <li>Uploading malicious files or manipulated PDF documents to influence AI scores.</li>
            <li>Using automated scripts or bots to spam the analysis API or create bulk accounts.</li>
            <li>Sharing or selling verified analysis results for commercial purposes outside the platform.</li>
            <li>Misrepresenting your technical identity or linking unauthorized GitHub profiles.</li>
          </ul>
        </section>

        {/* Section 4: Service Limitations - Info Style */}
        <section className="legal-card legal-card-info">
          <h2 className="section-title text-xl mb-6">⚡ Service Limitations</h2>
          <p className="legal-text mb-6">
            ResumeTrust AI leverages advanced AI models (Google Gemini) and third-party data sources (GitHub). While we strive for accuracy, the following limitations apply:
          </p>
          <div className="grid md:grid-cols-2 gap-8 px-4">
            <div className="text-sm text-secondary">
              <p className="font-bold text-white mb-2">Data Freshness</p>
              Profile analysis within 24 hours returns cached results to respect API rate limits.
            </div>
            <div className="text-sm text-secondary">
              <p className="font-bold text-white mb-2">File Constraints</p>
              Uploaded PDF files must be under 2MB to ensure efficient AI processing.
            </div>
          </div>
        </section>

        {/* Section 5: Disclaimer - Warning Style */}
        <section className="legal-card legal-card-warning">
          <div className="flex gap-4 items-start">
            <span className="text-3xl">⚖️</span>
            <div>
              <h2 className="section-title text-xl mb-4" style={{color: '#fbbf24'}}>Important Disclaimer</h2>
              <p className="legal-text" style={{color: 'rgba(251, 191, 36, 0.8)'}}>
                Analysis scores (ATS Alignment and Trust Velocity) are AI-generated estimates based on available digital footprints. They should be treated as guidance and <strong>not as a sole basis</strong> for formal hiring decisions or employment termination. ResumeTrust AI is not liable for any real-world employment outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Open Source */}
        <section className="legal-card p-12 text-center">
          <h2 className="section-title text-xl mb-4">⚖️ Open Source License</h2>
          <p className="legal-text max-w-600 mx-auto mb-8">
            This project is proudly built with transparency in mind and is licensed under the <strong>MIT License</strong>.
          </p>
          <a
            href="https://github.com/Vinay-pandey-coder/ResumeTrust-ai/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline px-10 py-3"
          >
            View GitHub License
          </a>
        </section>

        {/* Support Strip */}
        <div className="support-strip">
          <h3 className="text-white font-bold text-xl mb-2">Questions about these terms?</h3>
          <p className="text-secondary text-sm mb-6">Our legal and support team is here to help clarify our policies.</p>
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

export default Terms;
