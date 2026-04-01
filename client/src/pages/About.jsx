import React from 'react';
import MetaData from '../components/SEO/MetaData';

const About = () => {
  return (
    <div className="about-page page-container fade-in">
      <MetaData title="About Us" description="Learn how ResumeTrust AI helps building trust in tech hiring." />
      
      <div className="about-content max-w-800 mx-auto py-10">
        <h1 className="hero-title text-center">Building <span>Trust</span> in Tech Hiring</h1>
        
        <section className="mt-10">
          <p className="text-secondary mb-6">
            ResumeTrust AI was born from a simple observation: the tech hiring process is broken. 
            Recruiters struggle with exaggerated resumes, while honest candidates struggle to 
            stand out in a sea of noise.
          </p>
          <p className="text-secondary mb-6">
            Our platform uses advanced AI to bridge this gap. We don't just scan for keywords; 
            we verify expertise by analyzing code activity and cross-referencing GitHub footprints 
            with professional claims.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="section-title">How the Trust Score Works</h2>
          <div className="card">
            <p className="text-primary mb-4 font-bold">The Trust Score is a composite metric based on:</p>
            <ul className="detail-list">
              <li><strong>GitHub Activity:</strong> Consistency and quality of code contributions.</li>
              <li><strong>Skill Validation:</strong> Verification of languages and frameworks mentioned in the resume against actual repositories.</li>
              <li><strong>Consistency Check:</strong> Detecting discrepancies between claimed years of experience and public code history.</li>
              <li><strong>Code Samples:</strong> Analysis of public repositories for code quality and patterns.</li>
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="section-title">Privacy & Security</h2>
          <div className="card border-danger">
            <p className="text-secondary">
              Your privacy is our priority. <strong>We delete your resume files immediately</strong> 
              after the analysis is complete. We only store the resulting scores and extracted 
              metadata to provide you with a history and improvement tracking.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="section-title">Our Tech Stack</h2>
          <p className="text-secondary mb-4">ResumeTrust AI is built using cutting-edge technologies to ensure speed and accuracy:</p>
          <div className="flex flex-wrap gap-4">
            <span className="badge badge-accent">React + Vite</span>
            <span className="badge badge-accent">Node.js + Express</span>
            <span className="badge badge-accent">OpenAI GPT-4o</span>
            <span className="badge badge-accent">GitHub API</span>
            <span className="badge badge-accent">Vector Databases</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
