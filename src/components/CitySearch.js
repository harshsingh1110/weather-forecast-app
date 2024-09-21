import React, { useState, useRef, useEffect } from 'react';
import './CitySearch.css';

const CitySearch = ({ onCityChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
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
      // This is a mock API call. In a real application, you would call an actual API here.
      const mockApiCall = setTimeout(() => {
        const mockCities = [
          `${searchTerm} City`,
          `${searchTerm}ville`,
          `${searchTerm} Town`,
          `New ${searchTerm}`,
          `${searchTerm}opolis`
        ];
        setCities(mockCities);
      }, 300);

      return () => clearTimeout(mockApiCall);
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
    setSearchTerm(city);
    onCityChange(city);
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
          {cities.length > 0 && (
            <ul className="city-list">
              {cities.map((city, index) => (
                <li key={index} onClick={() => handleCitySelect(city)}>
                  {city}
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