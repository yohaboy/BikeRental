import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
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
    <div className="flex flex-col gap-8 items-center justify-start mt-18 bg-gray-900">
        <div className="w-full max-w-screen relative">
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

        <div>Actual Body</div>
    </div>
  );
}

export default HomePage;