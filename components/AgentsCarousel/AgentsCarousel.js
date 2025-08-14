"use client";
import React, { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  User,
  Award,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AgentsCarousel({ agents }) {
  const [showAllAgents, setShowAllAgents] = useState(false);
  const scrollContainerRef = useRef(null);

  const displayedAgents = showAllAgents ? agents : agents.slice(0, 6);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 280; // Approximate width of each card including gap
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

  const handleCallAgent = (agentId) => {
    // console.log("Call agent:", agentId);
    // Handle call agent action
  };

  const handleMessageAgent = (agentId) => {
    // console.log("Message agent:", agentId);
    // Handle message agent action
  };

  const handleViewProfile = (agentId) => {
    // console.log("View profile:", agentId);
    // Handle view profile action
  };

  // console.log(agents);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Our Preferred Agents
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Connect with verified and experienced property experts
            </p>
          </div>
          <Link
            href={`/agents`}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors whitespace-nowrap"
          >
            <span>View All Agents</span>
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

          {/* Agents Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayedAgents.map((agent) => (
              <div
                key={agent._id}
                className="flex-none w-64 sm:w-72 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 group/card overflow-hidden"
              >
                {/* Agent Header */}
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-6 text-center">
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  {agent.avatar ? (
                    <Image
                      width={500}
                      height={500}
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover ring-4 ring-white shadow-lg group-hover/card:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <User className="text-blue-600 w-20 h-20 rounded-full mx-auto mb-4 object-cover ring-4 ring-white shadow-lg group-hover/card:scale-110 transition-transform duration-300" />
                  )}

                  <h3 className="text-lg capitalize font-bold text-gray-900 mb-1 group-hover/card:text-blue-600 transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{agent.address}</p>
                  <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    <Award className="w-3 h-3 mr-1" />
                    {agent.profession}
                  </div>
                </div>

                {/* Agent Stats */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        Experience:
                      </span>
                      <span className="font-medium text-gray-900">
                        {agent.experience}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Successful Deals:
                      </span>
                      <span className="font-medium text-gray-900">
                        {agent.deals || 0}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      {/* <button
                        onClick={() => handleMessageAgent(agent.id)}
                        className="flex-1 border border-blue-600 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Message</span>
                      </button>

                      <button
                        onClick={() => handleViewProfile(agent.id)}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Profile
                      </button> */}
                      <Link
                        href={`/agents/${agent._id}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.ceil(displayedAgents.length / 3) }).map(
              (_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 bg-gray-300 rounded-full hover:bg-blue-400 transition-colors cursor-pointer"
                />
              )
            )}
          </div>
        </div>

        {/* Show More/Less Toggle */}
        {/* <div className="text-center mt-8">
          <button
            onClick={() => setShowAllAgents(!showAllAgents)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center mx-auto space-x-2"
          >
            <span>
              {showAllAgents ? "Show Less Agents" : "View More Agents"}
            </span>
            <ArrowRight
              className={`w-4 h-4 transition-transform ${
                showAllAgents ? "rotate-180" : ""
              }`}
            />
          </button>
        </div> */}

        {/* Call to Action Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Need Expert Guidance?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our certified agents are ready to help you find your perfect
            property
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Free Consultation
            </button>
            <Link
              href="/agents"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Find My Agent
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Hint */}
        <div className="sm:hidden mt-4 text-center text-sm text-gray-500">
          Swipe left or right to see more agents
        </div>
      </div>
    </section>
  );
}
