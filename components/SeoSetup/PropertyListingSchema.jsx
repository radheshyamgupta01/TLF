// components/schemas/PropertyListingSchema.js
import React from "react";

const PropertyListingSchema = ({ properties, page, totalCount, location }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://cpmarket.in/properties${page ? `?page=${page}` : ""}`,
    name: `Property Listings${location ? ` in ${location}` : ""} - cpmarket`,
    description: `Browse ${
      totalCount || "thousands of"
    } verified property listings${
      location ? ` in ${location}` : " across India"
    }. Find your perfect home, apartment, or commercial space.`,
    url: `https://cpmarket.in/properties${page ? `?page=${page}` : ""}`,
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
          name: "Properties",
          item: "https://cpmarket.in/properties",
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: properties?.length || 0,
      itemListElement:
        properties?.map((property, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "RealEstateListing",
            "@id": `https://cpmarket.in/properties/${property.id}`,
            name: property.title,
            description: property.description,
            url: `https://cpmarket.in/properties/${property.id}`,
            image: property.images?.[0]?.url,
            priceSpecification: {
              "@type": "PriceSpecification",
              price: property.price,
              priceCurrency: "INR",
            },
            mainEntity: {
              "@type":
                property.type === "apartment"
                  ? "Apartment"
                  : property.type === "house"
                  ? "House"
                  : "Residence",
              name: property.title,
              numberOfRooms: property.bedrooms,
              address: {
                "@type": "PostalAddress",
                addressLocality: property.address?.city,
                addressRegion: property.address?.state,
                addressCountry: "IN",
              },
            },
          },
        })) || [],
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://cpmarket.in/properties?search={search_term}",
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

export default PropertyListingSchema;
