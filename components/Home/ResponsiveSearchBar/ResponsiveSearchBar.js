"use client";
import React, { useState } from "react";
import { QuickSuggestionsList } from "../../Content/QuickSuggestionsList";
import DesktopSearchBar from "./DesktopSearchBar";
import TabletSearchBar from "./TabletSearchBar";
import MobileSearchBar from "./MobileSearchBar";
import MobileExpandedFilters from "./MobileExpandedFilters";
import QuickSuggestions from "./QuickSuggestions";
import SearchResultsSummary from "./SearchResultsSummary";
import { useRouter } from "next/navigation";

const ResponsiveSearchBar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("All Types");
  const [selectedBudget, setSelectedBudget] = useState("Any Budget");
  const router = useRouter();

  const handleSearch = () => {
    const query = new URLSearchParams();

    if (selectedLocation && selectedLocation !== "Select City") {
      query.append("city", selectedLocation);
    }

    if (selectedPropertyType && selectedPropertyType !== "All Types") {
      query.append("propertyType", selectedPropertyType);
    }

    if (selectedBudget && selectedBudget !== "Any Budget") {
      query.append("maxPrice", selectedBudget);
    }

    router.push(`/properties?${query.toString()}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10  mb-10">
      {/* Main Search Container */}
      <div
        className={`bg-white rounded-2xl border-2 transition-all duration-300 ${
          isSearchFocused
            ? "border-blue-400 shadow-2xl shadow-blue-100/50"
            : "border-slate-200 shadow-lg hover:border-slate-300"
        }`}
      >
        {/* Desktop Search Bar */}
        <DesktopSearchBar
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          setIsSearchFocused={setIsSearchFocused}
          selectedPropertyType={selectedPropertyType}
          setSelectedPropertyType={setSelectedPropertyType}
          selectedBudget={selectedBudget}
          setSelectedBudget={setSelectedBudget}
          handleSearch={handleSearch}
        />

        {/* Tablet Search Bar */}
        <TabletSearchBar
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          setIsSearchFocused={setIsSearchFocused}
          selectedPropertyType={selectedPropertyType}
          setSelectedPropertyType={setSelectedPropertyType}
          selectedBudget={selectedBudget}
          setSelectedBudget={setSelectedBudget}
          handleSearch={handleSearch}
        />

        {/* Mobile Search Bar */}
        <MobileSearchBar
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          setIsSearchFocused={setIsSearchFocused}
          handleSearch={handleSearch}
          setShowFilters={setShowFilters}
          showFilters={showFilters}
        />

        {/* Mobile Expanded Filters */}
        <MobileExpandedFilters
          selectedPropertyType={selectedPropertyType}
          setSelectedPropertyType={setSelectedPropertyType}
          selectedBudget={selectedBudget}
          setSelectedBudget={setSelectedBudget}
          setShowFilters={setShowFilters}
          showFilters={showFilters}
          handleSearch={handleSearch}
        />
      </div>

      {/* Quick Suggestions */}
      <QuickSuggestions
        QuickSuggestionsList={QuickSuggestionsList}
        setSelectedLocation={setSelectedLocation}
      />

      {/* Search Results Summary */}
      <SearchResultsSummary
        selectedLocation={selectedLocation}
        selectedPropertyType={selectedPropertyType}
        selectedBudget={selectedBudget}
      />
    </div>
  );
};

export default ResponsiveSearchBar;
