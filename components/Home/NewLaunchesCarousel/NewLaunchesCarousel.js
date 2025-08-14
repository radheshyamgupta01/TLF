"use client";
import React, { useRef } from "react";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Phone,
  FileText,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { FormatPrice } from "@/utils/formatPrice";
import Link from "next/link";
import ShareButton from "@/utils/ShareButton";

export default function NewLaunchesCarousel({ featuredListings }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 350; // Approximate width of each card including gap
    const scrollAmount = cardWidth * 2; // Scroll by 2 cards at a time

    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const handleGetDetails = (projectId) => {
    // console.log("Get details for project:", projectId);
    // Handle get details action
  };

  const handleCall = (projectId) => {
    // console.log("Call for project:", projectId);
    // Handle call action
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New Launch":
        return "bg-green-500 text-white";
      case "Pre Launch":
        return "bg-orange-500 text-white";
      case "Under Construction":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  // console.log(featuredListings);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-center md:text-left text-3xl font-bold text-gray-900 mb-2">
              New Launches and Upcoming Projects
            </h2>
            <p className="text-gray-600">
              Be the first to invest in tomorrow&apos;s landmarks
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

        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 -translate-x-6 hover:translate-x-0"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 translate-x-6 hover:translate-x-0"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Projects Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featuredListings?.map((project) => (
              <div
                key={project.id}
                className="flex-none w-80 sm:w-96 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group/card"
              >
                <div className="relative w-full h-64">
                  <Image
                    width={500}
                    height={500}
                    src={project.images?.[0]?.url}
                    alt={project.title}
                    className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover/card:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    by {project.contactPerson}
                  </p>

                  <p className="text-gray-600 mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{project.address}</span>
                  </p>

                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Starting from</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {FormatPrice(project.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Possession</p>
                      <p className="font-semibold text-gray-900">
                        {project.propertyType}
                      </p>
                    </div>
                  </div>

                  {/* <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => handleGetDetails(project.id)}
                      className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Get Details</span>
                    </button>
                    <button 
                      onClick={() => handleCall(project.id)}
                      className="flex-1 sm:flex-none px-6 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                  </div> */}

                  <div className="flex justify-between items-center">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {project.listingType}
                    </span>
                    <div className="flex space-x-2">
                      <Link
                        href={`/properties/${project?._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <ShareButton
                        title={project.title}
                        text="Check out this awesome page!"
                        url={`/properties/${project?._id}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({
              length: Math.ceil(featuredListings?.length / 2),
            }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-gray-300 rounded-full hover:bg-blue-400 transition-colors cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Mobile Navigation Hint */}
        <div className="sm:hidden mt-4 text-center text-sm text-gray-500">
          Swipe left or right to see more projects
        </div>

        {/* Call to Action */}
        {/* <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Invest in Your Future?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Get exclusive access to pre-launch offers and early bird discounts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Schedule Site Visit
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Download Brochure
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
