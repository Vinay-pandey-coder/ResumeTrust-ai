import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import MetaData from '../components/SEO/MetaData';
import { loginUser, registerUser } from '../services/api';

const Home = ({ isLoggedIn, login, openLogin }) => {
  const [showModal, setShowModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isRecruiter: false
  });

  useEffect(() => {
    if (openLogin) {
      setShowModal(true);
      setIsRegister(false);
    }
  }, [openLogin]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (isRegister) {
        response = await registerUser(formData);
        toast.success('Registration successful!');
      } else {
        response = await loginUser({ 
          email: formData.email, 
          password: formData.password 
        });
        toast.success('Welcome back!');
      }
      
      login(response, response.token);
      setShowModal(false);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page page-container">
      <MetaData 
        title="Know Your Resume's Worth" 
        description="Verify your resume authenticity and get real-time ATS scores with GitHub integration."
      />

      {/* Hero Section */}
      <section className="hero-section text-center fade-in">
        <h1 className="hero-title">
          Know If Your Resume <br />
          <span>Can Be Trusted</span>
        </h1>
        <p className="hero-subtitle text-secondary">
          AI-powered ATS scoring combined with real-time GitHub verification 
          to validate your expertise for recruiters.
        </p>
        <div className="hero-cta">
          {isLoggedIn ? (
            <Button onClick={() => navigate('/dashboard')} variant="primary">
              Go to Dashboard
            </Button>
          ) : (
            <Button onClick={() => setShowModal(true)} variant="primary">
              Get Started Free
            </Button>
          )}
          <Link to="/about" className="hero-link ml-4">Learn how it works &rarr;</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section mt-20">
        <h2 className="section-title text-center">Powerful Features</h2>
        <div className="grid-3">
          <div className="card feature-card">
            <div className="feature-icon success">📊</div>
            <h3>ATS Scoring</h3>
            <p className="text-secondary">Get an instant calculation of how well your resume matches modern Applicant Tracking Systems.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon accent">🛡️</div>
            <h3>Trust Score</h3>
            <p className="text-secondary">Unique AI verification that cross-references your claims with your actual GitHub contributions.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon warning">💡</div>
            <h3>AI Suggestions</h3>
            <p className="text-secondary">Personalized feedback on missing skills, red flags, and how to improve your overall portfolio.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section mt-20">
        <h2 className="section-title text-center">How It Works</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <h4>Upload Resume</h4>
            <p className="text-secondary">Drop your PDF resume for AI parsing.</p>
          </div>
          <div className="step-arrow">&rarr;</div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h4>GitHub Connect</h4>
            <p className="text-secondary">Add your handle for code verification.</p>
          </div>
          <div className="step-arrow">&rarr;</div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h4>Get Results</h4>
            <p className="text-secondary">Instant deep analysis and scoring.</p>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {showModal && (
        <div className="modal-overlay flex-center" onClick={() => setShowModal(false)}>
          <div className="modal-content card" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="modal-subtitle text-secondary">
              {isRegister ? 'Start verifying your resume today.' : 'Login to access your dashboard.'}
            </p>
            
            <form onSubmit={handleSubmit} className="mt-6">
              {isRegister && (
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              )}
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              
              {isRegister && (
                <div className="checkbox-group mb-4">
                  <input
                    type="checkbox"
                    id="isRecruiter"
                    name="isRecruiter"
                    checked={formData.isRecruiter}
                    onChange={handleChange}
                  />
                  <label htmlFor="isRecruiter" className="ml-2 text-secondary">I am a recruiter</label>
                </div>
              )}

              <Button type="submit" fullWidth loading={loading}>
                {isRegister ? 'Sign Up' : 'Login'}
              </Button>
            </form>

            <div className="modal-footer mt-4 text-center">
              <span className="text-muted">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button 
                className="text-accent ml-2 btn-link" 
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
