import React from "react";

const NewLaunchesSkeleton = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <div className="h-9 bg-gray-300 rounded w-60 md:w-96 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-72"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded w-40"></div>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Arrows Skeleton */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gray-300 rounded-full"></div>

          {/* Projects Container Skeleton */}
          <div className="flex gap-6 overflow-hidden pb-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex-none w-80 sm:w-96 bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {/* Image Skeleton */}
                <div className="relative w-full h-48 bg-gray-300"></div>

                {/* Content Skeleton */}
                <div className="p-6">
                  {/* Title and Developer Skeleton */}
                  <div className="h-6 bg-gray-300 rounded w-64 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>

                  {/* Location Skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-48 mb-4"></div>

                  {/* Price and Possession Skeleton */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="h-3 bg-gray-300 rounded w-20 mb-1"></div>
                      <div className="h-6 bg-gray-300 rounded w-24"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-3 bg-gray-300 rounded w-16 mb-1"></div>
                      <div className="h-5 bg-gray-300 rounded w-20"></div>
                    </div>
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
              <div
                key={index}
                className="w-2 h-2 bg-gray-300 rounded-full"
              ></div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Hint Skeleton */}
        <div className="sm:hidden mt-4 text-center">
          <div className="h-4 bg-gray-300 rounded w-64 mx-auto"></div>
        </div>

        {/* Call to Action Skeleton */}
        <div className="mt-12">
          <div className="bg-gray-300 rounded-2xl p-8">
            <div className="text-center">
              <div className="h-8 bg-gray-400 rounded w-40 md:w-80 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-400 rounded w-60 md:w-96 mx-auto mb-6"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="h-12 bg-gray-400 rounded w-48"></div>
                <div className="h-12 bg-gray-400 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewLaunchesSkeleton;
