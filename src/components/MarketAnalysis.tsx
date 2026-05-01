import React, { useEffect } from 'react';
import { Search, TrendingUp, AlertTriangle, MapPin, Mic, MicOff, AlertCircle, X, Volume2 } from 'lucide-react';
import { aiService } from '../services/apiService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechOutput } from '../hooks/useSpeechOutput';
import { buildMandiSummary } from '../utils/intentDetection';
import type { LangType } from '../App';

const MarketAnalysis: React.FC<{ lang?: LangType }> = ({ lang = 'en-IN' }) => {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState('');

  const { speak } = useSpeechOutput();

  const { status, transcript, error: speechError, isSupported, toggleListening, clearTranscript, clearError } =
    useSpeechRecognition(lang);

  // When the hook produces a final transcript, push it into the query input
  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
      clearTranscript();
    }
  }, [transcript, clearTranscript]);

  // Auto-clear speech error when user starts typing manually
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (speechError) clearError();
  };

  const isListening = status === 'listening';

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await aiService.getMandiData(query.trim());
      if (data?.markets?.length > 0) {
        setResult(data);
        // Auto voice feedback
        const summary = buildMandiSummary(query, data.markets);
        speak(summary, lang);
      } else {
        setError(`No market data found for "${query}" in Telangana.`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch market data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full px-2 md:px-0">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center shadow-inner">
            <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 md:mb-4 tracking-tight uppercase">
          Mandi<span className="text-amber-600">Intelligence</span>
        </h1>
        <p className="text-gray-500 font-medium text-sm md:text-base">
          Get real-time price trends for local Telangana Mandis.
        </p>
      </div>

      {/* ── Search Card ──────────────────────────────────────────────────── */}
      <div className="bg-white p-4 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-xl border border-gray-100">

        {/* Input + Mic row */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              id="mandi-crop-input"
              value={query}
              onChange={handleQueryChange}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder={
                isListening
                  ? 'Listening… speak the crop name 🎤'
                  : 'Enter crop name (e.g., Tomato, Cotton)…'
              }
              className={`w-full px-5 py-4 md:py-5 text-base md:text-lg border-2 rounded-2xl focus:outline-none focus:ring-4 transition-colors font-medium ${
                isListening
                  ? 'border-red-400 bg-red-50 placeholder:text-red-400'
                  : 'border-gray-200 bg-gray-50 focus:border-amber-400 focus:ring-amber-50'
              }`}
            />

            {/* Pulsing REC indicator */}
            {isListening && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                </span>
                <span className="text-[10px] font-black text-red-500 tracking-widest">REC</span>
              </span>
            )}
          </div>

          {/* Mic toggle button */}
          {isSupported && (
            <button
              id="mic-toggle-btn"
              onClick={toggleListening}
              aria-label={isListening ? 'Stop listening' : '🎤 Tap to Speak'}
              className={`shrink-0 p-4 md:p-5 rounded-2xl transition-all ${
                isListening
                  ? 'bg-red-100 text-red-600 ring-2 ring-red-300'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200 active:scale-95'
              }`}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
          )}
        </div>

        {/* Speech error message — only shows after user taps mic */}
        {speechError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium flex-1">{speechError.message}</p>
            <button onClick={clearError} className="text-red-400 hover:text-red-600 shrink-0" aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Analyze button */}
        <button
          id="analyze-market-btn"
          onClick={handleAnalyze}
          disabled={loading || !query.trim()}
          className="w-full py-4 md:py-5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg text-base"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5" />
              Analyze Market
            </>
          )}
        </button>
      </div>

      {/* ── API Error ────────────────────────────────────────────────────── */}
      {error && (
        <div className="p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* ── Results Grid ─────────────────────────────────────────────────── */}
      {result?.markets && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {result.markets.map((m: any, i: number) => (
            <div key={i} className="relative bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-lg hover:border-amber-200 transition-colors">
              {i === 0 && (
                <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest bg-amber-500 text-white px-2 py-1 rounded-full">
                  🏆 Best Market
                </span>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-50 rounded-xl shrink-0">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
                    {m.district}
                  </p>
                  <p className="text-base font-black text-gray-800 truncate">{m.market}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-end gap-1">
                <span className="text-3xl font-black text-amber-600">₹{m.modal_price}</span>
                <span className="text-[10px] font-black text-gray-400 uppercase mb-1.5">/ Quintal</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketAnalysis;