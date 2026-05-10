import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, deleteAccount } from '../services/api';
import MetaData from '../components/SEO/MetaData';
import toast from 'react-hot-toast';

const Profile = ({ user, logout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    linkedinProfile: user?.linkedinProfile || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [deletePassword, setDeletePassword] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const updateData = { name: formData.name };
      if (user?.isRecruiter) updateData.linkedinProfile = formData.linkedinProfile;
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      const res = await updateProfile(updateData);
      if (res.success) {
        localStorage.setItem('user', JSON.stringify(res.user));
        toast.success('Profile updated successfully!');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password to confirm');
      return;
    }
    setDeleteLoading(true);
    try {
      const res = await deleteAccount({ password: deletePassword });
      if (res.success) {
        toast.success('Account deleted successfully');
        logout();
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const tabs = [
    { key: 'info', label: 'Profile Info' },
    { key: 'security', label: 'Security' },
    { key: 'danger', label: '⚠️ Danger Zone' },
  ];

  return (
    <div className="page-container container fade-in mb-20">
      <MetaData title="My Profile" description="Manage your ResumeTrust AI profile" />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 0' }}>

        {/* Profile Header */}
        <div className="card mb-8" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: '800', color: '#fff',
            flexShrink: 0
          }}>
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.4rem', marginBottom: '0.25rem' }}>
              {user?.name}
            </h2>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {user?.email}
            </p>
            <span style={{
              fontSize: '0.75rem', fontWeight: '600',
              padding: '3px 12px', borderRadius: '20px',
              background: user?.isRecruiter ? 'rgba(139,92,246,0.15)' : 'rgba(99,102,241,0.15)',
              color: user?.isRecruiter ? '#a78bfa' : 'var(--accent)',
              border: `1px solid ${user?.isRecruiter ? 'rgba(139,92,246,0.3)' : 'rgba(99,102,241,0.3)'}`,
            }}>
              {user?.isRecruiter ? '🏢 Recruiter' : '👨‍💻 Candidate'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Profile Info */}
        {activeTab === 'info' && (
          <form onSubmit={handleUpdateProfile}>
            <div className="card mb-6" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="form-input"
                  style={{ opacity: 0.5, cursor: 'not-allowed' }}
                />
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Email cannot be changed</p>
              </div>

              {!user?.isRecruiter && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    GitHub Handle
                  </label>
                  <input
                    type="text"
                    value={user?.githubHandle || ''}
                    readOnly
                    className="form-input"
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  />
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>GitHub handle is locked for security</p>
                </div>
              )}

              {user?.isRecruiter && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              )}

              {user?.isRecruiter && user?.designation && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Designation
                  </label>
                  <input
                    type="text"
                    value={user?.designation || ''}
                    readOnly
                    className="form-input"
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.875rem', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Tab: Security */}
        {activeTab === 'security' && (
          <form onSubmit={handleUpdateProfile}>
            <div className="card mb-6" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Change Password
              </h3>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.875rem', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {/* Tab: Danger Zone */}
        {activeTab === 'danger' && (
          <div>
            <div className="card" style={{
              padding: '1.5rem',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <h3 style={{ color: '#f87171', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                Delete Account
              </h3>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                This will permanently delete your account and all associated analysis history. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171',
                  fontWeight: '700',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}
              >
                Delete My Account
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {showDeleteModal && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}>
            <div className="card" style={{
              padding: '2rem', maxWidth: '440px', width: '100%',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <h3 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                Confirm Account Deletion
              </h3>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Enter your password to permanently delete your account and all data.
              </p>

              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input mb-4"
                style={{ marginBottom: '1rem', borderColor: 'rgba(239,68,68,0.3)' }}
              />

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}
                  className="btn"
                  style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  style={{
                    flex: 1, padding: '0.75rem',
                    background: '#dc2626', color: '#fff',
                    border: 'none', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', fontWeight: '700',
                    opacity: deleteLoading ? 0.6 : 1,
                    fontSize: '0.875rem',
                  }}
                >
                  {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;