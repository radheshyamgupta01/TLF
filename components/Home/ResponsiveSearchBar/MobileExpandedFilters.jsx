import { BudgetRanges } from "@/components/Content/BudgetRanges";
import { PropertyTypes } from "@/components/Content/PropertyTypes";
import { Home, TrendingUp, X } from "lucide-react";
import React, { Fragment } from "react";

const MobileExpandedFilters = ({
  selectedPropertyType,
  setSelectedPropertyType,
  selectedBudget,
  setSelectedBudget,
  setShowFilters,
  showFilters,
}) => {
  return (
    <Fragment>
      {showFilters && (
        <div className="border-t border-slate-200 p-4 md:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Property Type */}
            <div className="flex items-center">
              <Home className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
              <div className="flex flex-col w-full">
                <label className="text-xs text-slate-500 mb-1">
                  Property Type
                </label>
                <select
                  value={selectedPropertyType}
                  onChange={(e) => setSelectedPropertyType(e.target.value)}
                  className="text-sm font-medium text-slate-800 focus:outline-none bg-transparent w-full border border-slate-200 rounded-lg px-2 py-1"
                >
                  {PropertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
              <div className="flex flex-col w-full">
                <label className="text-xs text-slate-500 mb-1">Budget</label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="text-sm font-medium text-slate-800 focus:outline-none bg-transparent w-full border border-slate-200 rounded-lg px-2 py-1"
                >
                  {BudgetRanges.map((budget) => (
                    <option key={budget} value={budget}>
                      {FormatPrice(budget)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Close Filters Button */}
          <button
            onClick={() => setShowFilters(false)}
            className="mt-3 flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            Close Filters
          </button>
        </div>
      )}
    </Fragment>
  );
};

export default MobileExpandedFilters;
