import React from 'react';
import MetaData from '../components/SEO/MetaData';
import HowItWorks from '../components/HowItWorks';

const About = () => {
  return (
    <div className="about-page fade-in">
      <MetaData title="About Us" description="Learn how ResumeTrust AI helps building trust in tech hiring." />
      
      {/* Hero Section */}
      <section className="about-hero-wrap">
        <h1 className="hero-main-title">
          Building <span>Trust</span> <br />
          in Tech Hiring
        </h1>
        <div className="highlight-line text-left mx-auto max-w-600">
          "The tech hiring process is broken. We use AI to bridge the gap between Great Talent and Real Proof."
        </div>
        <div className="text-secondary leading-relaxed max-w-800 mx-auto">
          <p className="mb-4">
            ResumeTrust AI was born from a simple observation: recruiters struggle with exaggerated resumes, while honest candidates struggle to stand out in a sea of noise.
          </p>
          <p>
            Our platform uses advanced AI to bridge this gap. We don't just scan for keywords; we verify expertise by analyzing code activity and cross-referencing repository data with professional claims.
          </p>
        </div>
      </section>

      {/* Trust Score Section */}
      <section className="home-section">
        <div className="home-container">
          <h2 className="section-title text-center">How the Trust Score Works</h2>
          <p className="text-secondary text-center mb-8">A composite metric designed for industrial-grade accuracy.</p>
          
          <div className="trust-cards-grid">
            {[
              { t: 'GitHub Activity', d: 'Analyzing consistency and quality of code contributions over time.' },
              { t: 'Skill Validation', d: 'Verification of languages & frameworks mentioned against actual repos.' },
              { t: 'Existence Check', d: 'Detecting discrepancies between claimed years and public commits.' },
              { t: 'Pattern Analysis', d: 'Deep analysis of repository quality, architecture, and complexity.' }
            ].map((card, i) => (
              <div key={i} className="trust-mini-card">
                <h4>{card.t}</h4>
                <p>{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Vertical Timeline Section */}
      <section className="home-section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="home-container">
          <HowItWorks />
        </div>
      </section>

      {/* Privacy Section */}
      <section className="home-section">
        <div className="home-container">
          <div className="security-safe-card">
            <div className="shield-icon">🛡️</div>
            <div>
              <h3 className="font-bold text-xl mb-3 text-white">Privacy is our Priority</h3>
              <p className="text-secondary leading-relaxed">
                Your resume files are <strong>deleted immediately</strong> after extraction. 
                We don't store your documents; we only store the resulting audit metadata to 
                help you track your progress over time. Fully encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="home-section mb-20 text-center">
        <div className="home-container">
          <h2 className="section-title">Verified Infrastructure</h2>
          <p className="text-secondary">Built with the fastest and most secure technologies available today.</p>
          
          <div className="tech-stack-center">
            {['React 19', 'Node.js', 'Express', 'Gemini Flash AI', 'GitHub API v4', 'MongoDB Atlas'].map((tech, i) => (
              <div key={i} className="tech-badge-premium">{tech}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;