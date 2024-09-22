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
          const apiKey = 'c9cab246cdbe1de159121bd79f7707b9'; 
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchTerm)}&appid=${apiKey}`
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          
          if (data && data.name) {
            setCities([data]); 
          } else {
            setCities([]);
          }
          
          setError(null); 
        } catch (error) {
          console.error('Error fetching city data:', error);
          setError('Failed to load city suggestions. Please try again later.');
          setCities([]); 
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
