"use client";

import React, { useState, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCardSkeleton from "@/components/Skeletons/PropertyCardSkeleton";
import Link from "next/link";

const PropertyCard = dynamic(() => import("./PropertyCard"), {
  loading: () => <PropertyCardSkeleton />, // Shown while loading
  ssr: false,
});

export default function FeaturedPropertiesCarousel({ premiumListings }) {
  const [favorites, setFavorites] = useState(new Set());
  const scrollContainerRef = useRef(null);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
      return newFavorites;
    });
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 320;
    const scrollAmount = cardWidth * 2;

    container.scrollTo({
      left:
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h2 className="text-center md:text-left text-3xl font-bold text-gray-900 mb-2">
            Featured Properties
          </h2>
          <p className="text-gray-600">
            Discover your dream home from our curated selection
          </p>
        </div>
        <Link
          href={`/properties`}
          className="flex items-center space-x-2 py-4 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <span>View All Properties</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Carousel */}
      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 -translate-x-6 hover:translate-x-0"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 translate-x-6 hover:translate-x-0"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 "
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <Suspense fallback={<PropertyCardSkeleton />}>
            {premiumListings?.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={favorites.has(property.id)}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </Suspense>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(premiumListings?.length / 2) }).map(
            (_, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-gray-300 rounded-full transition-colors"
              />
            )
          )}
        </div>
      </div>

      <div className="md:hidden mt-4 text-center text-sm text-gray-500">
        Swipe left or right to see more properties
      </div>
    </div>
  );
}
