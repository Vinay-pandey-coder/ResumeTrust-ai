import React from 'react';
import { Helmet } from 'react-helmet-async';

import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaData = ({ title, description, image, url }) => {
  const metaTitle = title ? `${title} | ResumeTrust AI` : 'ResumeTrust AI | AI Resume Verification';
  const metaDescription = description || 'AI-powered ATS scoring and GitHub authenticity verification for your resume.';
  const metaImage = image || 'https://resume-trust-ai-wccy.vercel.app/og-image.jpg'; // Ek default image ka link
  const metaUrl = url || 'https://resume-trust-ai-wccy.vercel.app/';

  return (
    <Helmet>
      {/* Standard Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default MetaData;
