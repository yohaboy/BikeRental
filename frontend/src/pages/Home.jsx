import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState({
    type: "all",
    price: "all",
    availability: "all"
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-start bg-gray-900">
      <div className="sticky top-16 z-10 w-full bg-gray-900 pt-16 pb-4">
        <div className="w-full max-w-screen mx-auto px-4">
        {/* Search bar */}
          <div className="w-full max-w-screen relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-4 pl-10 rounded-xl border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        {/* Filters */}
          <div className="flex gap-4 w-full max-w-screen">
            {/* Type Filter */}
            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
              <select
                name="type"
                value={selectedFilter.type}
                onChange={handleFilterChange}
                className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="home">Home & Garden</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
              <select
                name="price"
                value={selectedFilter.price}
                onChange={handleFilterChange}
                className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="under25">Under $25</option>
                <option value="25to50">$25 - $50</option>
                <option value="50to100">$50 - $100</option>
                <option value="over100">Over $100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* biks */}
      <div className="w-full mt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 38 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2 bg-gray-800 rounded-lg p-4 text-white">
              <span className='w-70 h-40 bg-yellow-400 rounded'>Image</span>
              <span>Mountain Bike - XF series-4</span>
              <span>15$/hour</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;