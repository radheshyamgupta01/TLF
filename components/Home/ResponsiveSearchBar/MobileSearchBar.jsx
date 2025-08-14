import React from "react";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { FormatPrice } from "@/utils/formatPrice";

const MobileSearchBar = ({
  selectedLocation,
  setSelectedLocation,
  setIsSearchFocused,
  handleSearch,
  setShowFilters,
  showFilters,
}) => {
  return (
    <div className="flex md:hidden">
      {/* Location Input */}
      <div className="flex items-center px-3 py-3 flex-1">
        <MapPin className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search location..."
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none w-full"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </div>

      {/* Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="px-3 py-3 text-slate-600 hover:text-blue-600 transition-colors border-l border-slate-200"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-3 rounded-r-2xl hover:from-blue-600 hover:to-teal-600 transition-all"
      >
        <Search className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MobileSearchBar;
