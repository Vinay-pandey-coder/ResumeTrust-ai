import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaData = ({ title, description }) => {
  const metaTitle = title ? `${title} | ResumeTrust AI` : 'ResumeTrust AI | AI Resume Verification';
  const metaDescription = description || 'AI-powered ATS scoring and GitHub authenticity verification for your resume.';

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
    </Helmet>
  );
};

export default MetaData;
