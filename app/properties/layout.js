import { Fragment } from "react";

export const metadata = {
  title: "Browse Properties | Buy, Sell, Rent Real Estate in India – cpmarket",
  description:
    "Explore verified property listings across India on cpmarket. Find your ideal home or investment property. Buy, sell, or rent residential and commercial real estate with ease.",
  authors: [
    { name: "cpmarket Team" },
    { name: "Shubham S Nimje", url: "https://nimje.org/shubham-s-nimje" },
  ],
  creator: "cpmarket",
  publisher: "cpmarket",
  category: "Real Estate",
  openGraph: {
    title: "Browse Properties | cpmarket",
    description:
      "Discover thousands of verified listings across India. Buy, sell, or rent residential and commercial properties easily with cpmarket.",
    url: "https://cpmarket.in/property",
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
    title: "Browse Verified Properties | cpmarket",
    description:
      "Search from thousands of verified property listings on cpmarket.",
    images: ["/twitter-image.png"],
    creator: "@cpmarket",
    site: "@cpmarket",
  },
  alternates: {
    canonical: "https://cpmarket.in/property",
    languages: {
      "en-IN": "https://cpmarket.in/property",
      "hi-IN": "https://cpmarket.in/hi/property",
    },
  },
};

export default function Layout({ children }) {
  return <Fragment>{children}</Fragment>;
}
