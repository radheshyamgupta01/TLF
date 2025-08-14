// components/schemas/PropertySchema.js
import React from "react";

const PropertySchema = ({ property }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `https://cpmarket.in/properties/${property.id}`,
    name: property.title,
    description: property.description,
    url: `https://cpmarket.in/properties/${property.id}`,
    image: property.images?.map((img) => ({
      "@type": "ImageObject",
      url: img.url,
      caption: img.caption || property.title,
    })),
    datePosted: property.createdAt,
    validThrough: property.validUntil,
    priceSpecification: {
      "@type": "PriceSpecification",
      price: property.price,
      priceCurrency: "INR",
      valueAddedTaxIncluded: false,
    },
    availabilityStarts: property.availableFrom,
    provider: {
      "@type": "RealEstateAgent",
      name: property.agent?.name || "cpmarket Agent",
      telephone: property.agent?.phone,
      email: property.agent?.email,
      image: property.agent?.photo,
      url: property.agent?.profileUrl,
    },
    mainEntity: {
      "@type":
        property.type === "apartment"
          ? "Apartment"
          : property.type === "house"
          ? "House"
          : property.type === "land"
          ? "LandPlot"
          : "Residence",
      name: property.title,
      description: property.description,
      numberOfRooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.area,
        unitText: property.areaUnit || "sq ft",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: property.address?.street,
        addressLocality: property.address?.city,
        addressRegion: property.address?.state,
        postalCode: property.address?.pincode,
        addressCountry: "IN",
      },
      geo: property.coordinates
        ? {
            "@type": "GeoCoordinates",
            latitude: property.coordinates.lat,
            longitude: property.coordinates.lng,
          }
        : undefined,
      amenityFeature: property.amenities?.map((amenity) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity,
        value: true,
      })),
      yearBuilt: property.yearBuilt,
      occupancy: property.occupancyType,
      accommodationCategory: property.category,
      petsAllowed: property.petsAllowed,
      smokingAllowed: property.smokingAllowed,
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
      availability: property.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      validFrom: property.createdAt,
      validThrough: property.validUntil,
      seller: {
        "@type": "RealEstateAgent",
        name: property.agent?.name || "cpmarket Agent",
      },
    },
    potentialAction: [
      {
        "@type": "ViewAction",
        target: `https://cpmarket.in/properties/${property.id}`,
      },
      {
        "@type": "ContactAction",
        target: `https://cpmarket.in/contact-agent/${property.agent?.id}`,
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

export default PropertySchema;
