import React, { useState, useEffect } from 'react';
import { Droplets, ThermometerSun, Sprout, Leaf, AlertTriangle } from 'lucide-react';
import { aiService } from '../services/apiService';

interface CropRule {
  condition: (temp: number, humidity: number) => boolean;
  crops: string[];
  reason: string;
  season: string;
}

const CROP_RULES: CropRule[] = [
  {
    condition: (t, h) => t >= 35 && h < 40,
    crops: ['Cotton', 'Millets (Jowar)', 'Groundnut'],
    reason: 'High temperature, low humidity — drought-tolerant crops perform best.',
    season: 'Kharif (June – Oct)',
  },
  {
    condition: (t, h) => t >= 28 && h >= 60 && h <= 80,
    crops: ['Tomato', 'Brinjal', 'Okra (Bhindi)'],
    reason: 'Warm & moderately humid — ideal for vegetable cultivation.',
    season: 'Year-round',
  },
  {
    condition: (t, h) => t >= 22 && t < 32 && h > 70,
    crops: ['Paddy (Rice)', 'Sugarcane', 'Turmeric'],
    reason: 'Moderate temperature, high humidity — perfect for water-intensive crops.',
    season: 'Kharif / Rabi',
  },
  {
    condition: (t, h) => t < 22,
    crops: ['Wheat', 'Chickpea (Chana)', 'Mustard'],
    reason: 'Cool temperature — optimal for Rabi season crops.',
    season: 'Rabi (Nov – Mar)',
  },
  {
    condition: () => true, // fallback
    crops: ['Maize', 'Sunflower', 'Soybean'],
    reason: 'Versatile crops suitable across a wide range of climates.',
    season: 'Kharif / Rabi',
  },
];

function getRecommendations(temp: number, humidity: number): CropRule {
  return CROP_RULES.find(r => r.condition(temp, humidity)) ?? CROP_RULES[CROP_RULES.length - 1];
}

const CROP_COLORS = [
  'bg-green-100 text-green-800 border-green-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-teal-100 text-teal-800 border-teal-200',
];

const CropRecommendation: React.FC = () => {
  const [weather, setWeather]   = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    aiService.getWeatherData('Karimnagar')
      .then(setWeather)
      .catch(() => setError('Could not fetch weather data for recommendations.'))
      .finally(() => setLoading(false));
  }, []);

  const recommendation = weather
    ? getRecommendations(weather.temp ?? 30, weather.humidity ?? 50)
    : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 md:mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-[2rem] flex items-center justify-center shadow-inner">
            <Sprout className="w-8 h-8 md:w-10 md:h-10 text-green-700" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight uppercase">
          Crop <span className="text-green-700">Advisory</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base font-medium">
          AI-powered crop recommendations based on your current local weather.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-700 font-medium text-sm">{error}</p>
        </div>
      )}

      {weather && recommendation && (
        <>
          {/* Weather Context Card */}
          <div className="bg-[#1e293b] text-white rounded-3xl p-6 md:p-8 shadow-2xl">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Current Conditions · Karimnagar</p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-700 rounded-2xl">
                  <ThermometerSun className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Temperature</p>
                  <p className="text-2xl font-black">{Math.round(weather.temp ?? 0)}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-700 rounded-2xl">
                  <Droplets className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Humidity</p>
                  <p className="text-2xl font-black">{weather.humidity ?? '--'}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-700 rounded-2xl">
                  <Leaf className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Season</p>
                  <p className="text-lg font-black leading-tight">{recommendation.season}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Crops */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-lg">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">AI Recommendation</p>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Top 3 Crops for You</h2>
            <p className="text-sm text-gray-500 mb-6 italic">{recommendation.reason}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendation.crops.map((crop, i) => (
                <div
                  key={crop}
                  className={`relative p-5 rounded-2xl border-2 ${CROP_COLORS[i]} flex flex-col items-center text-center gap-2`}
                >
                  <span className="text-3xl">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </span>
                  <p className="text-lg font-black leading-tight">{crop}</p>
                  {i === 0 && (
                    <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-widest bg-white/60 px-2 py-0.5 rounded-full">
                      Best Pick
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CropRecommendation;
