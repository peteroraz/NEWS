import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (country: string, startDate: string, endDate: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (country.trim() && !loading) {
      onSearch(country.trim(), startDate, endDate);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-4xl">
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Enter a country name (e.g., Japan)"
        disabled={loading}
        className="w-full px-5 py-3 text-white bg-gray-700 border border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 outline-none disabled:opacity-50"
      />
      <div className="flex gap-2 w-full sm:w-auto">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={loading}
          title="Start date for news search. Leave blank for no start limit."
          className="w-full px-5 py-3 text-white bg-gray-700 border border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 outline-none disabled:opacity-50 [color-scheme:dark]"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={loading}
          title="End date for news search. Leave blank for latest news."
          className="w-full px-5 py-3 text-white bg-gray-700 border border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 outline-none disabled:opacity-50 [color-scheme:dark]"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !country.trim()}
        className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;