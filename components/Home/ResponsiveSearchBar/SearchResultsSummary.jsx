import React, { Fragment } from "react";

const SearchResultsSummary = ({
  selectedLocation,
  selectedPropertyType,
  selectedBudget,
}) => {
  return (
    <Fragment>
      {(selectedLocation ||
        selectedPropertyType !== "All Types" ||
        selectedBudget !== "Any Budget") && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-600">Searching for:</span>
            {selectedLocation && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                📍 {selectedLocation}
              </span>
            )}
            {selectedPropertyType !== "All Types" && (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs">
                🏠 {selectedPropertyType}
              </span>
            )}
            {selectedBudget !== "Any Budget" && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs">
                💰 {selectedBudget}
              </span>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default SearchResultsSummary;
