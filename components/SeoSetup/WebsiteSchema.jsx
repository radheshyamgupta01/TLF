// components/schemas/WebsiteSchema.js
import React from "react";

const WebsiteSchema = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "cpmarket",
    alternateName: ["cpmarket.in", "Prop Finder"],
    url: "https://cpmarket.in",
    description:
      "India's trusted real estate platform for buying, selling, and renting properties",
    inLanguage: "en-IN",
    author: {
      "@type": "Organization",
      name: "cpmarket",
      url: "https://cpmarket.in",
    },
    creator: {
      "@type": "Person",
      name: "Shubham S Nimje",
      url: "https://nimje.org/shubham-s-nimje",
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://cpmarket.in/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    ],
    sameAs: [
      "https://www.threads.com/@cpmarket.in",
      "https://x.com/MarketCp80282",
      "https://www.instagram.com/cpmarket.in",
      "https://www.linkedin.com/in/cp-market-00b809356",
      "https://www.youtube.com/channel/cpmarket",
      "https://www.facebook.com/people/Cpmarket/61573889295847/",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default WebsiteSchema;
