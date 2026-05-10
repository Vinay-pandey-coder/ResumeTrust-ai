import React, { useState, useEffect } from "react";

import { analyzeResume } from "../services/api";
import ScoreCard from "../components/Dashboard/ScoreCard";
import Button from "../components/UI/Button";
import Loader from "../components/UI/Loader";
import MetaData from "../components/SEO/MetaData";
import toast from "react-hot-toast";

const Analyze = () => {
  const [file, setFile] = useState(null);
  const [githubUsername, setGithubUsername] = useState("");
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && !user.isRecruiter) {
      setGithubUsername(user.githubHandle || "");
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a PDF file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !githubUsername) {
      toast.error("Please fill required fields (PDF & GitHub).");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("githubUsername", githubUsername);
    if (jdText) formData.append("jdText", jdText);

    try {
      const res = await analyzeResume(formData);
      if (res && (res.success || res.atsScore !== undefined)) {
        const finalResult = res.data ? res.data : res;
        setResult(finalResult);
        toast.success("Analysis complete!");
        window.scrollTo(0, 0);
      } else {
        toast.error(res?.message || "Analysis failed. Please try again.");
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      toast.error(error.response?.data?.message || "Server Error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setFile(null);
    const user = JSON.parse(localStorage.getItem("user"));
    setGithubUsername(user && !user.isRecruiter ? user.githubHandle || "" : "");
    setJdText("");
  };

  if (loading) return <Loader fullScreen msg="Analyzing Your Resume..." />;

  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user && !user.isRecruiter;

  return (
    <div className="analyze-page container mb-20">
      <MetaData title={result ? "Analysis Results" : "Resume Analysis"} />

      {!result ? (
        <div className="fade-in">
          <div className="text-center py-10">
            <h1 className="hero-main-title mb-4">Resume <span>Analysis</span></h1>
            <p className="text-secondary max-w-600 mx-auto">
              Upload your PDF and provide your GitHub handle for a deep AI verification.
            </p>
          </div>

          <div className="analyze-grid">
            <div className="card report-card-premium">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="input-label mb-2 block text-xs font-black uppercase tracking-widest text-muted">Step 1: Upload PDF Resume</label>
                  <div className="upload-zone-premium py-8" onClick={() => document.getElementById('resume-file').click()}>
                    <input id="resume-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                    <div className="upload-icon-wrap" style={{ fontSize: '2rem' }}>📂</div>
                    {file ? <div className="file-pill bg-success text-xs">{file.name}</div> : <p className="text-muted text-[0.7rem]">Click to upload PDF</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="input-label mb-2 block text-xs font-black uppercase tracking-widest text-muted">Step 2: GitHub Username *</label>
                  <input
                    type="text"
                    placeholder="eg. Vinay-pandey-coder"
                    className={`form-input py-3 text-sm ${isEmployee ? "opacity-60" : ""}`}
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    required
                    disabled={isEmployee}
                  />
                </div>

                <div className="mb-8">
                  <label className="input-label mb-2 block text-xs font-black uppercase tracking-widest text-muted">Step 3: Job Description (Optional)</label>
                  <textarea
                    placeholder="Paste the job description for better matching..."
                    className="form-input textarea min-h-[90px] text-sm py-3"
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                  ></textarea>
                </div>
                <Button type="submit" fullWidth className="py-4 shadow-xl">Analyze Resume Now</Button>
              </form>
            </div>

            <div className="info-panel-premium">
              <h3 className="text-white uppercase tracking-widest text-xs font-black mb-6">Audit Pipeline</h3>
              <div className="space-y-4">
                <div className="highlight-item-tick"><span>✔</span> ATS Consistency</div>
                <div className="highlight-item-tick"><span>✔</span> GitHub Live Audit</div>
                <div className="highlight-item-tick"><span>✔</span> Fraud Detection</div>
                <div className="highlight-item-tick text-accent mt-4 text-[0.65rem]">Verified Engineering Proof Active</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="analysis-result fade-in pb-20">
          {/* Header Row */}
          <div className="result-header flex-between mb-8 pb-4 mt-6">
            <h1 className="hero-main-title mb-0" style={{ fontSize: '2rem' }}>Analysis <span>Results</span></h1>
            <Button variant="outline" className="text-xs px-8 py-2" onClick={resetForm}>New Analysis</Button>
          </div>

          {/* MOST IMPORTANT: Scores Side-by-Side */}
          <div className="grid-compact mb-8">
            <ScoreCard
              label="ATS Score"
              score={result.atsScore || 0}
              description="Formatting Alignment"
            />
            <ScoreCard
              label="Trust Score"
              score={result.trustScore || 0}
              description="GitHub Authenticity"
            />
          </div>

          {/* Smart Split: Summary & Highlights */}
          <div className="grid-compact mb-8">
            <div className="report-card-premium">
              <h3 className="text-accent uppercase tracking-widest text-[0.6rem] font-black mb-4">Analysis Summary</h3>
              <p className="text-secondary text-sm leading-relaxed mb-4">
                {result.analysisSummary || result.details?.analysisSummary || "Audit results generated based on cross-referenced engineering proof."}
              </p>
              <div className="status-line"></div>
              <p className="text-xs font-bold mt-3 text-white">Status: <span className="text-accent">{result.trustScore >= 85 ? 'Exceptional' : result.trustScore >= 70 ? 'Strong' : 'Moderate'}</span></p>
            </div>

            <div className="report-card-premium border-l-4 border-success">
              <h3 className="text-success uppercase tracking-widest text-[0.6rem] font-black mb-5">Quick Highlights</h3>
              <div className="space-y-3">
                <div className="highlight-item-tick">✔ GitHub Verified Link</div>
                <div className="highlight-item-tick">✔ Strong Fullstack Context</div>
                <div className="highlight-item-tick">✔ No major red flags</div>
                <div className="highlight-item-tick text-secondary opacity-50">✔ Projects match CV claims</div>
              </div>
            </div>
          </div>

          {/* Skills Split */}
          <div className="grid-compact mb-10">
            <div className="report-card-premium">
              <h3 className="text-success uppercase tracking-widest text-[0.6rem] font-black mb-4">Skills Matched</h3>
              <div className="flex flex-wrap gap-2">
                {(result.skillsMatched || result.details?.skillsMatched || []).map((skill, i) => (
                  <span key={i} className="tech-badge-premium text-[0.65rem] px-3 py-1">{skill}</span>
                ))}
              </div>
            </div>
            <div className="report-card-premium bg-black/10">
              <h3 className="text-warning uppercase tracking-widest text-[0.6rem] font-black mb-4">Missing Signals</h3>
              <div className="flex flex-wrap gap-2">
                {(result.missingSkills || result.details?.missingSkills || []).length > 0 ? (
                  (result.missingSkills || result.details?.missingSkills).map((skill, i) => (
                    <span key={i} className="tech-badge-premium opacity-50 text-[0.65rem] px-3 py-1">{skill}</span>
                  ))
                ) : (
                  <p className="text-success text-[0.7rem] font-bold">✨ No critical gaps detected.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="mt-12">
            <h3 className="text-accent uppercase tracking-widest text-[0.6rem] font-black mb-6">Strategic Recommendations</h3>
            <div className="recommendation-grid-p">
              {(result.recommendations || result.details?.recommendations || []).map((rec, i) => (
                <div key={i} className="report-card-premium hover:border-accent transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-accent text-white text-[0.55rem] font-black w-5 h-5 flex-center rounded-full">{i + 1}</span>
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest">Suggestion</h4>
                  </div>
                  <p className="text-secondary text-[0.75rem] leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze;
