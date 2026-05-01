const axios = require('axios');

let weatherCache = { data: null, timestamp: 0 };

exports.getWeather = async (district = 'Karimnagar') => {
  const now = Date.now();
  if (weatherCache.data && now - weatherCache.timestamp < 10 * 60 * 1000) {
    return weatherCache.data;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${district},IN&appid=${process.env.VITE_OPENWEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    
    console.log("DEBUG: OpenWeather API Response:", JSON.stringify(response.data));

    const result = {
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      condition: response.data.weather[0].description
    };

    console.log("DEBUG: Returned Weather Object:", result);

    weatherCache = {
      data: result,
      timestamp: Date.now()
    };
    return result;
  } catch (error) {
    console.error("DEBUG: Weather API Error:", error.response?.data || error.message);
    return { temp: 0, humidity: 0, condition: "Unknown" };
  }
};
