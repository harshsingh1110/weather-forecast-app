import React, { useState, useEffect } from 'react';
import { WeatherDisplay } from './components/WeatherDisplay';
import { CitySearch } from './components/CitySearch';
import { ForecastDisplay } from './components/ForecastDisplay';
import { TemperatureUnitToggle } from './components/TemperatureUnitToggle';
import { fetchWeatherData } from './utils/api';
import { CircularProgress, Snackbar } from '@mui/material';
import { WiDaySunny } from 'react-icons/wi';
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState(() => {
    const savedCity = localStorage.getItem('lastSearchedCity');
    return savedCity || 'Delhi';
  });
  const [unit, setUnit] = useState('celsius');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (cityName) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isOffline) {
        const cachedData = JSON.parse(localStorage.getItem('weatherData'));
        if (cachedData && cachedData.city === cityName) {
          setWeatherData(cachedData.current);
          setForecastData(cachedData.forecast);
        } else {
          throw new Error('No cached data available for this city');
        }
      } else {
        const data = await fetchWeatherData(cityName);
        setWeatherData(data.current);
        setForecastData(data.forecast);
        localStorage.setItem('weatherData', JSON.stringify({
          city: cityName,
          current: data.current,
          forecast: data.forecast,
        }));
        localStorage.setItem('lastSearchedCity', cityName);
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(`Failed to fetch weather data: ${err.message}`);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCityChange = (newCity) => {
    setCity(newCity);
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
  };

  return (
    <div className="App">
      <header className="App-header">
        <WiDaySunny className="weather-icon" />
        <h1>Weather Forecast</h1>
      </header>
      <main className="main-content">
        <div className='main-content-1'>
          <CitySearch onCityChange={handleCityChange} />
          <TemperatureUnitToggle unit={unit} onUnitChange={handleUnitChange} />
          {isLoading ? (
            <CircularProgress />
          ) : (
            weatherData && (
              <WeatherDisplay weather={weatherData} city={city} unit={unit} />
            )
          )}
        </div>
        {!isLoading && forecastData && (
          <ForecastDisplay forecast={forecastData} unit={unit} />
        )}
      </main>
      <Snackbar
        open={!!error}
        message={error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      />
      {isOffline && (
        <div className="offline-banner">
          You are currently offline. Displaying cached data if available.
        </div>
      )}
    </div>
  );
};

export default App;
