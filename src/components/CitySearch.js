import React, { useState, useRef, useEffect } from 'react';
import './CitySearch.css';

const CitySearch = ({ onCityChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close the dropdown if clicking outside of it
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
          // Access the API key from .env file
          const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

          // Log the API key to check if it's being accessed correctly
          console.log('Using API Key:', apiKey);

          if (!apiKey) {
            throw new Error('API key is missing. Make sure the .env file is set up correctly.');
          }

          // Make API call to fetch city data
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchTerm)}&appid=${apiKey}`
          );

          // Check if the response is successful
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error Response:', errorData);
            throw new Error(`Error: ${errorData.message || 'Network response was not ok'}`);
          }

          // Parse the data
          const data = await response.json();
          console.log('City Data:', data);

          // If city data is valid, add it to the list
          if (data && data.name) {
            setCities([data]);
          } else {
            setCities([]);
          }
          setError(null); // Clear any previous errors
        } catch (error) {
          // Log and display any errors that occur
          console.error('Error fetching city data:', error);
          setError('Failed to load city suggestions. Please try again later.');
          setCities([]);
        }
      };

      // Add debounce to delay the API call
      const debounceTimer = setTimeout(() => {
        fetchCities();
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setCities([]); // Reset city list when search term is too short
    }
  }, [searchTerm]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onCityChange(searchTerm);
      setIsOpen(false);
    }
  };

  // Handle city selection from the dropdown list
  const handleCitySelect = (city) => {
    const selectedCity = city.name;
    setSearchTerm(selectedCity);
    onCityChange(selectedCity);
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
                  {city.name}
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
