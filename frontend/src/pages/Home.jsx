import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState({
    type: "",
    price: "",
    search: ""
  });
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      const query = new URLSearchParams({
        type: selectedFilter.type,
        price: selectedFilter.price,
        search: searchTerm,
      }).toString();

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/bikes/?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bikes');
        }

        const data = await response.json();
        setBikes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bikes:', error);
        setLoading(false);
      }
    };

    fetchBikes();
  }, [searchTerm, selectedFilter]);

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
    <div className="min-h-screen bg-white p-4 md:p-8">
      {/* Header Section */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-800 mb-2">Find Your Perfect Ride</h1>
        <p className="text-cyan-600">Explore our cool bike collections</p>
      </header>

      {/* Search and Filter Section */}
      <div className="py-4 mb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Search bar */}
          <div className="w-full relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-cyan-500" />
            </div>
            <input
              type="text"
              placeholder="Search by brand ..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-4 pl-12 rounded-xl border border-cyan-200 bg-white text-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-cyan-700 mb-1">Bike Type</label>
              <select
                name="type"
                value={selectedFilter.type}
                onChange={handleFilterChange}
                className="w-full p-3 rounded-lg border border-cyan-200 bg-white text-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm"
              >
                <option value="">All Types</option>
                <option value="electric">Electric</option>
                <option value="mountain">Mountain</option>
                <option value="road">Road</option>
                <option value="city">City</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-cyan-700 mb-1">Price Range</label>
              <select
                name="price"
                value={selectedFilter.price}
                onChange={handleFilterChange}
                className="w-full p-3 rounded-lg border border-cyan-200 bg-white text-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm"
              >
                <option value="">All Prices</option>
                <option value="25">Under $25</option>
                <option value="50">Under $50</option>
                <option value="100">Under $100</option>
                <option value="">Over $100</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Bikes Grid */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : bikes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl text-cyan-800">No bikes found</h3>
            <p className="text-cyan-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bikes.map((bike, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-cyan-100 flex items-center justify-center overflow-hidden">
                  {bike.type === "electric" ? (
                    <img src="/assets/bike1.jpg" alt="Electric bike" className="w-full h-full object-cover" />
                  ) : bike.type === "mountain" ? (
                    <img src="/assets/bike2.jpg" alt="Mountain bike" className="w-full h-full object-cover" />
                  ) : bike.type === "city" ? (
                    <img src="/assets/bike3.jpg" alt="City bike" className="w-full h-full object-cover" />
                  ) : (
                    <img src="/assets/bike4.jpg" alt="Other bike" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-cyan-900 text-lg">{bike.brand} {bike.model}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="inline-block bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full capitalize">
                      {bike.type}
                    </span>
                    <span className="font-bold text-cyan-700">${bike.price_per_hour}<span className="text-sm font-normal text-cyan-500">/hr</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;