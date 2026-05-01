const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const analyzeRoute = require('./routes/analyze');

// Load .env in local development only — on Render, env vars are set via dashboard
dotenv.config({ path: '../.env' });   // local: reads from project root .env
dotenv.config();                       // fallback: reads from server/.env if present

// Startup Validation (warn, don't crash — Render env vars may load after boot)
const REQUIRED_KEYS = ['VITE_OPENWEATHER_API_KEY', 'VITE_CROP_API_KEY', 'VITE_MANDI_API_KEY'];
REQUIRED_KEYS.forEach(key => {
  if (!process.env[key]) {
    console.warn(`⚠️  WARNING: Missing ${key} — some features may not work.`);
  }
});

const app = express();
const PORT = process.env.PORT || 8000;

// CORS — allow any origin so Netlify frontend can reach this backend
app.use(cors());
app.use(express.json());

const { getMandiPrices, getUniversalMandiIntelligence } = require('./services/mandiService');
const { getWeather } = require('./services/weatherService');

// ── Health Check (Render pings this to keep the service alive) ──────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ──────────────────────────────────────────────────────────────
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

// ── Global Error Handler ────────────────────────────────────────────────────
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
