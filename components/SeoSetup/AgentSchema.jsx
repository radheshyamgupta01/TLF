// components/schemas/AgentSchema.js
import React from "react";

const AgentSchema = ({ agent }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `https://cpmarket.in/agents/${agent.id}`,
    name: agent.name,
    description:
      agent.bio ||
      `Professional real estate agent with ${
        agent.experience || "extensive"
      } experience`,
    url: `https://cpmarket.in/agents/${agent.id}`,
    image: agent.photo,
    telephone: agent.phone,
    email: agent.email,
    jobTitle: agent.title || "Real Estate Agent",
    worksFor: {
      "@type": "Organization",
      name: agent.agency || "cpmarket",
      url: "https://cpmarket.in",
    },
    address: agent.address
      ? {
          "@type": "PostalAddress",
          addressLocality: agent.address.city,
          addressRegion: agent.address.state,
          addressCountry: "IN",
        }
      : undefined,
    areaServed: agent.serviceAreas?.map((area) => ({
      "@type": "City",
      name: area,
    })) || [
      {
        "@type": "Country",
        name: "India",
      },
    ],
    knowsAbout: [
      "Real Estate",
      "Property Sales",
      "Property Rental",
      "Property Investment",
      "Market Analysis",
    ],
    hasCredential:
      agent.certifications?.map((cert) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: cert,
      })) || [],
    yearOfExperience: agent.experienceYears,
    aggregateRating: agent.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: agent.rating.average,
          reviewCount: agent.rating.count,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    review:
      agent.reviews?.map((review) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.authorName,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
        },
        reviewBody: review.comment,
        datePublished: review.date,
      })) || [],
    sameAs:
      agent.socialMedia?.filter((link) => link.url).map((link) => link.url) ||
      [],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: agent.phone,
        contactType: "sales",
        availableLanguage: agent.languages || ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        email: agent.email,
        contactType: "customer service",
      },
    ],
    specialization: agent.specializations || [
      "Residential Properties",
      "Commercial Properties",
      "Property Investment",
    ],
    potentialAction: [
      {
        "@type": "ContactAction",
        target: `https://cpmarket.in/contact-agent/${agent.id}`,
      },
      {
        "@type": "ViewAction",
        target: `https://cpmarket.in/agents/${agent.id}/properties`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default AgentSchema;
