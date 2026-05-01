const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeCrop } = require('../services/cropService');
const { getWeather } = require('../services/weatherService');
const { getMandiPrices } = require('../services/mandiService');
const { getDiseaseRisk, getBestMarket, getTopMarkets, getSuggestion } = require('../utils/riskLogic');

// Security: Limit file size to 5MB and validate mime-types
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  }
});

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    // 1. Core AI Diagnosis (Kindwise API)
    const cropData = await analyzeCrop(req.file.buffer, req.file.originalname);
    
    // Parse Kindwise Response Structure
    const result = cropData?.result || {};
    const diseaseSuggestion = result.disease?.suggestions?.[0];
    
    // Kindwise buries the plant species in different places depending on the model tier
    const cropName = 
      result.crop?.name || 
      result.crop?.suggestions?.[0]?.name || 
      result.classification?.suggestions?.[0]?.name || 
      cropData?.suggestions?.[0]?.plant_name || 
      "Unknown Crop";
      
    const diseaseName = diseaseSuggestion?.name || "Healthy";
    const confidenceScore = diseaseSuggestion?.probability || 0.0;

    // 2. Parallel Context Fetching
    const [weather, mandiData] = await Promise.all([
      getWeather("Karimnagar"),
      getMandiPrices(cropName)
    ]);

    // 3. Logic Layer
    const risk = getDiseaseRisk(weather.humidity);
    const bestMarket = getBestMarket(mandiData);
    const topMarkets = getTopMarkets(mandiData);
    const suggestionLogic = getSuggestion(risk, diseaseName);

    // 4. Final Response
    res.json({
      crop: cropName,
      disease: diseaseName,
      confidence: confidenceScore,
      weather,
      market: {
        bestMarket,
        topMarkets
      },
      risk,
      suggestion: suggestionLogic
    });

  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(401).json({ error: "Invalid API Key for Plant.id or OpenWeather. Please check your .env file." });
    }
    next(error);
  }
});

module.exports = router;
