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
                <option value="">All Types</option>
                <option value="electric">Electric</option>
                <option value="mountain">Mountain</option>
                <option value="road">Road</option>
                <option value="city">City</option>
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
                <option value="">All Prices</option>
                <option value="25">Under $25</option>
                <option value="50">under $50</option>
                <option value="100">under $100</option>
                <option value="">Over $100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bikes */}
      <div className="w-full mt-4">
        {loading ? (
          <p className="text-white">Loading bikes...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {bikes.map((bike, index) => (
              <div key={index} className="flex flex-col gap-2 bg-gray-800 rounded-lg p-4 text-white">
                  <span className="w-70 h-40 bg-yellow-400 rounded">
                    {bike.type === "electric" ? (
                      <img src="/assets/bike1.jpg" alt="Electric bike" />
                    ) : bike.type === "mountain" ? (
                      <img src="/assets/bike2.jpg" alt="Mountain bike" />
                    ) : bike.type === "city" ? (
                      <img src="/assets/bike3.jpg" alt="City bike" />
                    ) : (
                      <img src="/assets/bike4.jpg" alt="Other bike" />
                    )}
                  </span>
                <span>{bike.brand} - {bike.model}</span>
                <span>$ {bike.price_per_hour}/hr</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;