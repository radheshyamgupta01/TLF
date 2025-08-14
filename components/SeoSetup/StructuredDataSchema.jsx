// components/schemas/StructuredDataSchema.js
import React from "react";

const StructuredDataSchema = ({ type, data }) => {
  let jsonLd = {};

  switch (type) {
    case "product":
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: data.name,
        description: data.description,
        image: data.images,
        brand: {
          "@type": "Brand",
          name: "cpmarket",
        },
        offers: {
          "@type": "Offer",
          price: data.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "cpmarket",
          },
        },
        aggregateRating: data.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: data.rating.average,
              reviewCount: data.rating.count,
            }
          : undefined,
      };
      break;

    case "article":
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.title,
        description: data.description,
        image: data.image,
        author: {
          "@type": "Person",
          name: data.author || "cpmarket Team",
        },
        publisher: {
          "@type": "Organization",
          name: "cpmarket",
          logo: {
            "@type": "ImageObject",
            url: "https://cpmarket.in/logo.png",
          },
        },
        datePublished: data.publishedDate,
        dateModified: data.modifiedDate || data.publishedDate,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": data.url,
        },
      };
      break;

    case "event":
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: {
          "@type": "Place",
          name: data.location.name,
          address: {
            "@type": "PostalAddress",
            streetAddress: data.location.address,
            addressLocality: data.location.city,
            addressRegion: data.location.state,
            addressCountry: "IN",
          },
        },
        organizer: {
          "@type": "Organization",
          name: "cpmarket",
          url: "https://cpmarket.in",
        },
        offers: data.price
          ? {
              "@type": "Offer",
              price: data.price,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            }
          : undefined,
      };
      break;

    case "howto":
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: data.name,
        description: data.description,
        image: data.image,
        totalTime: data.totalTime,
        estimatedCost: data.estimatedCost
          ? {
              "@type": "MonetaryAmount",
              currency: "INR",
              value: data.estimatedCost,
            }
          : undefined,
        supply:
          data.supplies?.map((supply) => ({
            "@type": "HowToSupply",
            name: supply,
          })) || [],
        tool:
          data.tools?.map((tool) => ({
            "@type": "HowToTool",
            name: tool,
          })) || [],
        step:
          data.steps?.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.name,
            text: step.description,
            image: step.image,
          })) || [],
      };
      break;

    case "video":
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: data.name,
        description: data.description,
        thumbnailUrl: data.thumbnail,
        uploadDate: data.uploadDate,
        duration: data.duration,
        contentUrl: data.contentUrl,
        embedUrl: data.embedUrl,
        publisher: {
          "@type": "Organization",
          name: "cpmarket",
          logo: {
            "@type": "ImageObject",
            url: "https://cpmarket.in/logo.png",
          },
        },
      };
      break;

    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default StructuredDataSchema;
