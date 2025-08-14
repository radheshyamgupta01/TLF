// utils/seo.js
export const SEOUtils = {
  // Generate canonical URL
  generateCanonicalUrl: (path, params = {}) => {
    const baseUrl = "https://cpmarket.in";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (Object.keys(params).length === 0) {
      return `${baseUrl}${cleanPath}`;
    }

    const queryString = new URLSearchParams(params).toString();
    return `${baseUrl}${cleanPath}?${queryString}`;
  },

  // Generate meta description
  generateMetaDescription: (content, maxLength = 155) => {
    if (!content) return "";

    const cleanContent = content.replace(/<[^>]*>/g, "").trim();
    if (cleanContent.length <= maxLength) return cleanContent;

    return cleanContent.substring(0, maxLength - 3).trim() + "...";
  },

  // Generate keywords from content
  generateKeywords: (title, description, location, type) => {
    const keywords = new Set();

    // Add basic keywords
    keywords.add("cpmarket");
    keywords.add("real estate");
    keywords.add("property");

    // Add location-based keywords
    if (location) {
      keywords.add(`properties in ${location}`);
      keywords.add(`real estate ${location}`);
      keywords.add(location);
    }

    // Add type-based keywords
    if (type) {
      keywords.add(type);
      keywords.add(`${type} for sale`);
      keywords.add(`${type} for rent`);
    }

    // Extract keywords from title and description
    const text = `${title} ${description}`.toLowerCase();
    const commonKeywords = [
      "buy",
      "sell",
      "rent",
      "apartment",
      "house",
      "villa",
      "plot",
      "commercial",
      "residential",
      "investment",
      "broker",
      "agent",
    ];

    commonKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        keywords.add(keyword);
      }
    });

    return Array.from(keywords).filter(Boolean);
  },

  // Generate Open Graph image URL
  generateOGImage: (type, data = {}) => {
    const baseUrl = "https://cpmarket.in/api/og";
    const params = new URLSearchParams({
      type,
      ...data,
    });

    return `${baseUrl}?${params.toString()}`;
  },

  // Generate structured data for search results
  generateSearchResultsData: (results, query, page = 1) => {
    return {
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: results.length,
        itemListElement: results.map((item, index) => ({
          "@type": "ListItem",
          position: (page - 1) * 10 + index + 1,
          item: {
            "@type": "Thing",
            name: item.title,
            description: item.description,
            url: item.url,
          },
        })),
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `https://cpmarket.in/search?q=${encodeURIComponent(query)}`,
        query: query,
      },
    };
  },
};

// Sitemap generator
export const generateSitemap = (pages) => {
  const baseUrl = "https://cpmarket.in";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${
      page.lastModified || new Date().toISOString().split("T")[0]
    }</lastmod>
    <changefreq>${page.changefreq || "weekly"}</changefreq>
    <priority>${page.priority || "0.8"}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return xml;
};

// Common structured data snippets
export const commonStructuredData = {
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9876543210",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },

  organization: {
    "@type": "Organization",
    "@id": "https://cpmarket.in/#organization",
    name: "cpmarket",
    url: "https://cpmarket.in",
    logo: "https://cpmarket.in/logo.png",
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Shubham S Nimje",
      url: "https://nimje.org/shubham-s-nimje",
    },
  },

  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
    addressRegion: "Maharashtra",
    addressLocality: "Mumbai",
  },
};
