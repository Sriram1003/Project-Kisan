const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const analyzeRoute = require('./routes/analyze');

dotenv.config({ path: '../.env' });

// Startup Validation
const REQUIRED_KEYS = ['Openweather_API', 'Plant.id_API_key', 'market_prices_API'];
REQUIRED_KEYS.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ CRITICAL ERROR: Missing ${key} in .env file.`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const { getMandiPrices, getUniversalMandiIntelligence } = require('./services/mandiService');
const { getWeather } = require('./services/weatherService');

// Routes
app.use('/api/analyze', analyzeRoute);

app.get('/api/mandi/universal', async (req, res, next) => {
  try {
    const userCrop = req.query.commodity || null;
    const data = await getUniversalMandiIntelligence(userCrop);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.get('/api/mandi', async (req, res, next) => {
  try {
    const commodity = req.query.commodity || "Cotton";
    const data = await getMandiPrices(commodity);
    res.json({ commodity, markets: data });
  } catch (error) {
    next(error);
  }
});

app.get('/api/weather', async (req, res, next) => {
  try {
    const city = req.query.city || "Karimnagar";
    const data = await getWeather(city);
    res.json({ city, ...data });
  } catch (error) {
    next(error);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(err.response?.status || 500).json({
    error: err.message || "Internal Server Error",
    details: err.response?.data || null
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Kisan AI Backend running on port ${PORT}`);
});
