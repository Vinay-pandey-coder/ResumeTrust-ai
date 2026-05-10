import React from 'react';
import Button from '../components/UI/Button';
import MetaData from '../components/SEO/MetaData';

const Pricing = () => {
  return (
    <div className="pricing-page fade-in">
      <MetaData title="Pricing" description="Transparent pricing for individual developers and recruiters." />

      {/* Hero Section */}
      <section className="pricing-hero-wrap">
        <h1 className="hero-main-title">
          Pricing that grows <br />
          <span>with your career</span>
        </h1>
        <p className="hero-desc-text mx-auto">
          Start for free. Upgrade when you need deeper verification, faster analysis, and professional reporting at scale.
        </p>

        <div className="trust-signals-row">
          <div className="trust-signal-item">
            <span className="text-accent">✓</span> No credit card required
          </div>
          <div className="trust-signal-item">
            <span className="text-accent">✓</span> Cancel any time
          </div>
          <div className="trust-signal-item">
            <span className="text-accent">✓</span> Professional Audit Reports
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <div className="pricing-grid max-w-900 mx-auto mt-16 px-4">

        {/* Free Plan */}
        <div className="card pricing-card flex flex-col p-10">
          <div className="p-card-header">
            <span className="p-plan-label">Personal</span>
            <h3 className="p-plan-title">Free Plan</h3>
            <div className="p-plan-price">$0 <span>/month</span></div>
          </div>
          <p className="p-plan-context">Best for developers trying to find the baseline worth of their resume.</p>

          <ul className="p-features-list">
            <li className="p-feature-item">
              <span className="p-feature-icon">✓</span> 3 Analyses per month
            </li>
            <li className="p-feature-item">
              <span className="p-feature-icon">✓</span> Global ATS Scoring
            </li>
            <li className="p-feature-item">
              <span className="p-feature-icon">✓</span> Public GitHub Activity Scan
            </li>
            <li className="p-feature-item">
              <span className="p-feature-icon">✓</span> AI Improvement Feedback
            </li>
            <li className="p-feature-item disabled">
              PDF Audit Reports
            </li>
          </ul>

          <Button variant="outline" fullWidth className="py-4 mt-auto">Get Started Free</Button>
        </div>

        {/* Pro Plan */}
        <div className="card pricing-card highlight flex flex-col p-10">
          <div className="plan-badge-top">Coming Soon</div>
          <div className="p-card-header">
            <span className="p-plan-label">Professional</span>
            <h3 className="p-plan-title">Pro Plan</h3>
            <div className="p-plan-price">$19 <span>/month</span></div>
          </div>
          <p className="p-plan-context">Engineered for serious applicants looking to secure high-tier engineering roles.</p>

          <ul className="p-features-list">
            <li className="p-feature-item">
              <span className="p-feature-icon">✓</span> Unlimited Analyses
            </li>
            <li className="p-feature-item">
              <span className="p-feature-icon">✓</span> GitHub Deep Code Pattern Scan
            </li>
            <li className="p-feature-item">
              <span className="p-feature-icon">✓</span> Priority AI Processing
            </li>
            <li className="p-feature-item">
              <span className="p-feature-icon">✓</span> PDF Export of Audit Reports
            </li>
            <li className="p-feature-item">
              <span className="p-feature-icon">✓</span> Private Repo Authentication
            </li>
          </ul>

          <Button variant="primary" fullWidth className="py-4 mt-auto shadow-lg shadow-indigo-500/20" disabled>Join Waitlist</Button>
        </div>
      </div>

      {/* Trust signals footer */}
      <div className="text-center mt-24 mb-20">
        <p className="text-muted text-sm flex-center gap-2">
          🔒 Secure payments via Stripe • Instant plan activation • Global 24/7 Support
        </p>
      </div>

      {/* FAQ Section Redesign */}
      <section className="faq-wrap">
        <div className="home-container">
          <h2 className="section-title text-center">Frequently Asked Questions</h2>
          <div className="faq-card-grid">
            <div className="faq-card fade-in">
              <h4>What counts as one "Analysis"?</h4>
              <p>Each time you upload a resume PDF and a GitHub handle for a new cross-verification audit, it counts as one analysis credit.</p>
            </div>
            <div className="faq-card fade-in">
              <h4>Can I cancel anytime?</h4>
              <p>Absolutely. You can manage your subscription from your dashboard. Pro features remain active until the end of your billing cycle.</p>
            </div>
            <div className="faq-card fade-in">
              <h4>Do I need a credit card?</h4>
              <p>Not for the Free plan. You can start verifying your engineering proof immediately with just an email and GitHub handle.</p>
            </div>
            <div className="faq-card fade-in">
              <h4>When will Pro launch?</h4>
              <p>We are currently in private beta. Join the waitlist to be first in line when we open deep-scan verification for the public.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
