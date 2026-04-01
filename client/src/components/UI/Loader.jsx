import React from 'react';

const Loader = ({ fullScreen = false }) => {
  return (
    <div className={`loader-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
