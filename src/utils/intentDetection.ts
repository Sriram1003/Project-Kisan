/**
 * Intent Detection Utility
 * Maps spoken commands to app actions.
 */

export type IntentType = 'market' | 'weather' | 'diagnosis' | 'advisory' | 'unknown';

export interface DetectedIntent {
  type: IntentType;
  crop?: string;        // e.g. "tomato"
  rawText: string;
}

// Keywords that signal each intent
const INTENT_PATTERNS: Array<{ type: IntentType; pattern: RegExp }> = [
  { type: 'market',    pattern: /\b(price|mandi|market|rate|cost|sell|bhav|buy|kharido|kitna|rupee|rupees)\b/i },
  { type: 'weather',   pattern: /\b(weather|rain|temperature|forecast|baarish|mausam|climate|hot|cold|humidity)\b/i },
  { type: 'diagnosis', pattern: /\b(disease|detect|diagnose|diagnosis|leaf|pest|problem|bimari|image|scan|photo|camera|check)\b/i },
  { type: 'advisory',  pattern: /\b(recommend|suggest|grow|advisory|crop\s*advice|kya\s*ugaun|kaunsi\s*fasal|what\s*to\s*grow|best\s*crop)\b/i },
];

// Known crop names — includes English, Hindi, and Telugu common names
const CROP_NAMES = [
  'tomato', 'tamatar', 'potato', 'aloo', 'onion', 'pyaz', 'pyaaz',
  'cotton', 'kapas', 'paddy', 'rice', 'chawal', 'wheat', 'gehun',
  'maize', 'makka', 'brinjal', 'baingan', 'bhindi', 'okra', 'ladies finger',
  'cabbage', 'patta gobhi', 'cauliflower', 'phool gobhi', 'carrot', 'gajar',
  'ginger', 'adrak', 'garlic', 'lahsun', 'capsicum', 'shimla mirch',
  'chilli', 'mirchi', 'bitter gourd', 'karela', 'bottle gourd', 'lauki',
  'drumstick', 'soybean', 'groundnut', 'moongfali', 'sunflower',
  'turmeric', 'haldi', 'jowar', 'bajra', 'ragi', 'sugarcane', 'ganna',
  'mustard', 'sarson', 'chickpea', 'chana', 'pumpkin', 'kaddu',
  'spinach', 'palak', 'coriander', 'dhaniya', 'cucumber', 'kheera',
  'watermelon', 'tarbooz', 'mango', 'aam', 'banana', 'kela',
  'sweet potato', 'lemon', 'nimbu', 'papaya',
];

export function detectIntent(text: string): DetectedIntent {
  const lower = text.toLowerCase().trim();

  // 1. Check explicit intent keywords
  let type: IntentType = 'unknown';
  for (const { type: t, pattern } of INTENT_PATTERNS) {
    if (pattern.test(lower)) {
      type = t;
      break;
    }
  }

  // 2. Extract crop name from the utterance
  const crop = CROP_NAMES.find(c => lower.includes(c));

  // 3. SMART FALLBACK: If a crop name is found but no intent keyword was matched,
  //    assume the user wants market/price data (most common use case)
  if (type === 'unknown' && crop) {
    type = 'market';
  }

  return { type, crop, rawText: text };
}


/**
 * Build a speech-friendly summary for voice output.
 */
export function buildMandiSummary(crop: string, markets: any[]): string {
  if (!markets || markets.length === 0) {
    return `Sorry, I could not find price data for ${crop} in Telangana right now.`;
  }
  const top = markets[0];
  return `${crop} is fetching the highest price of ${top.modal_price} rupees per quintal at ${top.market} in ${top.district} district.`;
}

export function buildWeatherSummary(data: any): string {
  if (!data || data.temp == null) return 'Weather data is currently unavailable.';
  return `Current weather in Karimnagar: ${Math.round(data.temp)} degrees Celsius, ${data.humidity}% humidity, with ${data.condition}.`;
}
