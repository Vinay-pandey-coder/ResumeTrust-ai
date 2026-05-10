import React, { useState } from 'react';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('candidate');

  const candidateSteps = [
    { num: 1, title: 'Register Account', desc: 'Securely join as a candidate. Your GitHub handle is verified and locked to your identity permanently.' },
    { num: 2, title: 'Identity Pre-fill', desc: 'Navigating to Analyze pre-fills your handle. No one can spoof your identity — backend enforced.' },
    { num: 3, title: 'Target Audit', desc: 'Upload your latest resume PDF and optionally paste the Job Description for a precise ATS match.' },
    { num: 4, title: 'AI Engine Compute', desc: 'Gemini AI parses content, fetches live GitHub data, and computes your Trust & ATS scores.' },
    { num: 5, title: 'History & Privacy', desc: 'Raw PDF is deleted. Resulting audit is saved to your dashboard for long-term tracking.' }
  ];

  const recruiterSteps = [
    { num: 1, title: 'Industrial Account', desc: 'Register with LinkedIn. Recruiter status grants access to verify any public engineering profile.' },
    { num: 2, title: 'Universal Audit', desc: 'Enter any candidate handle. No locking applies — verify potential hires in seconds.' },
    { num: 3, title: 'Deep Logic Check', desc: 'Gemini AI executes the full suite: pattern detection, skill mismatching, and red flag spotting.' },
    { num: 4, title: 'Bulk Dashboard', desc: 'Store multiple candidates in one view. Compare audit results and make data-driven decisions.' }
  ];

  const securitySteps = [
    { num: 1, title: 'Identity Lockdown', desc: 'Bypassing frontend results in a 403. Identity is validated via JWT at the database level.' },
    { num: 2, title: 'Session Integrity', desc: 'Every request requires a secure Bearer token. Expired sessions are auto-redirected to Login.' },
    { num: 3, title: 'Zero Persistence', desc: 'Resume files exist only in memory during parsing. Immediate cleanup logic runs for every request.' },
    { num: 4, title: 'Rate Protection', desc: 'Engineered against abuse. 100 requests per 15-minute window per IP to keep the system fast.' }
  ];

  const allSteps = {
    candidate: candidateSteps,
    recruiter: recruiterSteps,
    security: securitySteps
  };

  return (
    <section>
      <h2 className="section-title text-center mb-8">The Pipeline</h2>
      
      <div className="hiw-tabs flex justify-center mb-12">
        {['candidate', 'recruiter', 'security'].map(tab => (
          <button
            key={tab}
            className={`hiw-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ margin: '0 8px' }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="v-timeline-container max-w-800 mx-auto">
        {allSteps[activeTab].map((step) => (
          <div key={step.num} className="v-timeline-item fade-in">
            <div className="v-node-circle">{step.num}</div>
            <div className="v-content-card">
              <h4 className="font-bold text-lg mb-2 text-white">{step.title}</h4>
              <p className="text-secondary text-sm leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;