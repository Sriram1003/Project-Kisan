// server/utils/riskLogic.js
exports.getDiseaseRisk = (humidity) => {
  if (humidity > 75) return "HIGH - High fungal risk";
  if (humidity >= 60) return "MEDIUM - Moderate risk";
  return "LOW - Optimal conditions";
};

exports.getBestMarket = (markets) => {
  if (!markets || markets.length === 0) return "N/A";
  return markets.reduce((prev, current) => 
    (parseInt(prev.modal_price) > parseInt(current.modal_price)) ? prev : current
  ).market;
};

// server/services/weatherService.js
const axios = require('axios');
let weatherCache = { data: null, timestamp: 0 };

exports.getWeather = async (district = "Karimnagar") => {
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  if (weatherCache.data && (Date.now() - weatherCache.timestamp < CACHE_DURATION)) {
    return weatherCache.data;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${district},IN&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
  const response = await axios.get(url);
  
  weatherCache = {
    data: {
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      condition: response.data.weather[0].main
    },
    timestamp: Date.now()
  };
  return weatherCache.data;
};

// server/services/mandiService.js
const axios = require('axios');

exports.getMandiPrices = async (cropName) => {
  const url = `https://api.data.gov.in/resource/9ef27c4f-a285-4dec-ad31-3a3a83a35525?api-key=${process.env.DATA_GOV_API_KEY}&format=json&filters[State]=Telangana&filters[Commodity]=${cropName}`;
  
  try {
    const response = await axios.get(url);
    const records = response.data.records || [];
    
    // Return top 3 sorted by price
    return records
      .map(r => ({ market: r.market, modal_price: r.modal_price }))
      .sort((a, b) => b.modal_price - a.modal_price)
      .slice(0, 3);
  } catch (error) {
    console.error("Mandi API Error:", error.message);
    return [];
  }
};
