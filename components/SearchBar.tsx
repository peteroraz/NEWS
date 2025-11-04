
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (country: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [country, setCountry] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (country.trim() && !loading) {
      onSearch(country.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-2xl">
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Enter a country name (e.g., Japan)"
        disabled={loading}
        className="w-full px-5 py-3 text-white bg-gray-700 border border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading || !country.trim()}
        className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
