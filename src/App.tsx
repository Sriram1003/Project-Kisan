import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import CropDiagnosis from './components/CropDiagnosis';
import MarketAnalysis from './components/MarketAnalysis';
import WeatherDashboard from './components/WeatherDashboard';
import CropRecommendation from './components/CropRecommendation';
import { Sprout, TrendingUp, CloudSun, Lightbulb, Mic, MicOff, Globe } from 'lucide-react';
import { detectIntent, buildMandiSummary, buildWeatherSummary } from './utils/intentDetection';
import { useSpeechOutput } from './hooks/useSpeechOutput';
import { aiService } from './services/apiService';

export type TabType = 'diagnosis' | 'market' | 'weather' | 'advisory';
export type LangType = 'en-IN' | 'hi-IN' | 'te-IN';

const LANG_LABELS: Record<LangType, string> = {
  'en-IN': 'EN',
  'hi-IN': 'हि',
  'te-IN': 'తె',
};

const TABS = [
  { id: 'diagnosis' as TabType, label: 'Diagnose',  icon: Sprout    },
  { id: 'market'    as TabType, label: 'Market',    icon: TrendingUp },
  { id: 'weather'   as TabType, label: 'Weather',   icon: CloudSun   },
  { id: 'advisory'  as TabType, label: 'Advisory',  icon: Lightbulb  },
];

function App() {
  const [activeTab, setActiveTab]         = useState<TabType>('diagnosis');
  const [lang, setLang]                   = useState<LangType>('en-IN');
  const [assistantActive, setAssistantActive] = useState(false);
  const [assistantStatus, setAssistantStatus] = useState('');
  const recRef = useRef<any>(null);
  const { speak } = useSpeechOutput();

  // ── Voice Assistant ─────────────────────────────────────────────────────────
  const stopAssistant = useCallback(() => {
    try { recRef.current?.abort(); } catch { /* ignore */ }
    recRef.current = null;
    setAssistantActive(false);
    setAssistantStatus('');
  }, []);

  const startAssistant = useCallback(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Voice assistant requires Chrome browser.');
      return;
    }

    const rec = new SpeechRec();
    rec.lang           = lang;
    rec.continuous     = false;
    rec.interimResults = false;

    rec.onstart = () => {
      setAssistantActive(true);
      setAssistantStatus('Listening…');
    };

    rec.onresult = async (event: any) => {
      const text = (event.results[0][0].transcript ?? '').trim();
      setAssistantStatus(`Heard: "${text}"`);

      const intent = detectIntent(text);
      console.log('[Assistant] Intent:', intent);

      switch (intent.type) {
        case 'market': {
          setActiveTab('market');
          const crop = intent.crop ?? 'Tomato';
          setAssistantStatus(`Fetching ${crop} prices…`);
          try {
            const data = await aiService.getMandiData(crop);
            const summary = buildMandiSummary(crop, data.markets ?? []);
            speak(summary, lang);
            setAssistantStatus(summary);
          } catch {
            speak('Sorry, could not fetch market data right now.', lang);
          }
          break;
        }
        case 'weather': {
          setActiveTab('weather');
          setAssistantStatus('Fetching weather…');
          try {
            const data = await aiService.getWeatherData('Karimnagar');
            const summary = buildWeatherSummary(data);
            speak(summary, lang);
            setAssistantStatus(summary);
          } catch {
            speak('Sorry, weather data is unavailable right now.', lang);
          }
          break;
        }
        case 'diagnosis':
          setActiveTab('diagnosis');
          speak('Please upload a photo of your crop for diagnosis.', lang);
          setAssistantStatus('Switched to Crop Diagnosis.');
          break;
        case 'advisory':
          setActiveTab('advisory');
          speak('Showing crop recommendations based on current weather.', lang);
          setAssistantStatus('Switched to Crop Advisory.');
          break;
        default:
          speak('I did not understand that. Try saying: tomato, weather, or check my crop.', lang);
          setAssistantStatus(`I heard "${text}" but didn't understand. Try: "tomato", "weather today", or "check disease".`);
      }
    };

    rec.onerror = (e: any) => {
      if (e.error !== 'no-speech') {
        setAssistantStatus(`Mic error: ${e.error}. Try again.`);
      }
    };

    rec.onend = () => {
      setAssistantActive(false);
      setTimeout(() => setAssistantStatus(''), 6000);
      recRef.current = null;
    };

    recRef.current = rec;
    try { rec.start(); } catch { setAssistantActive(false); }
  }, [lang, speak]);

  const toggleAssistant = () => {
    if (assistantActive) {
      stopAssistant();
    } else {
      startAssistant();
    }
  };

  // Cycle through languages
  const cycleLang = () => {
    const order: LangType[] = ['en-IN', 'hi-IN', 'te-IN'];
    setLang(prev => order[(order.indexOf(prev) + 1) % order.length]);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'diagnosis': return <CropDiagnosis />;
      case 'market':    return <MarketAnalysis lang={lang} />;
      case 'weather':   return <WeatherDashboard />;
      case 'advisory':  return <CropRecommendation />;
      default:          return <CropDiagnosis />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] flex justify-center items-start py-6 md:py-12 px-2 md:px-4 selection:bg-green-200 pb-24 md:pb-12">
      <div className="glass-panel p-4 md:p-10 rounded-[2rem] md:rounded-[2.5rem] max-w-4xl w-full relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 blur-3xl -z-10" />

        {/* ── Desktop Tab Navigation ─────────────────────────────────────── */}
        <Header />
        <div className="hidden md:flex justify-center items-center gap-3 md:gap-4 mb-10 flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs border-2 transition-all ${
                activeTab === id
                  ? 'bg-green-700 text-white border-green-700 shadow-lg shadow-green-200'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-green-200 hover:text-green-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Assistant Status Badge */}
        {assistantStatus && (
          <div className="mb-4 px-4 py-2 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-sm font-medium text-center">
            🤖 {assistantStatus}
          </div>
        )}

        {/* Tab Content */}
        <div className="mt-2 md:mt-0">
          {renderActiveTab()}
        </div>
      </div>

      {/* ── Mobile Sticky Bottom Navigation ─────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-gray-200 shadow-2xl">
        <div className="flex items-center justify-around px-2 py-2 max-w-4xl mx-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all flex-1 ${
                activeTab === id
                  ? 'text-green-700 bg-green-50'
                  : 'text-gray-400 hover:text-green-600'
              }`}
            >
              <Icon className={`w-6 h-6 ${activeTab === id ? 'text-green-700' : ''}`} />
              <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;