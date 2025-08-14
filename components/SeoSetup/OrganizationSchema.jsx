// components/schemas/OrganizationSchema.js
import React from "react";

const OrganizationSchema = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://cpmarket.in/#organization",
    name: "cpmarket",
    alternateName: "cpmarket India",
    description:
      "India's trusted real estate platform for buying, selling, and renting properties with verified listings and expert agents",
    url: "https://cpmarket.in",
    logo: {
      "@type": "ImageObject",
      url: "https://cpmarket.in/logo.png",
      width: 512,
      height: 512,
    },
    image: "https://cpmarket.in/og-image.png",
    founder: {
      "@type": "Person",
      name: "Shubham S Nimje",
      url: "https://nimje.org/shubham-s-nimje",
    },
    foundingDate: "2024",
    slogan: "Smart Property Solutions",
    knowsAbout: [
      "Real Estate",
      "Property Management",
      "Property Listing",
      "Real Estate Investment",
      "Property Rental",
      "Property Sales",
    ],
    sameAs: [
      "https://www.threads.com/@cpmarket.in",
      "https://x.com/MarketCp80282",
      "https://www.instagram.com/cpmarket.in",
      "https://www.linkedin.com/in/cp-market-00b809356",
      "https://www.youtube.com/channel/cpmarket",
      "https://www.facebook.com/people/Cpmarket/61573889295847/",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-9876543210",
        contactType: "Customer Service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "18:00",
        },
      },
      {
        "@type": "ContactPoint",
        email: "support@cpmarket.in",
        contactType: "Customer Support",
        areaServed: "IN",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "Maharashtra",
      addressLocality: "Mumbai",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    serviceArea: {
      "@type": "Country",
      name: "India",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default OrganizationSchema;
