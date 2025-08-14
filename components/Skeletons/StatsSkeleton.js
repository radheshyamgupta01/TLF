import React from "react";

const StatsSkeleton = () => {
  return (
    <section className="py-16 bg-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Number Skeleton */}
              <div className="h-10 bg-gray-400 rounded w-20 mb-2"></div>
              {/* Label Skeleton */}
              <div className="h-4 bg-gray-400 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSkeleton;
