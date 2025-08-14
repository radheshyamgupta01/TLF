"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  Building,
  Users,
  Calendar,
  CheckCircle,
  MessageCircle,
  Share2,
  Heart,
  Filter,
  Grid,
  List,
  ChevronDown,
  Globe,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormatPrice } from "@/utils/formatPrice";
import InquiryForm from "@/components/property/InquiryForm";
import AgentSchema from "../SeoSetup/AgentSchema";
import ShareButton from "@/utils/ShareButton";
import MainLoader from "../Loaders/MainLoader";
import axiosInstance from "@/lib/axios";

const AgentDetailsPage = ({ params, agentDetails }) => {
  const [agent, setAgent] = useState(agentDetails || null);
  const [properties, setProperties] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ReceProperties");
  const [viewMode, setViewMode] = useState("grid");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [propertyFilters, setPropertyFilters] = useState({
    type: "",
    listingType: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  // Fetch agent details
  // useEffect(() => {
  //   const fetchAgent = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await fetch(`/api/users/${params.id}`);
  //       if (!response.ok) {
  //         throw new Error("Agent not found");
  //       }
  //       const data = await response.json();
  //       setAgent(data.data);
  //     } catch (error) {
  //       console.error("Error fetching agent:", error);
  //       setError(error.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (params.id) {
  //     fetchAgent();
  //   }
  // }, [params.id]);

  // Fetch agent's properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setPropertiesLoading(true);
        const queryParams = new URLSearchParams({
          userId: params.id,
          isActive: "true",
          ...propertyFilters,
        });

        const response = await fetch(`/api/users/listings?${queryParams}`);
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setProperties(data.data.listings || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setPropertiesLoading(false);
      }
    };

    if (params.id) {
      fetchProperties();
    }
  }, [params.id, propertyFilters]);

  const handleFilterChange = (key, value) => {
    setPropertyFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const PropertyCard = ({ property, compact = false }) => (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
        compact ? "flex" : ""
      }`}
    >
      <div className={`relative ${compact ? "w-48 h-32" : "h-64"} bg-gray-200`}>
        {property.images && property.images.length > 0 ? (
          <Image
            src={property.images[0].url}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Building className="w-12 h-12 text-gray-400" />
          </div>
        )}

        <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
          {property.listingType}
        </div>

        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <ShareButton
            title={property.title}
            text="Check out this awesome page!"
            url={`/properties/${property?._id}`}
          />
        </div>
      </div>

      <div className={`p-4 ${compact ? "flex-1" : ""}`}>
        <div className="mb-3">
          <h3
            className={`font-bold text-gray-900 ${
              compact ? "text-lg" : "text-xl"
            } mb-1`}
          >
            {FormatPrice(property.price)}
          </h3>
          <p
            className={`text-gray-600 line-clamp-1 ${compact ? "text-sm" : ""}`}
          >
            {property.title}
          </p>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{property.address}</span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          {property.bedrooms && <span>{property.bedrooms} Beds</span>}
          {property.bathrooms && <span>{property.bathrooms} Baths</span>}
          {property.area && <span>{property.area} sqft</span>}
        </div>

        <Link
          href={`/properties/${property._id}`}
          className="block w-full bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );

  const PropertyFilters = () => (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          value={propertyFilters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="condo">Condo</option>
          <option value="townhouse">Townhouse</option>
        </select>

        <select
          value={propertyFilters.listingType}
          onChange={(e) => handleFilterChange("listingType", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Buy/Rent</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={propertyFilters.minPrice}
          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={propertyFilters.maxPrice}
          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={propertyFilters.sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );

  // if (isLoading) {
  //   return <MainLoader />;
  // }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Agent Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The agent you're looking for doesn't exist."}
          </p>
          <Link
            href="/agents"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Agents
          </Link>
        </div>
      </div>
    );
  }

  // console.log(agentDetails);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Agent Header */}
      <AgentSchema agent={agent} />
      {/* Contact Form Modal */}
      {isFormOpen && (
        <InquiryForm listingId={null} setIsFormOpen={setIsFormOpen} />
      )}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Agent Photo */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                {agent.avatar ? (
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
              {agent.verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                  <CheckCircle className="w-6 h-6" />
                </div>
              )}
            </div>

            {/* Agent Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
                    {agent.name}
                    {agent.isFeatured && (
                      <span className="ml-3 bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </h1>

                  <p className="text-xl text-gray-600 mb-2 capitalize">
                    {agent.role}
                  </p>

                  {agent.specialization && (
                    <p className="text-blue-600 mb-3">{agent.specialization}</p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {renderStars(agent.rating || 0)}
                    </div>
                    <span className="ml-2 text-gray-600">
                      {(agent.rating || 0).toFixed(1)} (
                      {agent.totalReviews || 0} reviews)
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {agent.propertiesCount || 0}
                      </div>
                      <div className="text-sm text-gray-600">Properties</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {agent.experience || 0}
                      </div>
                      <div className="text-sm text-gray-600">Years Exp.</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {agent.totalSales || 0}
                      </div>
                      <div className="text-sm text-gray-600">Sales</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {agent.totalReviews || 0}
                      </div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                  </div>

                  {/* Location & Contact */}
                  <div className="space-y-2">
                    {(agent.city || agent.state) && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>
                          {[agent.city, agent.state].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-2" />
                      <span>{agent.phone || "+91 XXXX XXXXXX"}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-2" />
                      <span>{agent.email || "XXXXXXXXXXXX@XXXXX.XXX"}</span>
                    </div>

                    {agent.website && (
                      <div className="flex items-center text-gray-600">
                        <Globe className="w-5 h-5 mr-2" />
                        <a
                          href={agent.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {agent.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 space-y-3 mt-4 md:mt-0">
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contact Agent
                  </button>
                  <ShareButton
                    title={agent.name}
                    text="Check out this awesome page!"
                    url={`/agents/${agent?._id}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("ReceProperties")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "ReceProperties"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Recent Properties
              </button>
              <button
                onClick={() => setActiveTab("properties")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "properties"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                All Properties ({properties.length})
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "about"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews ({agent.totalReviews || 0})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "ReceProperties" && (
              <div>
                {/* Properties Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recent Properties
                  </h2>
                </div>

                {/* Properties Grid/List */}
                {agentDetails?.recentListings.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No recent properties found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This agent hasn't listed any properties yet.
                    </p>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        : "space-y-4"
                    }
                  >
                    {agentDetails?.recentListings.map((property) => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        compact={viewMode === "list"}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "properties" && (
              <div>
                {/* Properties Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Properties
                  </h2>
                  {/* <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <div className="flex rounded-lg border border-gray-300">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 ${
                          viewMode === "grid"
                            ? "bg-blue-600 text-white"
                            : "text-gray-600"
                        }`}
                      >
                        <Grid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 ${
                          viewMode === "list"
                            ? "bg-blue-600 text-white"
                            : "text-gray-600"
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                  </div> */}
                </div>

                {/* Property Filters */}
                <PropertyFilters />

                {/* Properties Grid/List */}
                {propertiesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-gray-200 rounded-lg h-64 animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No properties found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This agent hasn't listed any properties yet.
                    </p>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        : "space-y-4"
                    }
                  >
                    {properties.map((property) => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        compact={viewMode === "list"}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    About {agent.name}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {agent.bio || "This agent hasn't added a bio yet."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Professional Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">
                          Role: {agent.role}
                        </span>
                      </div>
                      {agent.experience && (
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-700">
                            Experience: {agent.experience} years
                          </span>
                        </div>
                      )}
                      {agent.specialization && (
                        <div className="flex items-center">
                          <Award className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-700">
                            Specialization: {agent.specialization}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">
                          Total Sales: {agent.totalSales || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">
                          {agent.email || "XXXXXXXXXXXX@XXXXX.XXX"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">
                          {agent.phone || "+91 XXXX XXXXXX"}
                        </span>
                      </div>
                      {(agent.city || agent.state) && (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-700">
                            {[agent.city, agent.state]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      {agent.website && (
                        <div className="flex items-center">
                          <Globe className="w-5 h-5 text-gray-400 mr-3" />
                          <a
                            href={agent.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {agent.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Reviews & Ratings
                </h3>
                <div className="text-center py-12">
                  <Star className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No reviews yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Be the first to review this agent.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsPage;
