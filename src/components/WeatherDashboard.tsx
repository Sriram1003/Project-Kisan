import React, { useState, useEffect } from 'react';
import { CloudSun, Droplets, ThermometerSun, AlertTriangle, CloudRain } from 'lucide-react';
import { aiService } from '../services/apiService';

const WeatherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await aiService.getWeatherData("Karimnagar");
        console.log("DEBUG: Frontend API Response:", data);
        
        setResult({
          city: data.city,
          temp: data.temp,
          humidity: data.humidity,
          condition: data.condition
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch local weather data.");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center shadow-inner">
            <CloudSun className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase">
          Local<span className="text-blue-500">Climate</span>
        </h1>
        <p className="text-gray-500 font-medium">
          Real-time agricultural weather context for your region.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] text-red-700 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {result && !loading && !error && result.temp !== undefined && (
        <div className="bg-[#1e293b] text-white rounded-[2.5rem] p-10 flex flex-col justify-between shadow-2xl max-w-md mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Current Location</h3>
              <p className="text-2xl font-bold">{result.city || "Karimnagar"}, TS</p>
            </div>
            <CloudRain className="w-10 h-10 text-blue-400" />
          </div>

          <div className="my-12">
            <h2 className="text-7xl font-black">{Math.round(result.temp)}°C</h2>
            <p className="text-blue-400 font-black uppercase tracking-widest text-lg mt-4">{result.condition}</p>
          </div>

          <div className="flex gap-6 border-t border-slate-700 pt-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-800 rounded-2xl">
                <Droplets className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Humidity</p>
                <span className="text-lg font-bold text-white">{result.humidity}%</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-800 rounded-2xl">
                <ThermometerSun className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Feels</p>
                <span className="text-lg font-bold text-white">Hot</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
