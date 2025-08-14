"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Filter,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PropertyListingSchema from "@/components/SeoSetup/PropertyListingSchema";
import BreadcrumbSchema from "@/components/SeoSetup/BreadcrumbSchema";
import FAQSchema from "@/components/SeoSetup/FAQSchema";
import Properties from "@/components/property/Properties";

// Filter Panel Component
const FilterPanel = ({
  onClose,
  filters,
  setFilters,
  onApplyFilters,
  onClearFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    setFilters(localFilters);
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      listingType: "",
      bedrooms: "",
      bathrooms: "",
      minArea: "",
      maxArea: "",
      furnishing: "",
      city: "",
      state: "",
      locality: "",
      parking: "",
      amenities: [],
      userType: "",
      isVerified: "",
      isFeatured: "",
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    onClearFilters();
    onClose();
  };

  return (
    <div className="border-slate-200 shadow bg-white p-6 md:rounded-lg md:border h-fit sticky top-32 max-h-[calc(100vh-150px)] md:max-h-fit overflow-y-auto">
      <div className="hidden md:flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range (₹)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min Price"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={localFilters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max Price"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={localFilters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={localFilters.propertyType}
          onChange={(e) => handleFilterChange("propertyType", e.target.value)}
        >
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
          <option value="office">Office</option>
          <option value="shop">Shop</option>
          <option value="warehouse">Warehouse</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Listing Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Listing Type
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={localFilters.listingType}
          onChange={(e) => handleFilterChange("listingType", e.target.value)}
        >
          <option value="">All Types</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
          <option value="lease">For Lease</option>
        </select>
      </div>

      {/* Location Filters */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <input
          type="text"
          placeholder="Enter city"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={localFilters.city}
          onChange={(e) => handleFilterChange("city", e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State
        </label>
        <input
          type="text"
          placeholder="Enter state"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={localFilters.state}
          onChange={(e) => handleFilterChange("state", e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Locality
        </label>
        <input
          type="text"
          placeholder="Enter locality"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={localFilters.locality}
          onChange={(e) => handleFilterChange("locality", e.target.value)}
        />
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bedrooms
        </label>
        <div className="grid grid-cols-4 gap-2">
          {["1", "2", "3", "4+"].map((bed) => (
            <button
              key={bed}
              className={`px-3 py-2 text-sm rounded-md border ${
                localFilters.bedrooms === bed
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() =>
                handleFilterChange(
                  "bedrooms",
                  bed === localFilters.bedrooms ? "" : bed
                )
              }
            >
              {bed}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bathrooms
        </label>
        <div className="grid grid-cols-4 gap-2">
          {["1", "2", "3", "4+"].map((bath) => (
            <button
              key={bath}
              className={`px-3 py-2 text-sm rounded-md border ${
                localFilters.bathrooms === bath
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() =>
                handleFilterChange(
                  "bathrooms",
                  bath === localFilters.bathrooms ? "" : bath
                )
              }
            >
              {bath}
            </button>
          ))}
        </div>
      </div>

      {/* Area Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Area Range (sq ft)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min Area"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={localFilters.minArea}
            onChange={(e) => handleFilterChange("minArea", e.target.value)}
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max Area"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={localFilters.maxArea}
            onChange={(e) => handleFilterChange("maxArea", e.target.value)}
          />
        </div>
      </div>

      {/* Furnishing */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Furnishing
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={localFilters.furnishing}
          onChange={(e) => handleFilterChange("furnishing", e.target.value)}
        >
          <option value="">All Types</option>
          <option value="fully-furnished">Fully Furnished</option>
          <option value="semi-furnished">Semi Furnished</option>
          <option value="unfurnished">Unfurnished</option>
        </select>
      </div>

      {/* Parking */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parking Spaces
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={localFilters.parking}
          onChange={(e) => handleFilterChange("parking", e.target.value)}
        >
          <option value="">Any</option>
          <option value="0">No Parking</option>
          <option value="1">1 Space</option>
          <option value="2">2 Spaces</option>
          <option value="3">3+ Spaces</option>
        </select>
      </div>

      {/* User Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Listed By
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={localFilters.userType}
          onChange={(e) => handleFilterChange("userType", e.target.value)}
        >
          <option value="">All</option>
          <option value="owner">Owner</option>
          <option value="agent">Agent</option>
          <option value="developer">Developer</option>
        </select>
      </div>

      {/* Verified Properties */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Status
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={localFilters.isVerified === "true"}
              onChange={(e) =>
                handleFilterChange("isVerified", e.target.checked ? "true" : "")
              }
            />
            <span className="text-sm">Verified Properties Only</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={localFilters.isFeatured === "true"}
              onChange={(e) =>
                handleFilterChange("isFeatured", e.target.checked ? "true" : "")
              }
            />
            <span className="text-sm">Featured Properties Only</span>
          </label>
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={handleApply}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Apply Filters
      </button>

      {/* Clear Filters */}
      <button
        onClick={handleClear}
        className="w-full mt-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
};

// Agent Card Component
const AgentCard = ({ agent }) => {
  // console.log(agent);
  return (
    <div className="bg-gray-100 border-slate-200 shadow rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        <Image
          width={500}
          height={500}
          src={agent.avatar}
          alt={agent.name}
          className="w-12 h-12 rounded-full object-cover mr-3"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{agent.name}</h4>
          <p className="text-sm text-gray-600">{agent.profession}</p>
        </div>
      </div>
      <div className="flex items-center mb-2">
        <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
        <span className="text-sm text-gray-600">
          {agent.rating} ({agent.totalReviews} reviews)
        </span>
      </div>

      <div className="flex items-center mb-2">
        <span className="text-sm text-gray-600">{agent.address}</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        {agent.propertiesCount} properties listed
      </p>
      <div className="flex space-x-2">
        {/* <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center justify-center">
          <Phone className="w-3 h-3 mr-1" />
          Call
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm hover:bg-gray-200 transition-colors flex items-center justify-center">
          <Mail className="w-3 h-3 mr-1" />
          Email
        </button> */}
        <Link
          href={`/agents/${agent._id}`}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md text-sm ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// Main Dashboard Component
const PropertyDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAgentList, setShowAgentList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    listingType: "",
    bedrooms: "",
    bathrooms: "",
    minArea: "",
    maxArea: "",
    furnishing: "",
    city: "",
    state: "",
    locality: "",
    parking: "",
    amenities: [],
    userType: "",
    verified: "",
    isFeatured: "",
  });
  const searchParams = useSearchParams();

  const itemsPerPage = 12;
  // Fetch properties with filters

  useEffect(() => {
    const queryFilters = {};

    if (searchParams.get("city")) {
      queryFilters.city = searchParams.get("city");
    }
    if (searchParams.get("propertyType")) {
      queryFilters.propertyType = searchParams.get("propertyType");
    }
    if (searchParams.get("maxPrice")) {
      queryFilters.maxPrice = searchParams.get("maxPrice");
    }

    fetchProperties(1, "", queryFilters);
    setFilters((prev) => ({
      ...prev,
      ...queryFilters,
    }));
  }, [searchParams]);

  const fetchProperties = async (
    page = 1,
    searchQuery = "",
    appliedFilters = filters,
    sortOrder = sortBy
  ) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        sort: sortOrder,
        ...(searchQuery && { search: searchQuery }),
        ...Object.entries(appliedFilters).reduce((acc, [key, value]) => {
          if (
            value &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0)
          ) {
            acc[key] = Array.isArray(value) ? value.join(",") : value;
          }
          return acc;
        }, {}),
      });

      const response = await fetch(`/api/listings?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setProperties(data.data.listings);
        setTotalProperties(data.data.pagination.total);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        console.error("Failed to fetch properties:", data.message);
        setProperties([]);
        setTotalProperties(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
      setTotalProperties(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured agents
  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/users?featured=true&limit=10");
      const data = await response.json();

      if (data.success) {
        setAgents(data.data.users);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProperties();
    fetchAgents();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    fetchProperties(1, value, filters, sortBy);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    setCurrentPage(1);
    fetchProperties(1, searchTerm, filters, value);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProperties(page, searchTerm, filters, sortBy);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle filter application
  const handleApplyFilters = (appliedFilters) => {
    setCurrentPage(1);
    fetchProperties(1, searchTerm, appliedFilters, sortBy);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setCurrentPage(1);
    fetchProperties(1, searchTerm, {}, sortBy);
  };

  const breadcrumbs = [
    { name: "Home", url: "https://cpmarket.in" },
    { name: "Properties", url: "https://cpmarket.in/properties" },
  ];

  const propertyFAQs = [
    {
      question: "How are properties verified on cpmarket?",
      answer:
        "All properties undergo a comprehensive verification process including document checks, physical inspection, and agent verification to ensure authenticity.",
    },
    {
      question: "Can I schedule property visits online?",
      answer:
        "Yes, you can schedule property visits directly through our platform. Contact the listing agent or use our booking system to arrange viewings.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      {/* Search Bar - Fixed below header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location, project name, title..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="area-low">Area: Low to High</option>
              <option value="area-high">Area: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-4 py-3">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div
            className={`w-80 flex-shrink-0 ${
              showFilters
                ? "fixed inset-0 z-50 bg-black bg-opacity-50 lg:relative lg:bg-transparent lg:z-auto"
                : "hidden lg:block"
            }`}
          >
            <div
              className={`${
                showFilters
                  ? "absolute right-0 top-0 w-80 h-full bg-white lg:relative lg:w-auto"
                  : ""
              }`}
            >
              <div className="md:hidden flex items-center justify-between p-6 border-b">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    RealEstate Pro
                  </h1>
                  <span className="text-xs text-blue-600 font-medium">
                    Admin Panel
                  </span>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterPanel
                onClose={() => setShowFilters(false)}
                filters={filters}
                setFilters={setFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Middle Section - Property Cards */}
          <div className="flex-1 min-w-0">
            {totalProperties > 0 && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {totalProperties} Properties Found
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    Filters
                  </button>
                  {/* <button
                onClick={() => setShowAgentList(true)}
                className="xl:hidden flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                <User className="w-4 h-4 mr-1" />
                Agents
              </button>
              <button className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Post Property
              </button> */}
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No properties found matching your criteria.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {properties.map((property) => (
                    <Properties
                      key={property._id}
                      property={property}
                      isFavorite={isFavorite}
                      setIsFavorite={setIsFavorite}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>

          {/* Right Sidebar - Agents */}
          <div
            className={`w-80 flex-shrink-0 ${
              showAgentList
                ? "fixed inset-0 z-50 bg-black bg-opacity-50 xl:relative xl:bg-transparent xl:z-auto"
                : "hidden xl:block"
            }`}
          >
            <div
              className={`${
                showAgentList
                  ? "absolute right-0 top-0 w-80 h-full bg-gray-50 xl:relative xl:w-auto xl:bg-transparent"
                  : ""
              }`}
            >
              <div className="bg-white rounded-lg border-slate-200 shadow border p-4 sticky top-32">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Top Agents
                  </h3>
                  <button
                    onClick={() => setShowAgentList(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 md:max-h-fit max-h-96 overflow-y-auto">
                  {agents.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No featured agents available.
                    </p>
                  ) : (
                    agents.map((agent) => (
                      <AgentCard key={agent._id} agent={agent} />
                    ))
                  )}
                </div>
                <div className="w-full mt-4 bg-gray-100 text-center text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                  <Link href="/agents" className="text-center">
                    View All Agents
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PropertyListingSchema
        properties={properties}
        page={searchParams.page}
        totalCount={properties.totalCount}
        location={searchParams.location}
      />
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <FAQSchema faqs={propertyFAQs} />
    </div>
  );
};

export default PropertyDashboard;
