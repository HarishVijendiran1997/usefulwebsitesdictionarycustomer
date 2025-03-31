import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[400px]">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by title, category or tags..."
          className="border border-gray-700 rounded-full py-2 px-4 pr-12 w-full focus:outline-none focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
          >
            <FaSearch className="text-gray-500 cursor-pointer hover:text-blue-500" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;