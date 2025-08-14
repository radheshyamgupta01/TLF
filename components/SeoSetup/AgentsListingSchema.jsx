// components/schemas/AgentsListingSchema.js
import React from "react";

const AgentsListingSchema = ({ agents, page, totalCount, location }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://cpmarket.in/agents${page ? `?page=${page}` : ""}`,
    name: `Real Estate Agents${location ? ` in ${location}` : ""} - cpmarket`,
    description: `Connect with ${
      totalCount || "professional"
    } verified real estate agents${
      location ? ` in ${location}` : " across India"
    }. Find experienced agents for buying, selling, or renting properties.`,
    url: `https://cpmarket.in/agents${page ? `?page=${page}` : ""}`,
    isPartOf: {
      "@type": "WebSite",
      name: "cpmarket",
      url: "https://cpmarket.in",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://cpmarket.in",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Agents",
          item: "https://cpmarket.in/agents",
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: agents?.length || 0,
      itemListElement:
        agents?.map((agent, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "RealEstateAgent",
            "@id": `https://cpmarket.in/agents/${agent.id}`,
            name: agent.name,
            description: agent.bio || `Professional real estate agent`,
            url: `https://cpmarket.in/agents/${agent.id}`,
            image: agent.photo,
            telephone: agent.phone,
            email: agent.email,
            jobTitle: agent.title || "Real Estate Agent",
            aggregateRating: agent.rating
              ? {
                  "@type": "AggregateRating",
                  ratingValue: agent.rating.average,
                  reviewCount: agent.rating.count,
                  bestRating: 5,
                }
              : undefined,
            areaServed:
              agent.serviceAreas?.map((area) => ({
                "@type": "City",
                name: area,
              })) || [],
            worksFor: {
              "@type": "Organization",
              name: "cpmarket",
            },
          },
        })) || [],
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://cpmarket.in/agents?search={search_term}",
        },
        "query-input": "required name=search_term",
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

export default AgentsListingSchema;
