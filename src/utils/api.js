// weatherApi.js
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (city) => {
  try {
    // Access the API key from the environment variable
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    const currentWeatherUrl = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    // Fetch both current and forecast data simultaneously
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    // Check for errors in the API response
    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    // Parse the responses into JSON
    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    // Return processed data
    return {
      current: {
        temp_c: currentData.main.temp,
        condition: {
          text: currentData.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
        },
      },
      forecast: {
        forecastday: processForecastData(forecastData.list),
      },
    };
  } catch (error) {
    console.error('Error in fetchWeatherData:', error);
    throw error;
  }
};

// Function to process and group forecast data by day
const processForecastData = (forecastList) => {
  const dailyForecasts = {};

  // Iterate through each forecast item in the list
  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0]; // Convert timestamp to date
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date,
        day: {
          maxtemp_c: item.main.temp_max,
          mintemp_c: item.main.temp_min,
          condition: {
            text: item.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          },
        },
      };
    } else {
      // Update max and min temperatures for the day
      dailyForecasts[date].day.maxtemp_c = Math.max(
        dailyForecasts[date].day.maxtemp_c,
        item.main.temp_max
      );
      dailyForecasts[date].day.mintemp_c = Math.min(
        dailyForecasts[date].day.mintemp_c,
        item.main.temp_min
      );
    }
  });

  // Return only the first 5 days of forecast data
  return Object.values(dailyForecasts).slice(0, 5);
};
