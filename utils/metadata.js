// utils/metadata.js
export const GenerateMetadata = {
  // Properties listing page metadata
  properties: (params = {}) => ({
    title: `Properties for Sale & Rent${
      params.location ? ` in ${params.location}` : ""
    } | cpmarket`,
    description: `Browse ${
      params.count || "thousands of"
    } verified properties for sale and rent${
      params.location ? ` in ${params.location}` : " across India"
    }. Find apartments, houses, commercial properties with expert agents.`,
    keywords: [
      "properties for sale",
      "properties for rent",
      "real estate listings",
      "buy property",
      "rent property",
      params.location && `properties in ${params.location}`,
      "verified properties",
      "property search",
    ].filter(Boolean),
    openGraph: {
      title: `Properties${
        params.location ? ` in ${params.location}` : ""
      } | cpmarket`,
      description: `Find your perfect property${
        params.location ? ` in ${params.location}` : ""
      }. Verified listings, expert agents, smart search.`,
      url: `https://cpmarket.in/properties${
        params.query ? `?${params.query}` : ""
      }`,
      images: [
        {
          url: "/og-properties.png",
          width: 1200,
          height: 630,
          alt: `Properties${
            params.location ? ` in ${params.location}` : ""
          } - cpmarket`,
        },
      ],
    },
    twitter: {
      title: `Properties${
        params.location ? ` in ${params.location}` : ""
      } | cpmarket`,
      description: `Find your perfect property${
        params.location ? ` in ${params.location}` : ""
      }. Verified listings, expert agents.`,
    },
  }),

  // Single property page metadata
  property: (property) => ({
    title: `${property.title} | ${
      property.price ? `₹${property.price}` : "Price on Request"
    } | cpmarket`,
    description: `${
      property.description?.substring(0, 155) ||
      `${property.bedrooms}BHK ${property.type} for ${property.listingType}`
    }. Contact verified agent for viewing and details.`,
    keywords: [
      property.type,
      `${property.bedrooms}BHK`,
      property.listingType,
      property.address?.city,
      property.address?.locality,
      "verified property",
      "real estate",
    ].filter(Boolean),
    openGraph: {
      title: property.title,
      description: `${property.bedrooms}BHK ${property.type} for ${
        property.listingType
      } in ${property.address?.locality || property.address?.city}`,
      url: `https://cpmarket.in/properties/${property.id}`,
      images:
        property.images?.map((img) => ({
          url: img.url,
          width: 1200,
          height: 630,
          alt: property.title,
        })) || [],
    },
    twitter: {
      title: property.title,
      description: `${property.bedrooms}BHK ${property.type} - ₹${property.price}`,
      images: property.images?.[0]?.url ? [property.images[0].url] : [],
    },
  }),

  // Agents listing page metadata
  agents: (params = {}) => ({
    title: `Real Estate Agents${
      params.location ? ` in ${params.location}` : ""
    } | cpmarket`,
    description: `Connect with ${
      params.count || "professional"
    } verified real estate agents${
      params.location ? ` in ${params.location}` : " across India"
    }. Expert agents for buying, selling, renting properties.`,
    keywords: [
      "real estate agents",
      "property agents",
      "verified agents",
      params.location && `agents in ${params.location}`,
      "property consultants",
      "real estate brokers",
    ].filter(Boolean),
    openGraph: {
      title: `Real Estate Agents${
        params.location ? ` in ${params.location}` : ""
      } | cpmarket`,
      description: `Find experienced real estate agents${
        params.location ? ` in ${params.location}` : ""
      }. Verified professionals to help with your property needs.`,
      url: `https://cpmarket.in/agents${
        params.query ? `?${params.query}` : ""
      }`,
      images: [
        {
          url: "/og-agents.png",
          width: 1200,
          height: 630,
          alt: `Real Estate Agents${
            params.location ? ` in ${params.location}` : ""
          } - cpmarket`,
        },
      ],
    },
  }),

  // Single agent page metadata
  agent: (agent) => ({
    title: `${agent.name} - Real Estate Agent | cpmarket`,
    description: `Connect with ${agent.name}, professional real estate agent${
      agent.experience ? ` with ${agent.experience} years experience` : ""
    }. ${
      agent.specializations?.join(", ") ||
      "Expert in residential and commercial properties"
    }.`,
    keywords: [
      agent.name,
      "real estate agent",
      ...(agent.specializations || []),
      ...(agent.serviceAreas || []),
      "property consultant",
    ].filter(Boolean),
    openGraph: {
      title: `${agent.name} - Real Estate Agent`,
      description: `Professional real estate agent${
        agent.serviceAreas ? ` serving ${agent.serviceAreas.join(", ")}` : ""
      }`,
      url: `https://cpmarket.in/agents/${agent.id}`,
      images: agent.photo
        ? [
            {
              url: agent.photo,
              width: 400,
              height: 400,
              alt: agent.name,
            },
          ]
        : [],
    },
    twitter: {
      title: `${agent.name} - Real Estate Agent`,
      description: `Professional real estate agent - ${
        agent.bio?.substring(0, 100) || "Expert property consultant"
      }`,
      images: agent.photo ? [agent.photo] : [],
    },
  }),
};
