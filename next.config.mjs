// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com", "randomuser.me"],

    formats: ["image/webp", "image/avif"],
  },
  async rewrites() {
    return [
      // SEO-friendly URLs
      {
        source: "/rent/:city",
        destination: "/properties?listingType=rent&city=:city",
      },
      {
        source: "/sale/:city",
        destination: "/properties?listingType=sale&city=:city",
      },
      {
        source: "/properties/city/:city",
        destination: "/properties?city=:city",
      },
      {
        source: "/properties/type/:type",
        destination: "/properties?propertyType=:type",
      },
      {
        source: "/properties/locality/:locality",
        destination: "/properties?locality=:locality",
      },
      {
        source: "/:type-for-rent",
        destination: "/properties?propertyType=:type&listingType=rent",
      },
      {
        source: "/:type-for-sale",
        destination: "/properties?propertyType=:type&listingType=sale",
      },
    ];
  },
  async redirects() {
    return [
      // Redirect old URLs to new structure
      {
        source: "/property-details/:id",
        destination: "/property/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
