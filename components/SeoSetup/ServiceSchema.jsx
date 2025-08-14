// components/schemas/ServiceSchema.js
import React from "react";

const ServiceSchema = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://cpmarket.in/#service",
    name: "Real Estate Services",
    description:
      "Comprehensive real estate services including property buying, selling, renting, and investment consultation",
    provider: {
      "@type": "Organization",
      name: "cpmarket",
      url: "https://cpmarket.in",
    },
    serviceType: "Real Estate",
    audience: {
      "@type": "Audience",
      audienceType: "Property Buyers, Sellers, Renters, Investors",
      geographicArea: {
        "@type": "Country",
        name: "India",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "cpmarket Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Property Search",
            description:
              "Help clients find suitable properties based on their requirements",
            category: "Real Estate",
          },
          priceSpecification: {
            "@type": "PriceSpecification",
            price: "0",
            priceCurrency: "INR",
            description: "Free service for buyers",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Property Listing",
            description: "List and market properties for sale or rent",
            category: "Real Estate Marketing",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Property Valuation",
            description: "Professional property valuation services",
            category: "Real Estate Appraisal",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Investment Consultation",
            description:
              "Expert advice on real estate investment opportunities",
            category: "Real Estate Consulting",
          },
        },
      ],
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    availableChannel: [
      {
        "@type": "ServiceChannel",
        serviceUrl: "https://cpmarket.in",
        serviceSmsNumber: "+91-9876543210",
        servicePhone: "+91-9876543210",
      },
    ],
    hoursAvailable: [
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ServiceSchema;
