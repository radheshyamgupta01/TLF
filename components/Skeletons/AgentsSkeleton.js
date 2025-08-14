import React from "react";

const AgentsSkeleton = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <div className="h-8 bg-gray-300 rounded w-64 mb-3"></div>
            <div className="h-5 bg-gray-300 rounded w-80"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded w-32"></div>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Arrows Skeleton */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gray-300 rounded-full"></div>

          {/* Agents Container Skeleton */}
          <div className="flex gap-4 overflow-hidden pb-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex-none w-64 sm:w-72 bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden"
              >
                {/* Agent Header Skeleton */}
                <div className="relative bg-gray-100 p-6 text-center">
                  {/* Online Status Skeleton */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gray-300 rounded-full"></div>

                  {/* Profile Image Skeleton */}
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>

                  {/* Name Skeleton */}
                  <div className="h-5 bg-gray-300 rounded w-32 mx-auto mb-1"></div>

                  {/* Location Skeleton */}
                  <div className="h-3 bg-gray-300 rounded w-24 mx-auto mb-2"></div>

                  {/* Specialty Badge Skeleton */}
                  <div className="h-5 bg-gray-300 rounded w-20 mx-auto"></div>
                </div>

                {/* Agent Stats Skeleton */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    {/* Experience Skeleton */}
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>

                    {/* Deals Skeleton */}
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-gray-300 rounded w-24"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 bg-gray-300 rounded-lg"></div>
                      <div className="flex-1 h-8 bg-gray-300 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator Dots Skeleton */}
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-gray-300 rounded-full"
              ></div>
            ))}
          </div>
        </div>

        {/* Show More Button Skeleton */}
        <div className="text-center mt-8">
          <div className="h-12 bg-gray-300 rounded-lg w-48 mx-auto"></div>
        </div>

        {/* Call to Action Section Skeleton */}
        <div className="mt-12">
          <div className="bg-gray-300 rounded-2xl p-8">
            <div className="text-center">
              <div className="h-8 bg-gray-400 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-400 rounded w-60 md:w-96 mx-auto mb-6"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="h-12 bg-gray-400 rounded w-48"></div>
                <div className="h-12 bg-gray-400 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Hint Skeleton */}
        <div className="sm:hidden mt-4 text-center">
          <div className="h-4 bg-gray-300 rounded w-64 mx-auto"></div>
        </div>
      </div>
    </section>
  );
};

export default AgentsSkeleton;
