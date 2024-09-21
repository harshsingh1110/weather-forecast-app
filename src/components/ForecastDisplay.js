import React from 'react';

const ForecastDisplay = ({ forecast, unit }) => {
  if (!forecast || !forecast.forecastday) {
    return <div className="forecast-display">Loading forecast data...</div>;
  }

  return (
    <div className="forecast-display">
      <h3>5-Day Forecast</h3>
      <div className="forecast-cards">
        {forecast.forecastday.map((day) => (
          <ForecastCard key={day.date} day={day} unit={unit} />
        ))}
      </div>
    </div>
  );
};

const ForecastCard = ({ day, unit }) => {
  if (!day || !day.day) {
    return null;
  }

  // Use Celsius temperatures directly if available
  const highTempC = day.day.maxtemp_c;
  const lowTempC = day.day.mintemp_c;

  // Calculate Fahrenheit if necessary
  const highTemp = unit === 'celsius' ? highTempC : (highTempC * 9/5) + 32;
  const lowTemp = unit === 'celsius' ? lowTempC : (lowTempC * 9/5) + 32;

  return (
    <div className="forecast-card">
      <p className="day">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
      {day.day.condition?.icon && (
        <img src={day.day.condition.icon} alt={day.day.condition.text} className="forecast-icon" />
      )}
      <p className="high-temp">
        High: {highTemp !== undefined ? `${highTemp.toFixed(1)}°${unit === 'celsius' ? 'C' : 'F'}` : 'N/A'}
      </p>
      <p className="low-temp">
        Low: {lowTemp !== undefined ? `${lowTemp.toFixed(1)}°${unit === 'celsius' ? 'C' : 'F'}` : 'N/A'}
      </p>
    </div>
  );
};


export { ForecastDisplay };
