const axios = require('axios');

const RESOURCE_ID = "35985678-0d79-46b4-9ed6-6f13308a1d24";
const mandiCache = new Map(); // Key: Commodity, Value: { data, expiry }

const VEGETABLE_LIST = [
  'Tomato', 'Potato', 'Onion', 'Ladies Finger', 'Bhindi(Ladies Finger)', 
  'Brinjal', 'Bitter Gourd', 'Bottle Gourd', 'Cabbage', 'Cauliflower', 
  'Green Chilli', 'Capsicum', 'Carrot', 'Cucumber', 'Drumstick', 
  'Ginger(Green)', 'Garlic', 'Pumpkin', 'Sweet Potato', 'Spinach'
];

exports.getUniversalMandiIntelligence = async (userCrop = null) => {
  const cacheKey = 'universal_intelligence';
  const now = Date.now();
  const cached = mandiCache.get(cacheKey);

  if (cached && now < cached.expiry) {
    return cached.data;
  }

  // Fetch all records for Telangana to analyze the whole market
  const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${process.env.VITE_MANDI_API_KEY}&format=json&limit=1000&filters[State]=Telangana`;

  try {
    const response = await axios.get(url);
    const records = response.data.records || [];
    
    // 1. Group by Commodity and find best market per crop
    const cropGroups = {};
    records.forEach(r => {
      if (!r || !r.Commodity) return;
      
      const commodity = r.Commodity.trim();
      const price = parseFloat(r.Modal_Price) || 0;
      
      if (!cropGroups[commodity] || price > cropGroups[commodity].modal_price) {
        cropGroups[commodity] = {
          crop: commodity,
          market: r.Market.trim(),
          district: r.District.trim(),
          modal_price: price,
          isVegetable: VEGETABLE_LIST.some(v => commodity.includes(v))
        };
      }
    });

    // 2. Filter for only vegetables and rank by price
    const vegetableData = Object.values(cropGroups)
      .filter(c => c.isVegetable)
      .sort((a, b) => b.modal_price - a.modal_price);

    // 3. Prepare Top Opportunities (Highest absolute prices)
    const topOpportunities = vegetableData.slice(0, 5);

    // 4. Highlight user crop if provided
    let highlightedCrop = null;
    if (userCrop) {
      const cleanUserCrop = userCrop.trim().toLowerCase();
      highlightedCrop = vegetableData.find(c => 
        c.crop.toLowerCase().includes(cleanUserCrop)
      );
    }

    const result = {
      topMarkets: vegetableData.slice(0, 10), // Diverse high-paying markets
      bestByCrop: vegetableData, // Best market for every vegetable
      rankedList: vegetableData.map(v => v.crop), // Simple ranking of commodities
      highlight: highlightedCrop
    };

    // Cache for 30 minutes (universal data is heavy)
    mandiCache.set(cacheKey, {
      data: result,
      expiry: now + (30 * 60 * 1000)
    });

    return result;
  } catch (error) {
    console.error("Universal Mandi Error:", error.message);
    return { topMarkets: [], bestByCrop: [], rankedList: [], highlight: null };
  }
};

exports.getMandiPrices = async (commodity) => {
  if (!commodity) return [];
  
  // Clean string and handle common typos/aliases mapped to official Government Dataset names
  let cleanStr = commodity.trim().toLowerCase();
  
  const aliasMap = {
    'bitter guard': 'Bitter Gourd',
    'bottle guard': 'Bottle Gourd',
    'ladies finger': 'Bhindi(Ladies Finger)',
    'lady finger': 'Bhindi(Ladies Finger)',
    'bhindi': 'Bhindi(Ladies Finger)',
    'okra': 'Bhindi(Ladies Finger)',
    'brinjal': 'Brinjal',
    'eggplant': 'Brinjal'
  };

  if (aliasMap[cleanStr]) {
    cleanStr = aliasMap[cleanStr];
  } else {
    // Standardize to Title Case for anything not in the alias map
    cleanStr = cleanStr.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  const formattedCommodity = cleanStr;
  
  const now = Date.now();
  const cached = mandiCache.get(formattedCommodity);

  if (cached && now < cached.expiry) {
    return cached.data;
  }

  const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${process.env.VITE_MANDI_API_KEY}&format=json&limit=500&filters[State]=Telangana&filters[Commodity]=${encodeURIComponent(formattedCommodity)}`;

  try {
    const response = await axios.get(url);
    const records = response.data.records || [];
    
    // Deduplicate by District to show a wide geographic spread across the state
    const uniqueDistricts = new Map();
    records.forEach(r => {
      if (r && r.District) {
        const districtName = r.District.trim().toUpperCase();
        
        // If district isn't in map, OR if this market has a higher price, update it
        if (!uniqueDistricts.has(districtName) || r.Modal_Price > uniqueDistricts.get(districtName).modal_price) {
          uniqueDistricts.set(districtName, {
            market: r.Market.trim(),
            district: r.District.trim(),
            modal_price: r.Modal_Price
          });
        }
      }
    });

    const formattedData = Array.from(uniqueDistricts.values());

    // Cache for 15 minutes
    mandiCache.set(formattedCommodity, {
      data: formattedData,
      expiry: now + (15 * 60 * 1000)
    });

    return formattedData;
  } catch (error) {
    console.error("Mandi API Error:", error.message);
    return [];
  }
};
