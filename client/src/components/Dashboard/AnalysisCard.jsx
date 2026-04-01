import React, { useState } from 'react';
import { formatDate, getScoreBadgeClass } from '../../utils/helpers';

const AnalysisCard = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className={`card analysis-card ${isExpanded ? 'active' : ''}`} onClick={toggleExpand}>
      <div className="analysis-card-header flex-between">
        <div className="analysis-info">
          <h3 className="github-user">@{analysis.githubUsername}</h3>
          <p className="analysis-date">{formatDate(analysis.createdAt)}</p>
        </div>
        
        <div className="analysis-badges flex">
          <div className="badge-group flex-center flex-col">
            <span className="badge-label">ATS</span>
            <span className={`badge ${getScoreBadgeClass(analysis.atsScore)}`}>
              {analysis.atsScore}%
            </span>
          </div>
          <div className="badge-group flex-center flex-col ml-4">
            <span className="badge-label">Trust</span>
            <span className={`badge ${getScoreBadgeClass(analysis.trustScore)}`}>
              {analysis.trustScore}%
            </span>
          </div>
        </div>
      </div>

      <div className="analysis-summary mt-4">
        <p className="text-secondary">{analysis.summary}</p>
      </div>

      {isExpanded && (
        <div className="analysis-details mt-6 fade-in">
          <div className="detail-section">
            <h4 className="detail-title text-accent">Recommendations</h4>
            <ul className="detail-list">
              {analysis.recommendations.map((item, idx) => (
                <li key={idx} className="recommendation-item">{item}</li>
              ))}
            </ul>
          </div>

          <div className="detail-section mt-4">
            <h4 className="detail-title text-danger">Red Flags</h4>
            <ul className="detail-list">
              {analysis.redFlags.length > 0 ? (
                analysis.redFlags.map((item, idx) => (
                  <li key={idx} className="redflag-item">{item}</li>
                ))
              ) : (
                <li className="no-flags">None detected — Good job!</li>
              )}
            </ul>
          </div>

          <div className="detail-skills grid-2 mt-4">
            <div className="skills-matched">
              <h4 className="detail-title text-success">Skills Matched</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.skillsMatched.map((skill, idx) => (
                  <span key={idx} className="badge badge-success">{skill}</span>
                ))}
              </div>
            </div>
            <div className="skills-missing">
              <h4 className="detail-title text-warning">Missing Skills</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill, idx) => (
                  <span key={idx} className="badge badge-warning">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="expand-hint text-center mt-2">
        <span className="hint-text">{isExpanded ? 'Click to collapse' : 'Click to see full analysis'}</span>
      </div>
    </div>
  );
};

export default AnalysisCard;
