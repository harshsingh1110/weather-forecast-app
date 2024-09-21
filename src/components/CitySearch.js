import React, { useState, useRef, useEffect } from 'react';
import './CitySearch.css';

const CitySearch = ({ onCityChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const fetchCities = async () => {
        try {
          const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchTerm)}&key=a95e37c8544e4b48ada4ea95cb2d9cde`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setCities(data.results); // Adjust based on the actual response structure
          setError(null); // Clear any previous errors
        } catch (error) {
          console.error('Error fetching city data:', error);
          setError('Failed to load city suggestions. Please try again later.');
          setCities([]); // Clear cities on error
        }
      };

      const debounceTimer = setTimeout(() => {
        fetchCities();
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setCities([]);
    }
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onCityChange(searchTerm);
      setIsOpen(false);
    }
  };

  const handleCitySelect = (city) => {
    setSearchTerm(city.formatted_address || city.components.city || city.components.state); // Adjust based on the API response
    onCityChange(city.formatted_address || city.components.city); // Pass the selected city name
    setIsOpen(false);
  };

  return (
    <div className="city-search" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="search-button">
        Search City
      </button>
      {isOpen && (
        <div className="search-modal">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter city name"
              className="search-input"
            />
          </form>
          {error && <div className="error-message">{error}</div>}
          {cities.length > 0 && (
            <ul className="city-list">
              {cities.map((city, index) => (
                <li key={index} onClick={() => handleCitySelect(city)}>
                  {city.formatted_address || city.components.city || city.components.state} {/* Adjust based on the actual API response */}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export { CitySearch };
