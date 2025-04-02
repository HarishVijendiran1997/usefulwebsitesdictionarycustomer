import React, { useState, useEffect } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { useWebsites } from '../contexts/WebsitesContext';

const SearchBar = ({ onSearchResults }) => {
  const [input, setInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { searchAllWebsites } = useWebsites();

  useEffect(() => {
    let isMounted = true;
    const searchDelay = 350; // Optimal debounce time

    const performSearch = async () => {
      if (input.trim().length < 2) {
        if (isMounted) onSearchResults(null);
        return;
      }

      try {
        if (isMounted) setIsSearching(true);
        const results = await searchAllWebsites(input);
        if (isMounted) onSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        if (isMounted) onSearchResults([]);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };

    const timer = setTimeout(performSearch, searchDelay);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [input, searchAllWebsites, onSearchResults]);

  const handleClear = () => {
    setInput('');
    onSearchResults(null);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search titles, tags, or categories..."
          className="w-full py-3 px-5 pr-12 rounded-full border border-gray-700 focus:border-red-500 focus:outline-none bg-gray-900 text-white transition-all duration-200"
          aria-label="Search websites"
        />
        
        {isSearching ? (
          <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-gray-400" />
        ) : input ? (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            ×
          </button>
        ) : (
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        )}
      </div>
      
      {/* Optional search tips */}
      {!input && (
        <p className="text-xs text-gray-500 mt-1 ml-2">
          Try: "design", "AI tools", or "programming"
        </p>
      )}
    </div>
  );
};

export default SearchBar;