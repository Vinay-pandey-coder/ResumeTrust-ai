import React, { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import Button from '../UI/Button';

const AnalysisCard = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className={`premium-analysis-row ${isExpanded ? 'active expanded' : ''}`}>
      {/* Summary Row */}
      <div className="flex justify-between items-start md:flex-row flex-col gap-6">
        <div className="analysis-main-info">
          <h3 className="font-bold text-white">Analysis for @{analysis.githubUsername}</h3>
          <p className="text-muted">{formatDate(analysis.createdAt)} • Professional Audit</p>

          <div className="summary-preview">
            {analysis.summary}
          </div>

          <div className="card-actions flex gap-4 mt-2">
            <Button
              variant={isExpanded ? "outline" : "primary"}
              onClick={toggleExpand}
              className="text-xs py-2 px-8"
            >
              {isExpanded ? 'Hide Details' : 'View Full Report'}
            </Button>
            {!isExpanded && (
              <Button variant="outline" className="text-xs py-2 px-6 opacity-60">
                Download PDF
              </Button>
            )}
          </div>
        </div>

        <div className="analysis-scores flex gap-4">
          <div className="score-badge-p">
            <span className="s-label">ATS Score</span>
            <span className={`s-val ${analysis.atsScore >= 80 ? 'text-success' : 'text-accent'}`}>
              {analysis.atsScore}%
            </span>
          </div>
          <div className="score-badge-p">
            <span className="s-label">Trust Score</span>
            <span className={`s-val ${analysis.trustScore >= 70 ? 'text-success' : 'text-accent'}`}>
              {analysis.trustScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="analysis-details mt-10 p-8 border-t border-white/5 fade-in">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="detail-section">
              <h4 className="text-accent uppercase tracking-widest text-xs font-bold mb-4">Recommendations</h4>
              <ul className="space-y-3">
                {analysis.recommendations.map((item, idx) => (
                  <li key={idx} className="text-sm text-secondary flex gap-3">
                    <span className="text-accent">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h4 className="text-danger uppercase tracking-widest text-xs font-bold mb-4">Critical Flags</h4>
              <ul className="space-y-3">
                {analysis.redFlags.length > 0 ? (
                  analysis.redFlags.map((item, idx) => (
                    <li key={idx} className="text-sm text-secondary flex gap-3">
                      <span className="text-danger">●</span> {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-success font-medium">✨ No critical issues found in this audit.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="detail-skills-grid grid md:grid-cols-2 gap-10 mt-10 pt-10 border-t border-white/5">
            <div>
              <h4 className="text-success uppercase tracking-widest text-xs font-bold mb-4">Skills Verified</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.skillsMatched.map((skill, idx) => (
                  <span key={idx} className="tech-badge-premium text-xs" style={{ padding: '6px 12px' }}>{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-warning uppercase tracking-widest text-xs font-bold mb-4">Gaps Detected</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill, idx) => (
                  <span key={idx} className="tech-badge-premium text-xs opacity-50" style={{ padding: '6px 12px' }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisCard;
