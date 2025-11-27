import React, { useState } from "react";
import { Search, X } from "lucide-react";

/**
 * Search location component for finding and navigating to specific coordinates
 * @param {Object} props
 * @param {Function} props.onLocationSelect - Callback when location is selected
 */
const SearchLocation = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Using Nominatim (OpenStreetMap) geocoding API
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`);
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSelectLocation = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    onLocationSelect([lat, lng]);
    setSearchQuery(result.display_name);
    setShowResults(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Prevent keyboard shortcuts when typing in search input
  const handleKeyDown = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="absolute top-2.5 left-2.5 z-1001 w-80">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search location..."
            className="w-full pl-10 pr-10 py-2.5 bg-white/95 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {searchQuery && (
            <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto border border-gray-200">
            {searchResults.map((result, index) => (
              <button key={index} onClick={() => handleSelectLocation(result)} className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors">
                <div className="flex items-start gap-2">
                  <Search className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{result.display_name.split(",")[0]}</p>
                    <p className="text-xs text-gray-500 truncate">{result.display_name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      📍 {parseFloat(result.lat).toFixed(6)}, {parseFloat(result.lon).toFixed(6)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {showResults && searchResults.length === 0 && !isSearching && searchQuery.length >= 3 && (
          <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg px-4 py-3 border border-gray-200">
            <p className="text-sm text-gray-500 text-center">No locations found</p>
          </div>
        )}

        {/* Loading */}
        {isSearching && (
          <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg px-4 py-3 border border-gray-200">
            <p className="text-sm text-gray-500 text-center">Searching...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchLocation;
