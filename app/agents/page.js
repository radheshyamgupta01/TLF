"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Star, MapPin, Award, Building, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AgentsListingSchema from "@/components/SeoSetup/AgentsListingSchema";
import BreadcrumbSchema from "@/components/SeoSetup/BreadcrumbSchema";

const AgentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    specialization: searchParams.get("specialization") || "",
    featured: searchParams.get("featured") || "",
    sort: searchParams.get("sort") || "rating",
    page: parseInt(searchParams.get("page")) || 1,
    limit: 9,
  });

  // Fetch agents
  const fetchAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/users?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch agents");
      }

      const data = await response.json();
      setAgents(data.data.users);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error("Error fetching agents:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Update URL when filters change
  useEffect(() => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== "limit") queryParams.append(key, value);
    });

    const newUrl = `/agents${queryParams.toString() ? `?${queryParams}` : ""}`;
    router.push(newUrl, { scroll: false });
  }, [filters, router]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset page when other filters change
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      city: "",
      state: "",
      specialization: "",
      featured: "",
      sort: "rating",
      page: 1,
      limit: 12,
    });
  };

  const handlePageChange = (newPage) => {
    handleFilterChange("page", newPage);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const AgentCard = ({ agent }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
          {agent.avatar ? (
            <Image
              src={agent.avatar}
              alt={agent.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Users className="w-16 h-16 text-white opacity-80" />
            </div>
          )}
        </div>

        {agent.isVerified && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            <Award className="w-3 h-3 inline mr-1" />
            Verified
          </div>
        )}

        {agent.isFeatured && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 capitalize">
            {agent.name}
          </h3>
          <p className="text-gray-600 text-sm capitalize">{agent.role}</p>
          {agent.profession && (
            <p className="text-blue-600 text-sm mt-1">
              {agent.profession || "Not provided"}
            </p>
          )}
        </div>

        <div className="flex items-center mb-3">
          <div className="flex items-center">{renderStars(agent.rating)}</div>
          <span className="ml-2 text-sm text-gray-600">
            {agent.rating.toFixed(1)} ({agent.totalReviews} reviews)
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {agent.address && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{agent.address}</span>
            </div>
          )}
          {/* {(agent.city || agent.state) && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              <span>
                {[agent.city, agent.state].filter(Boolean).join(", ")}
              </span>
            </div>
          )} */}

          <div className="flex items-center text-gray-600 text-sm">
            <Building className="w-4 h-4 mr-2" />
            <span>{agent.propertiesCount} Properties</span>
          </div>

          {agent.experience && (
            <div className="flex items-center text-gray-600 text-sm">
              <Award className="w-4 h-4 mr-2" />
              <span>{agent.experience} years experience</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Link
            href={`/agents/${agent._id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
          >
            View Profile
          </Link>
          {/* <a
            href={`tel:${agent.phone}`}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Phone className="w-5 h-5 text-gray-600" />
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-5 h-5 text-gray-600" />
          </a> */}
        </div>
      </div>
    </div>
  );

  const FilterSidebar = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {(filters.search ||
          filters.city ||
          filters.state ||
          filters.specialization ||
          filters.featured) && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Agents
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            placeholder="Enter city..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            value={filters.state}
            onChange={(e) => handleFilterChange("state", e.target.value)}
            placeholder="Enter state..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization
          </label>
          <select
            value={filters.specialization}
            onChange={(e) =>
              handleFilterChange("specialization", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Specializations</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="luxury">Luxury Properties</option>
            <option value="investment">Investment Properties</option>
            <option value="rental">Rental Properties</option>
          </select>
        </div>

        {/* Featured */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.featured === "true"}
              onChange={(e) =>
                handleFilterChange("featured", e.target.checked ? "true" : "")
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Featured Agents Only
            </span>
          </label>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
            <option value="experience">Most Experienced</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const Pagination = () => {
    if (!pagination.totalPages || pagination.totalPages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 5;
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 border rounded-lg ${
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAgents}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { name: "Home", url: "https://cpmarket.in" },
    { name: "Agents", url: "https://cpmarket.in/agents" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      {/* Header */}
      {/* <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Find Real Estate Agents
              </h1>
              <p className="text-gray-600 mt-2">
                Connect with professional agents in your area
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </button>

              {pagination.total && (
                <span className="text-sm text-gray-600">
                  {pagination.total} agents found
                </span>
              )}
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:col-span-1 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg animate-pulse"
                  >
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No agents found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agents.map((agent) => (
                    <AgentCard key={agent._id} agent={agent} />
                  ))}
                </div>
                <Pagination />
              </>
            )}
          </div>
        </div>
      </div>
      <AgentsListingSchema
        agents={agents}
        page={searchParams.page}
        totalCount={agents.totalCount}
        location={searchParams.location}
      />
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
    </div>
  );
};

export default AgentsPage;
