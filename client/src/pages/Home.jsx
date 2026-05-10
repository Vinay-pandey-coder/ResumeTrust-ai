import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import MetaData from '../components/SEO/MetaData';
import { loginUser, registerUser, forgotPassword, verifyOtp, resetPassword } from '../services/api'; // [NEW]

const Home = ({ isLoggedIn, login, openLogin, openRegister }) => {
  const [showModal, setShowModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // [NEW] Forgot Password States
  const [forgotStep, setForgotStep] = useState(0); // 0=login, 1=email, 2=otp, 3=newpass
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isRecruiter: false,
    githubHandle: '',
    linkedinProfile: ''
  });

  // ✅ Backend URL for GitHub Auth (Port 5000 and live URL both handled via env variable)
  const GITHUB_AUTH_URL = `${import.meta.env.VITE_API_URL}/auth/github`;

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

  // [NEW] OTP Timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

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
    window.location.href = GITHUB_AUTH_URL;
  };

  const openModal = (registerMode = false) => {
    setIsRegister(registerMode);
    setFormData({ name: '', email: '', password: '', isRecruiter: false, githubHandle: '', linkedinProfile: '' });
    setForgotStep(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForgotStep(0);
    setForgotEmail('');
    setOtpValue('');
    setNewPassword('');
    setConfirmNewPassword('');
    navigate('/');
  };

  // [NEW] Forgot Password handlers
  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.error('Please enter your email');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await forgotPassword({ email: forgotEmail });
      if (res.success) {
        toast.success('OTP sent to your email!');
        setForgotStep(2);
        setOtpTimer(300); // 5 min timer
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.length !== 6) {
      toast.error('Please enter valid 6-digit OTP');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await verifyOtp({ email: forgotEmail, otp: otpValue });
      if (res.success) {
        toast.success('OTP verified!');
        setForgotStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await resetPassword({ email: forgotEmail, otp: otpValue, newPassword });
      if (res.success) {
        toast.success('Password reset successful! Please login.');
        setForgotStep(0);
        setForgotEmail('');
        setOtpValue('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally {
      setForgotLoading(false);
    }
  };

  // [NEW] Format timer
  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
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

      {/* Auth Modal */}
      {showModal && (
        <div className="modal-overlay auth-wrapper" onClick={closeModal}>
          <div className="auth-glow-bg"></div>
          <div className="modal-content auth-card-premium p-10 rounded-3xl relative" onClick={e => e.stopPropagation()}>

            {/* [NEW] Forgot Password Flow */}
            {forgotStep > 0 ? (
              <div>
                {/* Step 1 — Email */}
                {forgotStep === 1 && (
                  <div>
                    <div className="text-center mb-8">
                      <h2 className="modal-title font-bold text-3xl mb-3 text-white">Forgot Password</h2>
                      <p className="text-secondary text-sm">Enter your registered email to receive an OTP</p>
                    </div>
                    <Input
                      label="Email Address"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="john@example.com"
                    />
                    <Button
                      fullWidth
                      loading={forgotLoading}
                      onClick={handleForgotPassword}
                      className="py-4 mt-6"
                    >
                      Send OTP
                    </Button>
                    <div className="modal-footer mt-6 text-center border-t border-white/5 pt-6">
                      <button
                        className="modal-toggle-btn text-accent font-bold hover:underline"
                        onClick={() => setForgotStep(0)}
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2 — OTP */}
                {forgotStep === 2 && (
                  <div>
                    <div className="text-center mb-8">
                      <h2 className="modal-title font-bold text-3xl mb-3 text-white">Enter OTP</h2>
                      <p className="text-secondary text-sm">OTP sent to <strong style={{ color: 'var(--accent)' }}>{forgotEmail}</strong></p>
                    </div>

                    {/* Timer */}
                    <div className="text-center mb-6">
                      <span style={{
                        fontSize: '2rem', fontWeight: '800',
                        color: otpTimer > 60 ? 'var(--accent)' : '#ef4444',
                        letterSpacing: '4px'
                      }}>
                        {formatTimer(otpTimer)}
                      </span>
                      <p className="text-secondary text-xs mt-1">Time remaining</p>
                    </div>

                    <Input
                      label="6-Digit OTP"
                      type="text"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                    />

                    <Button
                      fullWidth
                      loading={forgotLoading}
                      onClick={handleVerifyOtp}
                      className="py-4 mt-6"
                      disabled={otpTimer === 0}
                    >
                      Verify OTP
                    </Button>

                    {otpTimer === 0 && (
                      <p className="text-center text-xs mt-3" style={{ color: '#ef4444' }}>
                        OTP expired.{' '}
                        <button
                          className="text-accent font-bold hover:underline"
                          onClick={() => { setForgotStep(1); setOtpValue(''); }}
                        >
                          Resend OTP
                        </button>
                      </p>
                    )}

                    <div className="modal-footer mt-6 text-center border-t border-white/5 pt-6">
                      <button
                        className="modal-toggle-btn text-accent font-bold hover:underline"
                        onClick={() => setForgotStep(1)}
                      >
                        ← Change Email
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 — New Password */}
                {forgotStep === 3 && (
                  <div>
                    <div className="text-center mb-8">
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
                      <h2 className="modal-title font-bold text-3xl mb-3 text-white">New Password</h2>
                      <p className="text-secondary text-sm">Set your new password below</p>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                      />
                      <Input
                        label="Confirm Password"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>

                    <Button
                      fullWidth
                      loading={forgotLoading}
                      onClick={handleResetPassword}
                      className="py-4 mt-6"
                    >
                      Reset Password
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Normal Login / Register Flow */
              <>
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

                {/* Pipeline Mini */}
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

                {/* Recruiter Toggle */}
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

                    {/* [NEW] Forgot Password Link — sirf login mein dikhega */}
                    {!isRegister && (
                      <div className="text-right">
                        <button
                          type="button"
                          className="text-accent text-xs font-semibold hover:underline"
                          onClick={() => setForgotStep(1)}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    <Button type="submit" fullWidth loading={loading} className="py-4 mt-6 shadow-indigo-500/10">
                      {isRegister ? 'Create Account' : 'Sign In'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {formData.githubHandle ? (
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
                      <div className="space-y-4">
                        <Button
                          onClick={handleGitHubLogin}
                          fullWidth
                          className="github-btn-premium flex items-center justify-center gap-3 py-4"
                        >
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                          Continue with GitHub &rarr;
                        </Button>
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
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;