const API_KEY = 'c9cab246cdbe1de159121bd79f7707b9'; // Your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (city) => {
  try {
    const currentWeatherUrl = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    return {
      current: {
        temp_c: currentData.main.temp,
        condition: {
          text: currentData.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`
        }
      },
      forecast: {
        forecastday: processForecastData(forecastData.list)
      }
    };
  } catch (error) {
    console.error('Error in fetchWeatherData:', error);
    throw error;
  }
};

const processForecastData = (forecastList) => {
  const dailyForecasts = {};

  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date,
        day: {
          maxtemp_c: item.main.temp_max,
          mintemp_c: item.main.temp_min,
          condition: {
            text: item.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
          }
        }
      };
    } else {
      dailyForecasts[date].day.maxtemp_c = Math.max(dailyForecasts[date].day.maxtemp_c, item.main.temp_max);
      dailyForecasts[date].day.mintemp_c = Math.min(dailyForecasts[date].day.mintemp_c, item.main.temp_min);
    }
  });

  return Object.values(dailyForecasts).slice(0, 5); // Return only the first 5 days
};