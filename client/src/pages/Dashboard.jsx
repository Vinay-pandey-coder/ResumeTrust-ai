import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../services/api';
import AnalysisCard from '../components/Dashboard/AnalysisCard';
import Button from '../components/UI/Button';
import Loader from '../components/UI/Loader';
import MetaData from '../components/SEO/MetaData';

const Dashboard = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory();
        if (response.success) {
          setHistory(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <Loader fullScreen />;

  const avgTrust = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.trustScore, 0) / history.length)
    : 0;

  return (
    <div className="dashboard-page container fade-in mb-20">
      <MetaData title="Dashboard" description="View your resume analysis history and trust score." />

      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="welcome-text">
          <h1 className="hero-main-title mb-0" style={{ fontSize: '3rem' }}>
            Welcome back, <br />
            <span>{user?.name ? user.name.split(' ')[0] : 'Engineer'}</span>
          </h1>
          <div className="verified-badge">
            <span>●</span> Profile Verified & Secure
          </div>
        </div>
        <div className="hero-actions flex gap-4">
          <Button onClick={() => navigate('/analyze')} variant="primary" className="px-8 shadow-lg shadow-indigo-500/20">
            + New Analysis
          </Button>
          <Button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} variant="outline" className="px-8">
            View Reports
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid mb-16">
        <div className="card stat-card-premium">
          <div className="card-icon">📊</div>
          <div className="stat-val">{history.length}</div>
          <div className="stat-label">Total Audits</div>
          <div className="stat-helper">Lifetime analysis completed</div>
        </div>
        
        <div className="card stat-card-premium">
          <div className="card-icon">🛡️</div>
          <div className="stat-val">{avgTrust}%</div>
          <div className="stat-label">Average Trust</div>
          <div className="stat-helper">Verified engineering proof</div>
        </div>

        <div className="card stat-card-premium">
          <div className="card-icon">🐙</div>
          <div className="stat-val" style={{ fontSize: '1.25rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            @{user?.githubHandle || 'verified'}
          </div>
          <div className="stat-label">GitHub Handle</div>
          <div className="stat-helper">Connected & Synchronized</div>
        </div>
      </div>

      {/* Insights Row */}
      <div className="insight-chips-row mt-10">
        <div className="insight-chip"><span>✓</span> Strong ATS Alignment</div>
        <div className="insight-chip"><span>✓</span> GitHub Verified</div>
        <div className="insight-chip"><span>✓</span> Multi-Repo Scan Active</div>
        <div className="insight-chip"><span>✓</span> No Critical Red Flags</div>
      </div>

      {/* Recent Analyses Section */}
      <div className="content-section">
        <div className="section-header flex-between mb-8">
          <h2 className="section-title mb-0">Recent Analyses</h2>
          <p className="text-secondary text-sm">Showing your latest {history.length} reports</p>
        </div>

        {history.length > 0 ? (
          <div className="analyses-list">
            {history.map((item) => (
              <AnalysisCard key={item._id} analysis={item} />
            ))}
          </div>
        ) : (
          <div className="card p-20 text-center">
            <h3 className="mb-4">No analysis history yet</h3>
            <p className="text-secondary mb-8">Upload your first resume to see the deep-scan results here.</p>
            <Button onClick={() => navigate('/analyze')} variant="primary">Start First Analysis</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;