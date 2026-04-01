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

  return (
    <div className="dashboard-page page-container fade-in">
      <MetaData title="Dashboard" description="View your resume analysis history and trust score." />
      
      <div className="dashboard-header flex-between mb-10">
        <div className="user-welcome">
          <h1 className="hero-title mb-0">Welcome back, <span>{user?.name.split(' ')[0]}</span></h1>
          <p className="text-secondary">{user?.email}</p>
        </div>
        <Button onClick={() => navigate('/analyze')} variant="primary">
          New Analysis
        </Button>
      </div>

      <div className="stats-row grid-3 mb-10">
        <div className="card stat-card">
          <span className="stat-label">Total Analyses</span>
          <h2 className="stat-value">{history.length}</h2>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Average Trust Score</span>
          <h2 className="stat-value">
            {history.length > 0 
              ? Math.round(history.reduce((acc, curr) => acc + curr.trustScore, 0) / history.length) 
              : 0}%
          </h2>
        </div>
        <div className="card stat-card">
          <span className="stat-label">GitHub Handle</span>
          <h2 className="stat-value text-accent">@{user?.githubHandle || 'linked'}</h2>
        </div>
      </div>

      <div className="history-section">
        <h2 className="section-title mb-6">Recent Analyses</h2>
        
        {history.length > 0 ? (
          <div className="history-list">
            {history.map((item) => (
              <AnalysisCard key={item._id} analysis={item} />
            ))}
          </div>
        ) : (
          <div className="card empty-state text-center py-10">
            <div className="empty-icon text-muted mb-4">📭</div>
            <h3>No analyses yet</h3>
            <p className="text-secondary mb-6">Upload your first resume to see how it scores!</p>
            <Button variant="outline" onClick={() => navigate('/analyze')}>
              Start First Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
