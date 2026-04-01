import React from 'react';
import Button from '../components/UI/Button';
import MetaData from '../components/SEO/MetaData';

const Pricing = () => {
  return (
    <div className="pricing-page page-container fade-in">
      <MetaData title="Pricing" description="Transparent pricing for individual developers and recruiters." />
      
      <div className="pricing-header text-center py-10">
        <h1 className="hero-title">Simple <span>Pricing</span></h1>
        <p className="text-secondary max-w-800 mx-auto">
          Choose the plan that fits your needs. Start for free and upgrade as you scale your career.
        </p>
      </div>

      <div className="grid-2 max-w-800 mx-auto mt-10">
        {/* Free Plan */}
        <div className="card pricing-card flex flex-col items-center text-center">
          <div className="plan-name mb-4">Free</div>
          <div className="plan-price mb-6">
            <span className="currency">$</span>
            <span className="amount">0</span>
            <span className="period">/month</span>
          </div>
          <ul className="plan-features text-secondary mb-8">
            <li className="mb-2">✓ 3 Analyses per month</li>
            <li className="mb-2">✓ Basic ATS Scoring</li>
            <li className="mb-2">✓ Public GitHub Scan</li>
            <li className="mb-2">✓ AI General Feedback</li>
          </ul>
          <Button variant="outline" fullWidth>Get Started</Button>
        </div>

        {/* Pro Plan */}
        <div className="card pricing-card pro flex flex-col items-center text-center relative overflow-hidden">
          <div className="coming-soon-badge">Coming Soon</div>
          <div className="plan-name mb-4">Pro</div>
          <div className="plan-price mb-6">
            <span className="currency">$</span>
            <span className="amount">19</span>
            <span className="period">/month</span>
          </div>
          <ul className="plan-features text-secondary mb-8">
            <li className="mb-2">✓ Unlimited Analyses</li>
            <li className="mb-2">✓ GitHub Deep Code Scan</li>
            <li className="mb-2">✓ Priority AI Processing</li>
            <li className="mb-2">✓ PDF Export of Reports</li>
            <li className="mb-2">✓ Private Repo Analysis</li>
          </ul>
          <Button variant="primary" fullWidth disabled>Join Waitlist</Button>
        </div>
      </div>

      <div className="pricing-faq mt-20 max-w-800 mx-auto">
        <h2 className="section-title text-center">Frequently Asked Questions</h2>
        <div className="faq-grid grid-2 mt-10">
          <div className="faq-item">
            <h4 className="mb-2">How counts an "Analysis"?</h4>
            <p className="text-secondary">Each time you upload a resume and GitHub handle together, it counts as one analysis credit.</p>
          </div>
          <div className="faq-item">
            <h4 className="mb-2">Can I cancel anytime?</h4>
            <p className="text-secondary">Yes, you can cancel your subscription at any time. Your Pro features will remain active until the end of your billing cycle.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
