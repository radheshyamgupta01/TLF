// components/schemas/BreadcrumbSchema.js
import React from "react";

const BreadcrumbSchema = ({ breadcrumbs }) => {
  // Default breadcrumbs for home page if none provided
  const defaultBreadcrumbs = [
    {
      name: "Home",
      url: "https://cpmarket.in",
    },
  ];

  const items = breadcrumbs || defaultBreadcrumbs;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default BreadcrumbSchema;
