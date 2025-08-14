import React from "react";

const HomePageSchema = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "cpmarket",
    description: "India's trusted real estate platform",
    url: "https://cpmarket.in",
    logo: "https://cpmarket.in/logo.png",
    sameAs: [
      "https://www.threads.com/@cpmarket.in",
      "https://x.com/MarketCp80282",
      "https://www.instagram.com/cpmarket.in",
      "https://www.linkedin.com/in/cp-market-00b809356",
      "https://www.facebook.com/people/Cpmarket/61573889295847/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9876543210",
      contactType: "Customer Service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default HomePageSchema;
