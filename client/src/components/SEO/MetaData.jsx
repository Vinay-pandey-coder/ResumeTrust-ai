import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaData = ({ title, description, image, url }) => {
  const metaTitle = title ? `${title} | ResumeTrust AI` : 'ResumeTrust AI | AI Resume Verification';
  // Isko thoda detail mein kar do
  const metaDescription = description || 'ResumeTrust AI: Revolutionizing technical hiring with AI-powered ATS auditing and real-time GitHub verification. Build proof of your skills and get your trust score today!';
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
