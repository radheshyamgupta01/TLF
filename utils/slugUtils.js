// utils/slugUtils.js
export function generatePropertySlug(property) {
  // console.log("Generating slug for property:", property);

  const {
    title,
    location = {},
    propertyType,
    listingType,
    details = {},
    pricing = {},
  } = property;

  // Helper function to clean text
  const cleanText = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Clean and format components with null checks
  const cleanTitle = cleanText(title);
  const cleanCity = cleanText(location.city);
  const cleanLocality = cleanText(location.locality);
  const cleanPropertyType = cleanText(propertyType);
  const cleanListingType = cleanText(listingType);

  // Create SEO-friendly slug components
  const slugComponents = [
    cleanTitle,
    cleanPropertyType,
    cleanListingType,
    cleanCity,
    cleanLocality,
    details.bedrooms ? `${details.bedrooms}bhk` : null,
    details.area
      ? `${Math.round(details.area)}${details.areaUnit || "sqft"}`
      : null,
    pricing.price ? `${Math.round(pricing.price / 100000)}l` : null,
  ].filter(Boolean);

  // Join components and add unique identifier
  const baseSlug = slugComponents.join("-");
  const uniqueId =
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

  return `${baseSlug}-${uniqueId}`;
}

export function generateSEOMetadata(property) {
  const {
    title,
    description,
    location = {},
    propertyType,
    listingType,
    details = {},
    pricing = {},
    contact = {},
    amenities = [],
  } = property;

  // Create meta title with null checks
  const metaTitle = [
    details.bedrooms ? `${details.bedrooms}BHK` : null,
    propertyType,
    "for",
    listingType,
    "in",
    location.locality,
    location.city,
    pricing.price ? `- ₹${pricing.price.toLocaleString()}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  // Create meta description
  const metaDescription = [
    details.bedrooms ? `${details.bedrooms}BHK` : null,
    propertyType,
    "for",
    listingType,
    "in",
    location.locality ? `${location.locality},` : null,
    location.city ? `${location.city}.` : null,
    details.area ? `${details.area} ${details.areaUnit || "sqft"},` : null,
    details.furnishing ? `${details.furnishing}.` : null,
    pricing.price ? `Price: ₹${pricing.price.toLocaleString()}.` : null,
    contact.phoneNumber ? `Contact: ${contact.phoneNumber}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  // Generate keywords
  const keywords = [
    details.bedrooms ? `${details.bedrooms}BHK ${propertyType}` : null,
    propertyType ? `${propertyType} for ${listingType}` : null,
    location.locality ? `${location.locality} ${propertyType}` : null,
    location.city ? `${location.city} real estate` : null,
    location.pincode ? `${location.pincode} properties` : null,
    details.furnishing ? `${details.furnishing} ${propertyType}` : null,
    pricing.price
      ? `${Math.round(pricing.price / 100000)}L ${propertyType}`
      : null,
    ...amenities,
  ].filter(Boolean);

  return {
    title:
      metaTitle.length > 60 ? metaTitle.substring(0, 57) + "..." : metaTitle,
    description:
      metaDescription.length > 160
        ? metaDescription.substring(0, 157) + "..."
        : metaDescription,
    keywords: keywords.join(", "),
  };
}

// Helper function to generate search terms
export function generateSearchTerms(property) {
  const {
    title,
    propertyType,
    listingType,
    location = {},
    details = {},
    contact = {},
    amenities = [],
  } = property;

  const terms = [
    title,
    propertyType,
    listingType,
    location.city,
    location.locality,
    location.state,
    location.pincode,
    details.bedrooms ? `${details.bedrooms}BHK` : null,
    details.bedrooms ? `${details.bedrooms} bedroom` : null,
    details.furnishing,
    contact.userType,
    ...amenities,
  ];

  return terms.filter(Boolean).map((term) => term.toLowerCase());
}

// Generate canonical URL
export function generateCanonicalUrl(
  property,
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL
) {
  const slug = generatePropertySlug(property);
  return `${baseUrl}/property/${property._id}/${slug}`;
}
