// components/schemas/LocalBusinessSchema.js
import React from "react";

const LocalBusinessSchema = ({ location }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://cpmarket.in/#localbusiness",
    name: "cpmarket",
    image: "https://cpmarket.in/logo.png",
    telephone: "+91-9876543210",
    email: "contact@cpmarket.in",
    url: "https://cpmarket.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: location?.street || "123 Business Street",
      addressLocality: location?.city || "Mumbai",
      addressRegion: location?.state || "Maharashtra",
      postalCode: location?.pincode || "400001",
      addressCountry: "IN",
    },
    geo: location?.coordinates
      ? {
          "@type": "GeoCoordinates",
          latitude: location.coordinates.lat,
          longitude: location.coordinates.lng,
        }
      : {
          "@type": "GeoCoordinates",
          latitude: 19.076,
          longitude: 72.8777,
        },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "16:00",
      },
    ],
    priceRange: "$$",
    servesCuisine: "Real Estate Services",
    areaServed: [
      {
        "@type": "Country",
        name: "India",
      },
      {
        "@type": "State",
        name: "Maharashtra",
      },
      {
        "@type": "City",
        name: "Mumbai",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Real Estate Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Property Buying",
            description: "Help clients find and purchase properties",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Property Selling",
            description: "Assist property owners in selling their properties",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Property Rental",
            description: "Connect tenants with rental properties",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Satisfied Customer",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Excellent service and professional agents. Found my dream home quickly!",
        datePublished: "2024-01-15",
      },
    ],
    sameAs: [
      "https://www.facebook.com/people/Cpmarket/61573889295847/",
      "https://www.threads.com/@cpmarket.in",
      "https://x.com/MarketCp80282",
      "https://www.instagram.com/cpmarket.in",
      "https://www.linkedin.com/in/cp-market-00b809356",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default LocalBusinessSchema;
