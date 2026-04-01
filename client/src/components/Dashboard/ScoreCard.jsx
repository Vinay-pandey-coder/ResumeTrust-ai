import React, { useEffect, useState } from 'react';
import { getScoreColor } from '../../utils/helpers';

const ScoreCard = ({ label, score, description }) => {
  const [offset, setOffset] = useState(251); // 2 * PI * 40 (radius)
  const color = getScoreColor(score);
  
  useEffect(() => {
    // Animation timeout to ensure transition is visible
    const timer = setTimeout(() => {
      const progress = score / 100;
      const dashoffset = 251 * (1 - progress);
      setOffset(dashoffset);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="card score-card flex-center flex-col">
      <div className="score-ring-container">
        <svg className="score-ring" width="100" height="100">
          <circle
            className="score-ring-bg"
            stroke="var(--bg-secondary)"
            strokeWidth="8"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          <circle
            className="score-ring-fill"
            stroke={color}
            strokeWidth="8"
            strokeDasharray="251"
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
        </svg>
        <div className="score-number" style={{ color }}>
          {score}
        </div>
      </div>
      <div className="score-info text-center mt-4">
        <h3 className="score-label">{label}</h3>
        <p className="score-description text-muted">{description}</p>
      </div>
    </div>
  );
};

export default ScoreCard;
