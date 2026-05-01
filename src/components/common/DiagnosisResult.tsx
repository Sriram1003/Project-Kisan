import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  CloudRain, 
  TrendingUp, 
  AlertTriangle, 
  Navigation, 
  Droplets, 
  ThermometerSun,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Market {
  market: string;
  modal_price: string;
}

interface DiagnosisResultProps {
  data: {
    crop: string;
    disease: string;
    confidence: number;
    weather: {
      temp: number;
      humidity: number;
      condition: string;
    };
    market: {
      bestMarket: string;
      topMarkets: Market[];
    };
    risk: string;
    suggestion: string;
  };
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const textToRead = `Diagnosis Result. Crop detected: ${data.crop}. Condition: ${data.disease}. Advisory: ${data.suggestion}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Core Diagnosis & Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white border-2 border-green-600 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 shadow-xl md:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 md:p-6">
             <div className="bg-green-100 text-green-700 px-3 py-1 md:px-4 md:py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
               {(data.confidence * 100).toFixed(0)}% Match
             </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 mt-4 sm:mt-0">
            <div className="p-4 bg-green-50 rounded-2xl inline-block w-fit">
              <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Diagnosis Result</h3>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                {data.crop}: <span className="text-green-700">{data.disease}</span>
              </h2>
            </div>
            <button 
              onClick={toggleSpeech}
              className={`p-3 md:p-4 rounded-xl transition-colors shadow-sm flex items-center justify-center ${isPlaying ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
              aria-label="Read diagnosis aloud"
            >
              {isPlaying ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>

          <p className="text-gray-600 leading-relaxed font-medium mb-6 md:mb-8 bg-gray-50 p-4 md:p-6 rounded-2xl border border-gray-100 italic text-sm md:text-base">
            "{data.suggestion}"
          </p>

          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <div>
              <p className="text-xs font-black text-amber-800 uppercase tracking-widest">Environmental Risk</p>
              <p className="text-sm font-bold text-amber-900">{data.risk}</p>
            </div>
          </div>
        </div>

        {/* 2. Weather Context */}
        <div className="bg-[#1e293b] text-white rounded-[2.5rem] p-8 flex flex-col justify-between shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Local Climate</h3>
              <p className="text-lg font-bold">Karimnagar, TS</p>
            </div>
            <CloudRain className="w-8 h-8 text-blue-400" />
          </div>

          <div className="my-8">
            <h2 className="text-6xl font-black">{data.weather.temp}°C</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-2">{data.weather.condition}</p>
          </div>

          <div className="flex gap-6 border-t border-slate-700 pt-6">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-300">{data.weather.humidity}% Humid</span>
            </div>
            <div className="flex items-center gap-2">
              <ThermometerSun className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-300">Feels Hot</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mandi Intelligence */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Mandi Intelligence</h2>
            </div>
            <p className="text-gray-500 font-medium">Real-time price monitoring across Telangana state.</p>
          </div>
          
          <div className="bg-green-700 text-white px-8 py-4 rounded-3xl shadow-lg shadow-green-100 flex items-center gap-4">
            <Navigation className="w-5 h-5 text-green-300" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Best Selling Market</p>
              <p className="text-lg font-black uppercase">{data.market.bestMarket}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.market.topMarkets.map((m, i) => (
            <div key={i} className="group p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-green-300 transition-all cursor-pointer">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 group-hover:text-green-600">Market Name</p>
              <p className="text-xl font-black text-gray-800 mb-4">{m.market}</p>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-black text-green-700">₹{m.modal_price}</span>
                <span className="text-[10px] font-black text-gray-400 uppercase mb-1.5">/ Quintal</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResult;
