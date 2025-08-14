import React from "react";

const StatsSection = () => {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">50K+</div>
            <div className="text-blue-200">Properties Listed</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">25K+</div>
            <div className="text-blue-200">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-blue-200">Verified Agents</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">100+</div>
            <div className="text-blue-200">Cities Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
