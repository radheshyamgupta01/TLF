import React from "react";
import { BudgetRanges } from "@/components/Content/BudgetRanges";
import { LocationsLists } from "@/components/Content/LocationsLists";
import { PropertyTypes } from "@/components/Content/PropertyTypes";
import { MapPin, Home, TrendingUp, Search } from "lucide-react";
import { FormatPrice } from "@/utils/formatPrice";

const TabletSearchBar = ({
  selectedLocation,
  setSelectedLocation,
  setIsSearchFocused,
  selectedPropertyType,
  setSelectedPropertyType,
  selectedBudget,
  setSelectedBudget,
  handleSearch,
}) => {
  return (
    <div className="hidden md:flex lg:hidden">
      {/* Location Input */}
      <div className="flex items-center px-4 py-3 border-r border-slate-200 flex-1">
        <MapPin className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
        <div className="flex flex-col w-full">
          <label className="text-xs text-slate-500 mb-1">Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="text-sm font-medium text-slate-800 focus:outline-none bg-transparent w-full"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          >
            <option value="">Select City</option>
            {LocationsLists.map((location) => (
              <option key={location} value={location}>
                {location.split(",")[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Type Input */}
      <div className="flex items-center px-4 py-3 border-r border-slate-200 flex-1">
        <Home className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
        <div className="flex flex-col w-full">
          <label className="text-xs text-slate-500 mb-1">Property</label>
          <select
            value={selectedPropertyType}
            onChange={(e) => setSelectedPropertyType(e.target.value)}
            className="text-sm font-medium text-slate-800 focus:outline-none bg-transparent w-full"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          >
            {PropertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Budget Input */}
      <div className="flex items-center px-4 py-3 border-r border-slate-200 flex-1">
        <TrendingUp className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
        <div className="flex flex-col w-full">
          <label className="text-xs text-slate-500 mb-1">Budget</label>
          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="text-sm font-medium text-slate-800 focus:outline-none bg-transparent w-full"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          >
            {BudgetRanges.map((budget) => (
              <option key={budget} value={budget}>
                {FormatPrice(budget)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-r-2xl hover:from-blue-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TabletSearchBar;
