import React, { useState } from 'react';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('candidate');

  const candidateSteps = [
    {
      num: 1, color: 'purple',
      title: 'Register as candidate',
      desc: 'Name, email, password + GitHub handle (compulsory). Handle locked to your profile permanently.',
      tags: ['isRecruiter: false', 'githubHandle saved to DB']
    },
    {
      num: 2, color: 'teal',
      title: 'Go to Analyze page',
      desc: "GitHub handle auto-filled and locked. Cannot enter anyone else's handle — backend enforces this.",
      tags: ['handle pre-filled', 'input disabled']
    },
    {
      num: 3, color: 'green',
      title: 'Upload PDF + paste JD',
      desc: 'Upload resume PDF (max 5MB). Optionally paste job description for ATS matching.',
      tags: ['PDF only 5MB', 'JD optional']
    },
    {
      num: 4, color: 'amber',
      title: 'AI analysis runs',
      desc: 'PDF parsed → GitHub fetched → Gemini AI → ATS score, Trust score, skills, red flags.',
      tags: ['Gemini 2.5 Flash', 'GitHub API', 'pdf-parse-fork']
    },
    {
      num: 5, color: 'green',
      title: 'Results + history saved',
      desc: 'PDF deleted immediately. Results saved to MongoDB. View on Dashboard.',
      tags: ['PDF auto-deleted', 'MongoDB history']
    }
  ];

  const recruiterSteps = [
    {
      num: 1, color: 'purple',
      title: 'Register as recruiter',
      desc: 'Check "I am a recruiter" during registration. LinkedIn URL required instead of GitHub.',
      tags: ['isRecruiter: true', 'linkedinProfile saved']
    },
    {
      num: 2, color: 'teal',
      title: 'Analyze any candidate',
      desc: "GitHub username is open — enter any candidate's handle. No restriction applies.",
      tags: ['any username allowed', 'input not disabled']
    },
    {
      num: 3, color: 'amber',
      title: 'Same AI analysis runs',
      desc: 'Identical flow — PDF parse → GitHub → Gemini AI → full scores and breakdown.',
      tags: ['same AI pipeline', 'ATS + Trust scores']
    },
    {
      num: 4, color: 'green',
      title: 'Results saved to history',
      desc: "Each analysis stored under recruiter's account. Dashboard shows all candidates analyzed.",
      tags: ['stored by userId', 'expandable cards']
    }
  ];

  const securitySteps = [
    {
      num: 1, color: 'danger',
      title: 'Candidate GitHub lock',
      desc: 'Backend rejects 403 if candidate submits different username than registered — even if frontend bypassed.',
      tags: ['403 if mismatch', 'backend enforced']
    },
    {
      num: 2, color: 'purple',
      title: 'JWT auth on every route',
      desc: 'All protected routes need Bearer token. Invalid token → 401 → auto logout and redirect.',
      tags: ['30 day expiry', 'verify on every request']
    },
    {
      num: 3, color: 'amber',
      title: 'PDF auto-deleted',
      desc: 'Resume deleted after text extraction. Cleanup runs even if server crashes mid-way.',
      tags: ['deleted after parse', 'cleanup in catch block']
    },
    {
      num: 4, color: 'teal',
      title: 'Rate limiting',
      desc: 'Max 100 requests per IP in 15 minutes. Prevents abuse and API quota exhaustion.',
      tags: ['100 req / 15 min', 'express-rate-limit']
    },
    {
      num: 5, color: 'green',
      title: 'CORS locked',
      desc: 'Backend only accepts requests from localhost:5173. All other origins blocked.',
      tags: ['origin whitelist', 'helmet headers']
    }
  ];

  const allSteps = {
    candidate: candidateSteps,
    recruiter: recruiterSteps,
    security: securitySteps
  };

  const colorMap = {
    purple: 'hiw-purple',
    teal:   'hiw-teal',
    green:  'hiw-green',
    amber:  'hiw-amber',
    danger: 'hiw-danger',
  };

  return (
    <section className="mt-10">
      <h2 className="section-title">How It Works</h2>

      <div className="hiw-tabs flex gap-8 mb-10">
        {['candidate', 'recruiter', 'security'].map(tab => (
          <button
            key={tab}
            className={`hiw-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'candidate' ? 'Candidate' : tab === 'recruiter' ? 'Recruiter' : 'Security'}
          </button>
        ))}
      </div>

      <div className="card">
        {allSteps[activeTab].map((step) => (
          <div key={step.num} className="hiw-step">
            <div className={`hiw-num ${colorMap[step.color]}`}>{step.num}</div>
            <div className="hiw-content">
              <h4 className="hiw-title">{step.title}</h4>
              <p className="hiw-desc text-secondary">{step.desc}</p>
              <div className="flex flex-wrap gap-8">
                {step.tags.map((tag, i) => (
                  <span key={i} className="badge badge-accent">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;