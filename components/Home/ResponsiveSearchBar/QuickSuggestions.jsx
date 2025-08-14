import React from "react";

const QuickSuggestions = ({ QuickSuggestionsList, setSelectedLocation }) => {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {QuickSuggestionsList.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => setSelectedLocation(suggestion)}
          className="px-3 py-2 sm:px-4 bg-white border border-slate-200 text-slate-600 text-xs sm:text-sm rounded-lg hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all transform hover:scale-105"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default QuickSuggestions;
