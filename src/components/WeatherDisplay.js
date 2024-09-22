import React from 'react';

const WeatherDisplay = ({ weather, city, unit }) => {
  if (!weather) {
    return <div className="weather-display">No weather data available</div>;
  }

  const temperature = unit === 'celsius'
    ? weather.temp_c
    : (weather.temp_c * 9/5) + 32;

  return (
    <div className="weather-display">
      <h2>{city}</h2>
      <p className="temperature">
        {temperature !== undefined ? `${temperature.toFixed(1)}°${unit === 'celsius' ? 'C' : 'F'}` : 'N/A'}
      </p>
      <p className="condition">{weather.condition?.text || 'N/A'}</p>
      {weather.condition?.icon && (
        <img src={weather.condition.icon} alt={weather.condition.text} className="weather-icon" />
      )}
    </div>
  );
};

export { WeatherDisplay };