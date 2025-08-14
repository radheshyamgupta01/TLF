"use client";

import React, { useState } from "react";
import { Award, TrendingUp, Home, Building, Users } from "lucide-react";
import Link from "next/link";
import InquiryForm from "@/components/property/InquiryForm";

const RealEstateAd = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full opacity-10 translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Main Heading */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Find Your Dream Home
                <span className="block text-xl sm:text-2xl lg:text-3xl text-blue-300 mt-2">
                  in Premium Locations
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 mt-4">
                Discover luxury properties from India&apos;s leading developers
              </p>
            </div>

            {/* Featured Developer Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-start sm:items-center space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Featured Developer
                  </h3>
                  <p className="text-blue-200 text-sm sm:text-base">
                    Godrej Properties
                  </p>
                  <p className="text-xs sm:text-sm text-gray-200 my-2 leading-relaxed">
                    Premium residential projects starting from ₹1.2 Cr. Limited
                    time offer!
                  </p>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105"
                  >
                    Explore Projects
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image and Stats */}
          <div className="space-y-4">
            {/* Property Image */}
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=300&fit=crop"
                alt="Luxury Property"
                width={500}
                height={300}
                className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />

              {/* Floating Stats Card */}
              <div className="absolute -bottom-4 -left-4 bg-white p-3 sm:p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Property Value
                    </p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      ↗ 15% increase
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center">
                <Home className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-300" />
                <p className="text-lg sm:text-xl font-bold">500+</p>
                <p className="text-xs sm:text-sm text-gray-300">Properties</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center">
                <Building className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-300" />
                <p className="text-lg sm:text-xl font-bold">50+</p>
                <p className="text-xs sm:text-sm text-gray-300">Developers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-300" />
                <p className="text-lg sm:text-xl font-bold">2000+</p>
                <p className="text-xs sm:text-sm text-gray-300">
                  Happy Clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isFormOpen && (
        <InquiryForm
          listingId="65a1b2c3dbe58fbb22b9f786"
          setIsFormOpen={setIsFormOpen}
        />
      )}
    </section>
  );
};

export default RealEstateAd;
