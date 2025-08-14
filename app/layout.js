import "./globals.css";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import ReduxProvider from "@/components/providers/ReduxProvider";
const ProgressBar = dynamic(() => import("@/components/Loaders/ProgressBar"), {
  ssr: false,
  loading: () => null,
});

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata = {
  title:
    "cpmarket - Smart Property Solutions | Buy, Sell, Rent Properties in India",
  description:
    "Find, sell, and rent properties easily with cpmarket. India's trusted real estate platform with verified listings, expert agents, and smart property solutions. Start your property journey today.",
  authors: [
    { name: "cpmarket Team" },
    { name: "Shubham S Nimje", url: "https://nimje.org/shubham-s-nimje" },
  ],
  creator: "cpmarket",
  publisher: "cpmarket",
  category: "Real Estate",

  // Enhanced Open Graph
  openGraph: {
    title: "cpmarket - Smart Property Solutions",
    description:
      "India's trusted platform to buy, sell, or rent properties. Verified listings, expert agents, and smart property solutions.",
    url: "https://cpmarket.in",
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

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "cpmarket - Smart Property Solutions",
    description: "India's trusted platform to buy, sell, or rent properties.",
    images: ["/twitter-image.png"],
    creator: "@cpmarket",
    site: "@cpmarket",
  },

  // Verification
  verification: {
    google: "UBeiQKLmKhqy-R2L6QBGsPH9RdcTafp-uG6TiyAv_hw",
    yandex: "verification_code_here",
    yahoo: "verification_code_here",
    other: {
      me: ["mailto:contact@cpmarket.in", "https://cpmarket.in"],
    },
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },

  // Additional SEO
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Manifest
  manifest: "/site.webmanifest",

  // Alternate languages (if applicable)
  alternates: {
    canonical: "https://cpmarket.in",
    languages: {
      "en-IN": "https://cpmarket.in",
      "hi-IN": "https://cpmarket.in/hi",
    },
  },

  // Additional metadata
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "cpmarket",
    "application-name": "cpmarket",
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#2563eb",
  },

  // App links for mobile
  appLinks: {
    ios: {
      app_store_id: "123456789",
      app_name: "cpmarket",
    },
    android: {
      package: "com.cpmarket.app",
      app_name: "cpmarket",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        {/* Viewport optimization */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* Theme color */}
        <meta name="theme-color" content="#2563eb" />

        {/* Additional SEO meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta
          name="google-site-verification"
          content="UBeiQKLmKhqy-R2L6QBGsPH9RdcTafp-uG6TiyAv_hw"
        />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <Header />
          <div className="min-h-screen bg-gray-50">{children}</div>
          {/* <Footer /> */}
          <ProgressBar />
        </ReduxProvider>
      </body>
    </html>
  );
}
