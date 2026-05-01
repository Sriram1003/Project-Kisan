exports.getDiseaseRisk = (humidity) => {
  if (humidity > 75) return "HIGH - High fungal risk";
  if (humidity >= 60) return "MEDIUM - Moderate risk";
  return "LOW - Optimal conditions";
};

exports.getBestMarket = (markets) => {
  if (!markets || markets.length === 0) return "N/A";
  return [...markets].sort((a, b) => b.modal_price - a.modal_price)[0].market;
};

exports.getTopMarkets = (markets) => {
  if (!markets || markets.length === 0) return [];
  return [...markets]
    .sort((a, b) => b.modal_price - a.modal_price)
    .slice(0, 3);
};

exports.getSuggestion = (risk, disease) => {
  if (disease === "Healthy") return "Continue regular monitoring and maintenance.";
  if (risk.includes("HIGH")) return `Critical: ${disease} detected under high-risk weather. Apply immediate organic/chemical controls.`;
  return `Advisory: Treatment for ${disease} recommended. Maintain optimal irrigation.`;
};
