import React from "react";

const FeaturedPropertiesSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-80"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded w-40"></div>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Navigation Arrows Skeleton */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gray-300 rounded-full"></div>

        {/* Properties Container Skeleton */}
        <div className="flex gap-6 overflow-hidden">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex-none w-80 bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Image Skeleton */}
              <div className="relative">
                <div className="w-full h-48 bg-gray-300"></div>
                {/* Featured Badge Skeleton */}
                <div className="absolute top-4 left-4 w-20 h-6 bg-gray-300 rounded-full"></div>
                {/* Heart Icon Skeleton */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-gray-300 rounded-full"></div>
              </div>

              {/* Content Skeleton */}
              <div className="p-6">
                {/* Title and Price Skeleton */}
                <div className="flex justify-between items-start mb-3">
                  <div className="h-6 bg-gray-300 rounded w-40"></div>
                  <div className="h-6 bg-gray-300 rounded w-24"></div>
                </div>

                {/* Location Skeleton */}
                <div className="h-4 bg-gray-300 rounded w-48 mb-4"></div>

                {/* Property Details Skeleton */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded w-12"></div>
                  ))}
                </div>

                {/* Bottom Section Skeleton */}
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    <div className="w-24 h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator Dots Skeleton */}
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="w-2 h-2 bg-gray-300 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Hint Skeleton */}
      <div className="md:hidden mt-4 text-center">
        <div className="h-4 bg-gray-300 rounded w-64 mx-auto"></div>
      </div>
    </div>
  );
};

export default FeaturedPropertiesSkeleton;
