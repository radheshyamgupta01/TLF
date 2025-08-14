import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import RealEstateAd from "../components/Home/RealEstateAd/RealEstateAd";
import ResponsiveSearchBar from "../components/Home/ResponsiveSearchBar/ResponsiveSearchBar";
import StatsSkeleton from "@/components/Skeletons/StatsSkeleton";
import AgentsSkeleton from "@/components/Skeletons/AgentsSkeleton";
import NewLaunchesSkeleton from "@/components/Skeletons/NewLaunchesSkeleton";
import FeaturedPropertiesSkeleton from "@/components/Skeletons/FeaturedPropertiesSkeleton";
import axios from "axios";
import WebsiteSchema from "@/components/SeoSetup/WebsiteSchema";
import OrganizationSchema from "@/components/SeoSetup/OrganizationSchema";
import LocalBusinessSchema from "@/components/SeoSetup/LocalBusinessSchema";
import ServiceSchema from "@/components/SeoSetup/ServiceSchema";
import FAQSchema from "@/components/SeoSetup/FAQSchema";

// Dynamic imports with optimized loading
const FeaturedPropertiesPropertyCarousel = dynamic(
  () =>
    import(
      "../components/Home/FeaturedPropertiesPropertyCarousel/FeaturedPropertiesPropertyCarousel"
    ),
  {
    loading: () => <FeaturedPropertiesSkeleton />,
    ssr: false,
  }
);

const NewLaunchesCarousel = dynamic(
  () => import("../components/Home/NewLaunchesCarousel/NewLaunchesCarousel"),
  {
    loading: () => <NewLaunchesSkeleton />,
    ssr: false,
  }
);

const AgentsCarousel = dynamic(
  () => import("../components/AgentsCarousel/AgentsCarousel"),
  {
    loading: () => <AgentsSkeleton />,
    ssr: false,
  }
);

const StatsSection = dynamic(() => import("@/components/Home/StatsSection"), {
  loading: () => <StatsSkeleton />,
  ssr: false,
});

// Memoized section component to prevent unnecessary re-renders
const Section = React.memo(({ children, className = "", ariaLabel }) => (
  <section className={className} aria-label={ariaLabel}>
    {children}
  </section>
));

Section.displayName = "Section";

// Optimized data fetching with better error handling and caching
async function getHomeData() {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/home`, {
      timeout: 10000, // 10 second timeout
      withCredentials: true, // equivalent to credentials: "include"
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(res);
    // Axios automatically throws for HTTP error status codes (4xx, 5xx)
    // and stores response data in res.data
    return res.data;
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      console.error(
        `Failed to fetch home data: ${error.response.status} ${error.response.statusText}`
      );
    } else if (error.request) {
      // Request was made but no response received
      console.error(
        "Failed to fetch home data: No response received",
        error.request
      );
    } else {
      // Something else happened
      console.error("Failed to fetch home data:", error.message);
    }

    // Return empty data structure instead of empty array
    return {
      data: {
        premiumListings: null,
        featuredListings: null,
        premiumBrokers: null,
      },
    };
  }
}

// Conditional rendering component to reduce code duplication
const ConditionalRender = ({ data, fallback, children }) =>
  data ? children : fallback;

const Home = async () => {
  const { data } = await getHomeData();

  const homeFAQs = [
    {
      question: "What is cpmarket?",
      answer:
        "cpmarket is India's trusted real estate platform that helps you buy, sell, and rent properties with verified listings and expert agents.",
    },
    {
      question: "Is it free to search for properties?",
      answer:
        "Yes, searching and browsing properties on cpmarket is completely free. You only pay when you successfully buy or sell a property.",
    },
    {
      question: "How do I contact property agents?",
      answer:
        "You can contact agents directly through property listings, agent profiles, or by using our contact forms available on each property page.",
    },
  ];

  // console.log(data);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Above-the-fold content - rendered immediately */}
      <RealEstateAd />
      <ResponsiveSearchBar />

      {/* Below-the-fold content - lazy loaded */}
      <Suspense fallback={<FeaturedPropertiesSkeleton />}>
        <Section className="py-16 bg-white" ariaLabel="Featured Properties">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ConditionalRender
              data={data?.premiumListings}
              fallback={<FeaturedPropertiesSkeleton />}
            >
              <FeaturedPropertiesPropertyCarousel
                premiumListings={data.premiumListings}
              />
            </ConditionalRender>
          </div>
        </Section>
      </Suspense>

      <Suspense fallback={<NewLaunchesSkeleton />}>
        <Section ariaLabel="New Property Launches">
          <ConditionalRender
            data={data?.featuredListings}
            fallback={<NewLaunchesSkeleton />}
          >
            <NewLaunchesCarousel featuredListings={data.featuredListings} />
          </ConditionalRender>
        </Section>
      </Suspense>

      <Suspense fallback={<AgentsSkeleton />}>
        <Section ariaLabel="Preferred Agents">
          <ConditionalRender
            data={data?.premiumBrokers}
            fallback={<AgentsSkeleton />}
          >
            <AgentsCarousel agents={data.premiumBrokers} />
          </ConditionalRender>
        </Section>
      </Suspense>
      {/* 
      <Suspense fallback={<StatsSkeleton />}>
        <Section ariaLabel="Platform Statistics">
          <StatsSection />
        </Section>
      </Suspense> */}

      <WebsiteSchema />
      <OrganizationSchema />
      <LocalBusinessSchema />
      <ServiceSchema />
      <FAQSchema faqs={homeFAQs} />
    </div>
  );
};

export default Home;
