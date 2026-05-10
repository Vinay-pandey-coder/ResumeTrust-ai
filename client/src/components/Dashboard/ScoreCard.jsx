import React, { useEffect, useState } from 'react';
import { getScoreColor } from '../../utils/helpers';

const ScoreCard = ({ label, score, description }) => {
  const [offset, setOffset] = useState(283); // 2 * PI * 45 (radius)
  const color = getScoreColor(score);
  
  useEffect(() => {
    // Animation timeout to ensure transition is visible
    const timer = setTimeout(() => {
      const progress = score / 100;
      const dashoffset = 283 * (1 - progress);
      setOffset(dashoffset);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="card score-card stat-card-premium flex-center flex-col relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="score-ring-container relative">
        <svg className="score-ring drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" width="120" height="120">
          <circle
            className="score-ring-bg"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="10"
            fill="transparent"
            r="45"
            cx="60"
            cy="60"
          />
          <circle
            className="score-ring-fill"
            stroke={color}
            strokeWidth="10"
            strokeDasharray="283" // 2 * PI * 45
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r="45"
            cx="60"
            cy="60"
            style={{ 
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 12px ${color}80)`
            }}
          />
        </svg>
        <div className="score-number absolute inset-0 flex items-center justify-center" style={{ color: '#fff', fontSize: '1.75rem', fontWeight: '800' }}>
          {score}<span className="text-sm opacity-50 ml-0.5">%</span>
        </div>
      </div>
      <div className="score-info text-center mt-6">
        <h3 className="score-label text-white uppercase tracking-widest text-xs font-bold mb-2">{label}</h3>
        <p className="score-description text-secondary text-xs leading-relaxed px-4">{description}</p>
      </div>
    </div>
  );
};

export default ScoreCard;
