import React, { useState, useEffect } from 'react';

const OrderForm = ({ bikeId }) => {
  const [bike, setBike] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const apiCall = async (url, options = {}) => {
    const makeRequest = async (token) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    };

    let accessToken = localStorage.getItem('access_token');
    let response = await makeRequest(accessToken);

    // If token expired, try to refresh
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refresh: refreshToken,
            }),
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem('access_token', data.access);
            response = await makeRequest(data.access);
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return null;
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return null;
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return null;
      }
    }

    return response;
  };

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const response = await apiCall(`http://127.0.0.1:8000/api/bikes/${bikeId}/`);
        if (response.ok) {
          const data = await response.json();
          setBike(data);
        } else {
          console.error('Failed to fetch bike details');
          setError('Failed to load bike information');
        }
      } catch (error) {
        console.error('Error fetching bike:', error);
        setError('Error loading bike details');
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, [bikeId]);

  const calculateDuration = () => {
    if (!startTime || !endTime) return null;
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const calculatePrice = () => {
    if (!bike || !startTime || !endTime) return null;
    
    const duration = calculateDuration();
    if (!duration || duration.hours < 0) return null;
    
    // Minimum 1 hour charge
    const effectiveHours = Math.max(1, duration.hours + (duration.minutes > 0 ? 1 : 0));
    return effectiveHours * bike.hourly_rate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    // Validate dates
    if (new Date(startTime) >= new Date(endTime)) {
      setError('End time must be after start time');
      setSubmitting(false);
      return;
    }
    
    const rentalData = {
      start_time: startTime,
      end_time: endTime,
      bike: bikeId,
    };

    try {
      const response = await apiCall('http://127.0.0.1:8000/api/rentals/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rentalData),
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setStartTime('');
        setEndTime('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create rental');
      }
    } catch (error) {
      console.error('Error submitting rental:', error);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg max-w-md mx-auto mt-10">
        <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin mb-4"></div>
        <p className="text-gray-600">Loading bike details...</p>
      </div>
    );
  }

  const duration = calculateDuration();
  const price = calculatePrice();

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold text-blue-800">Rent {bike?.name}</h2>
        <div className="mt-2 text-sm text-gray-700">
          <p><span className="font-medium">Type:</span> {bike?.type}</p>
          <p><span className="font-medium">Rate:</span> ${bike?.hourly_rate}/hour</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Reservation Details</h3>
        
        <div>
          <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="start_time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            id="end_time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        {(duration || price) && (
          <div className="bg-gray-50 p-3 rounded-md">
            {duration && (
              <p className="text-sm text-gray-700">
                Duration: {duration.hours} hours {duration.minutes} minutes
              </p>
            )}
            {price && (
              <p className="text-base font-medium text-green-600 mt-1">
                Total: ${price.toFixed(2)}
              </p>
            )}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 p-3 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm text-green-700">Rental created successfully!</p>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={submitting || !startTime || !endTime}
          className={`w-full py-2 px-4 rounded-md text-white font-medium focus:outline-none ${
            submitting || !startTime || !endTime
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {submitting ? 'Processing...' : 'Reserve Now'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;