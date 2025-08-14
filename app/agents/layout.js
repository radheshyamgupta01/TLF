import { Fragment } from "react";

export const metadata = {
  title: "Find Real Estate Agents | Verified Experts Across India – cpmarket",
  description:
    "Connect with trusted and experienced real estate agents on cpmarket. Get expert guidance for buying, selling, or renting properties in India.",
  authors: [
    { name: "cpmarket Team" },
    { name: "Shubham S Nimje", url: "https://nimje.org/shubham-s-nimje" },
  ],
  creator: "cpmarket",
  publisher: "cpmarket",
  category: "Real Estate",
  openGraph: {
    title: "Real Estate Agents Directory | cpmarket",
    description:
      "Meet verified real estate agents near you. Get expert help for buying, selling, or renting properties in India.",
    url: "https://cpmarket.in/agents",
    siteName: "cpmarket",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "cpmarket - Smart Property Solutions",
      },
      {
        url: "/og-image-square.png",
        width: 400,
        height: 400,
        alt: "cpmarket Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Connect with Real Estate Agents | cpmarket",
    description: "Explore top-rated real estate professionals across India.",
    images: ["/twitter-image.png"],
    creator: "@cpmarket",
    site: "@cpmarket",
  },
  alternates: {
    canonical: "https://cpmarket.in/agents",
    languages: {
      "en-IN": "https://cpmarket.in/agents",
      "hi-IN": "https://cpmarket.in/hi/agents",
    },
  },
};
export default function Layout({ children }) {
  return <Fragment>{children}</Fragment>;
}
