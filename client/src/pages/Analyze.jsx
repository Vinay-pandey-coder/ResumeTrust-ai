import React, { useState, useEffect } from 'react'; // [UPDATED]: useEffect added
import { toast } from 'react-hot-toast';
import { analyzeResume } from '../services/api';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Loader from '../components/UI/Loader';
import ScoreCard from '../components/Dashboard/ScoreCard';
import MetaData from '../components/SEO/MetaData';

const Analyze = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [githubUsername, setGithubUsername] = useState('');
  const [jdText, setJdText] = useState('');

  // [NEW LOGIC]: Auth data se user role aur handle nikalna
  useEffect(() => {
    const savedUser = localStorage.getItem('user'); // Ya jo bhi tumhara auth storage hai
    if (savedUser) {
      const user = JSON.parse(savedUser);
      // Agar employee hai toh handle lock kardo, recruiter hai toh khali chhodo
      if (!user.isRecruiter && user.githubHandle) {
        setGithubUsername(user.githubHandle);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('Please upload a valid PDF file');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please upload your resume');
    if (!githubUsername) return toast.error('Please enter your GitHub username');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('githubUsername', githubUsername);
    if (jdText) formData.append('jdText', jdText);

    setLoading(true);
    try {
      const data = await analyzeResume(formData);
      setResult(data);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setFile(null);
    // Reset karte waqt bhi check karna ki employee ka handle wapas aa jaye
    const user = JSON.parse(localStorage.getItem('user'));
    setGithubUsername(!user?.isRecruiter ? user?.githubHandle || '' : '');
    setJdText('');
  };

  if (loading) return <Loader fullScreen />;

  // User role check for 'disabled' property
  const user = JSON.parse(localStorage.getItem('user'));
  const isEmployee = user && !user.isRecruiter;

  return (
    <div className="analyze-page page-container">
      <MetaData title="Analyze Resume" description="Get your ATS and Trust score by uploading your resume." />

      {!result ? (
        <div className="analyze-form-container fade-in">
          <h1 className="section-title text-center">Resume Analysis</h1>
          <p className="text-secondary text-center mb-10">Upload your PDF and provide your GitHub handle for a deep AI verification.</p>

          <form onSubmit={handleAnalyze} className="analyze-form card">
            {/* Step 1: File Upload */}
            <div className="form-step">
              <label className="input-label">Step 1: Upload PDF Resume</label>
              <div className={`upload-area ${file ? 'has-file' : ''}`}>
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                <label htmlFor="resume-upload" className="upload-label">
                  {file ? (
                    <div className="file-info">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{file.name}</span>
                    </div>
                  ) : (
                    <div className="upload-hint">
                      <span className="upload-icon">📁</span>
                      <p>Click or drag PDF here</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Step 2: GitHub Username */}
            <div className="form-step mt-6">
              <Input
                label="Step 2: GitHub Username"
                placeholder="e.g. janesmith"
                name="githubUsername"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                required
                disabled={isEmployee} // [NEW]: Agar candidate hai toh box lock kardo
                className={isEmployee ? 'input-field-disabled' : ''}
              />
              {isEmployee && <small className="text-muted mt-1 block">Your registered handle is locked for security.</small>}
            </div>

            {/* Step 3: JD Text (Optional) */}
            <div className="form-step mt-2">
              <label className="input-label">Step 3: Job Description (Optional)</label>
              <textarea
                className="form-input textarea"
                placeholder="Paste the job description here for better matching..."
                rows="5"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              ></textarea>
            </div>

            <Button type="submit" fullWidth className="mt-8" disabled={!file || !githubUsername}>
              Analyze Now
            </Button>
          </form>
        </div>
      ) : (
        <div className="analysis-result fade-in">
          <div className="result-header flex-between mb-8">
            <h1 className="section-title mb-0">Analysis Results</h1>
            <Button variant="outline" onClick={resetForm}>New Analysis</Button>
          </div>

          <div className="grid-2">
            <ScoreCard
              label="ATS Score"
              score={result.atsScore}
              description="How well your resume is formatted for automated systems."
            />
            <ScoreCard
              label="Trust Score"
              score={result.trustScore}
              description="Authenticity level based on GitHub activity and resume claims."
            />
          </div>

          <div className="card mt-8">
            <h3 className="detail-title text-accent">Analysis Summary</h3>
            <p className="text-secondary mb-6">{result.details.analysisSummary}</p>

            <div className="grid-2">
              <div>
                <h4 className="detail-title text-success">Skills Matched</h4>
                <div className="flex flex-wrap gap-2">
                  {result.details.skillsMatched.map((skill, idx) => (
                    <span key={idx} className="badge badge-success">{skill}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="detail-title text-warning">Missing Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {result.details.missingSkills.map((skill, idx) => (
                    <span key={idx} className="badge badge-warning">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="detail-title text-accent">Recommendations</h4>
              <ul className="detail-list">
                {result.details.recommendations.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {result.details.redFlags.length > 0 && (
              <div className="mt-8">
                <h4 className="detail-title text-danger">Red Flags Detected</h4>
                <div className="red-flags-container">
                  {result.details.redFlags.map((flag, idx) => (
                    <div key={idx} className="flag-item card p-4 mb-2">
                      <span className="text-danger mr-2">⚠️</span> {flag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze; 