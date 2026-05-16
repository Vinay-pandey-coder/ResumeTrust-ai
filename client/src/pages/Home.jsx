import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import MetaData from '../components/SEO/MetaData';
import { loginUser, registerUser } from '../services/api';

const Home = ({ isLoggedIn, login, openLogin, openRegister }) => {
  const [showModal, setShowModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isRecruiter: false,
    githubHandle: '',
    linkedinProfile: ''
  });

  // ✅ Backend URL for GitHub Auth (Port 5000)
  const GITHUB_AUTH_URL = "http://localhost:5000/api/auth/github";

  // ✅ Effect to handle GitHub Callback and Auto-fill form
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const githubUsername = queryParams.get('github_username');
    const isVerified = queryParams.get('github_verified');

    if (githubUsername && isVerified === 'true') {
      setShowModal(true);
      setIsRegister(true);
      setFormData(prev => ({
        ...prev,
        githubHandle: githubUsername,
        name: queryParams.get('github_name') || prev.name
      }));

      toast.success(`GitHub Identity Verified: ${githubUsername}`);

      // Clear URL parameters to keep it clean
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  useEffect(() => {
    if (openLogin) {
      setShowModal(true);
      setIsRegister(false);
    }
  }, [openLogin]);

  useEffect(() => {
    if (openRegister) {
      setShowModal(true);
      setIsRegister(true);
    }
  }, [openRegister]);

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
        // Validation check for Candidate
        if (!formData.isRecruiter && !formData.githubHandle) {
          toast.error('Please verify your GitHub identity first');
          setLoading(false);
          return;
        }
        response = await registerUser(formData);
        toast.success('Registration successful!');
      } else {
        response = await loginUser({ email: formData.email, password: formData.password });
        toast.success('Welcome back!');
      }
      login(response.user, response.token);
      setShowModal(false);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    // Redirect to backend Passport route
    window.location.href = GITHUB_AUTH_URL;
  };

  const openModal = (registerMode = false) => {
    setIsRegister(registerMode);
    setFormData({ name: '', email: '', password: '', isRecruiter: false, githubHandle: '', linkedinProfile: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <div className="home-page overflow-x-hidden">
      <MetaData
        title="Know Your Resume's Worth"
        description="Verify your resume authenticity and get real-time ATS scores with GitHub integration."
      />

      {/* Hero Section */}
      <section className="home-section">
        <div className="home-container hero-layout fade-in">
          <div className="hero-text-side">
            <div className="trust-badge-pill">✨ Verified for Recruiters</div>
            <h1 className="hero-main-title">
              Know If Your Resume <br />
              <span>Can Be Trusted</span>
            </h1>
            <p className="hero-desc-text">
              Revolutionizing technical hiring with real-time GitHub verification & AI-powered ATS auditing. Build proof, not just profiles.
            </p>
            <div className="hero-btn-group">
              {isLoggedIn ? (
                <Button onClick={() => navigate('/dashboard')} variant="primary" style={{ padding: '16px 32px' }}>
                  Open Dashboard
                </Button>
              ) : (
                <Button onClick={() => openModal(false)} variant="primary" style={{ padding: '16px 32px' }}>
                  Start Free Analysis
                </Button>
              )}
              <Link to="/about" className="nav-link font-bold text-accent">Learn More &rarr;</Link>
            </div>
          </div>

          <div className="hero-visual-side">
            <div className="preview-card-glow"></div>
            <div className="premium-preview-card">
              <div className="preview-card-header">
                <div className="avatar-circle">JD</div>
                <div className="header-info">
                  <h4>Jane Doe</h4>
                  <p>Verified Developer</p>
                </div>
              </div>
              <div className="card-divider"></div>
              <div className="preview-stats-list">
                <div className="preview-stat-item">
                  <span className="stat-label-muted">Trust Score</span>
                  <span className="stat-val-success">98%</span>
                </div>
                <div className="preview-stat-item">
                  <span className="stat-label-muted">ATS Match</span>
                  <span className="stat-val-white">92%</span>
                </div>
                <div className="preview-stat-item">
                  <span className="stat-label-muted">Verification</span>
                  <span className="stat-val-accent">YES</span>
                </div>
              </div>
              <div className="preview-card-footer">React · Node · MongoDB</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip-container">
        <div className="home-container stats-grid">
          <div className="stat-box">
            <span className="stat-num">99%</span>
            <span className="stat-label">ATS Accuracy</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">5k+</span>
            <span className="stat-label">Users Trusted</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">Live</span>
            <span className="stat-label">GitHub Verification</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">&lt; 3s</span>
            <span className="stat-label">Sync Speed</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-section">
        <div className="home-container">
          <div className="text-center mb-12">
            <h2 className="section-title">Industrial Grade Verification</h2>
            <p className="text-secondary max-w-800 mx-auto">Engineered to detect discrepancies and validate engineering potential with algorithmic precision.</p>
          </div>
          <div className="features-grid">
            <div className="feature-glass-card">
              <div className="feature-icon-box">📊</div>
              <h3 className="font-bold mb-4">ATS Deep Scan</h3>
              <p className="text-secondary text-sm">Our AI simulates enterprise ATS logic to rank your resume density and formatting accuracy.</p>
            </div>
            <div className="feature-glass-card">
              <div className="feature-icon-box">🛡️</div>
              <h3 className="font-bold mb-4">Trust Identity</h3>
              <p className="text-secondary text-sm">We cross-reference every claim in your resume with real repository languages and commit history.</p>
            </div>
            <div className="feature-glass-card">
              <div className="feature-icon-box">⚠️</div>
              <h3 className="font-bold mb-4">Risk Detection</h3>
              <p className="text-secondary text-sm">Instantly spot inconsistent dates, suspicious skill-stacking, and employment timeline gaps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="home-section" style={{ background: 'rgba(99, 102, 241, 0.02)' }}>
        <div className="home-container">
          <h2 className="section-title text-center mb-12">The Pipeline</h2>
          <div className="steps-pipeline-wrap">
            <div className="pipeline-connector"></div>
            <div className="pipeline-node">
              <div className="node-num-circle">1</div>
              <h4 className="font-bold mb-2">Upload Resume</h4>
              <p className="text-sm text-secondary">PDF is parsed and mapped</p>
            </div>
            <div className="pipeline-node">
              <div className="node-num-circle">2</div>
              <h4 className="font-bold mb-2">Connect Identity</h4>
              <p className="text-sm text-secondary">GitHub API verify profile</p>
            </div>
            <div className="pipeline-node">
              <div className="node-num-circle">3</div>
              <h4 className="font-bold mb-2">Instant Audit</h4>
              <p className="text-sm text-secondary">Score and Red Flags ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal Redesign */}
      {showModal && (
        <div className="modal-overlay auth-wrapper" onClick={closeModal}>
          <div className="auth-glow-bg"></div>
          <div className="modal-content auth-card-premium p-10 rounded-3xl relative" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-8">
              <h2 className="modal-title font-bold text-3xl mb-3 text-white">
                {isRegister ? (formData.githubHandle ? 'Complete Profile' : 'Verify Your Identity') : 'Welcome Back'}
              </h2>
              <p className="text-secondary text-sm px-4">
                {isRegister
                  ? (formData.githubHandle ? 'Almost there! Set your password.' : 'Connect your GitHub to validate your skills and build trust.')
                  : 'Login to access your active reports.'}
              </p>
            </div>

            {/* ✅ The Pipeline - Integrated into Modal */}
            {isRegister && !formData.githubHandle && (
              <div className="modal-pipeline-mini mb-10">
                <div className="pipeline-connector-mini"></div>
                <div className="flex-between relative">
                  <div className="pipeline-node-mini">
                    <div className="node-dot active">1</div>
                    <span className="text-[0.6rem] uppercase tracking-tighter font-bold">Upload</span>
                  </div>
                  <div className="pipeline-node-mini">
                    <div className="node-dot pulse">2</div>
                    <span className="text-[0.6rem] uppercase tracking-tighter font-bold">Verify</span>
                  </div>
                  <div className="pipeline-node-mini">
                    <div className="node-dot">3</div>
                    <span className="text-[0.6rem] uppercase tracking-tighter font-bold">Audit</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recruiter Toggle (Only show in Register mode) */}
            {isRegister && (
              <div className="flex-center mb-6">
                <label className="auth-toggle-pill">
                  <input
                    type="checkbox"
                    id="isRecruiter"
                    name="isRecruiter"
                    checked={formData.isRecruiter}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className={`text-xs font-bold ${formData.isRecruiter ? 'text-accent' : 'text-muted'}`}>
                    {formData.isRecruiter ? '🏢 Recruiter Account' : '👤 Candidate Account'}
                  </span>
                </label>
              </div>
            )}

            {/* Main Form Flow */}
            {!isRegister || formData.isRecruiter ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                )}
                <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
                <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />

                {isRegister && formData.isRecruiter && (
                  <Input label="LinkedIn Profile URL" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} placeholder="https://linkedin.com/in/profile" required />
                )}

                <Button type="submit" fullWidth loading={loading} className="py-4 mt-6 shadow-indigo-500/10">
                  {isRegister ? 'Create Account' : 'Sign In'}
                </Button>
              </form>
            ) : (
              /* ✅ GitHub Verified View for Candidate */
              <div className="space-y-6">
                {formData.githubHandle ? (
                  /* Form unlocked after GitHub verification */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-4">
                      <p className="text-xs text-green-400 flex items-center justify-center gap-2 font-bold">
                        <span>✓</span> Identity Verified: {formData.githubHandle}
                      </p>
                    </div>
                    <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                    <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
                    <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                    <Input label="GitHub Handle" name="githubHandle" value={formData.githubHandle} onChange={() => { }} readOnly className="bg-white/5 opacity-70" />

                    <Button type="submit" fullWidth loading={loading} className="py-4 mt-6">Complete Registration</Button>
                  </form>
                ) : (
                  /* Initial Connect Button - REDESIGNED */
                  <div className="space-y-4">
                    <Button
                      onClick={handleGitHubLogin}
                      fullWidth
                      className="github-btn-premium flex items-center justify-center gap-3 py-4"
                    >
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                      Continue with GitHub &rarr;
                    </Button>

                    {/* Trust Indicators */}
                    <div className="auth-trust-list">
                      <div className="trust-item-p"><span>✓</span> Secure OAuth via GitHub</div>
                      <div className="trust-item-p"><span>✓</span> No password stored</div>
                      <div className="trust-item-p"><span>✓</span> Read-only access to public repo data</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="modal-footer mt-8 text-center border-t border-white/5 pt-6">
              <span className="text-secondary text-sm">{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
              <button
                className="modal-toggle-btn ml-2 text-accent font-bold hover:underline"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setFormData({ name: '', email: '', password: '', isRecruiter: false, githubHandle: '', linkedinProfile: '' });
                }}
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