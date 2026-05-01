import { useState, useRef, useCallback, useEffect } from 'react';

export type SpeechStatus = 'idle' | 'listening' | 'error' | 'unsupported';

export interface SpeechError {
  code: string;
  message: string;
}

interface UseSpeechReturn {
  status: SpeechStatus;
  transcript: string;
  error: SpeechError | null;
  isSupported: boolean;
  toggleListening: () => void;
  clearTranscript: () => void;
  clearError: () => void;
}

function getSpeechClass(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

function isSecureContext(): boolean {
  return (
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
}

function mapSpeechError(code: string): string {
  switch (code) {
    case 'not-allowed':
      return 'Microphone access denied. Click the lock icon in your browser address bar and allow microphone.';
    case 'audio-capture':
      return 'Could not capture audio. Please allow microphone access when prompted by your browser.';
    case 'no-speech':
      return 'No speech detected. Tap the mic and speak clearly.';
    case 'network':
      return 'Network error. Check your internet connection and try again.';
    case 'service-not-allowed':
      return 'Speech service blocked. Ensure the site is on HTTPS or localhost.';
    case 'insecure':
      return 'Microphone requires HTTPS. Voice input is unavailable on this connection.';
    case 'unsupported':
      return 'Voice input is not supported on this browser. Please use Chrome or Edge.';
    default:
      return 'Microphone error. Please try again.';
  }
}

export function useSpeechRecognition(lang = 'en-IN'): UseSpeechReturn {
  const [status, setStatus]         = useState<SpeechStatus>('idle');
  const [transcript, setTranscript] = useState('');
  // error is null by default and ONLY set when the user actively clicks the mic
  const [error, setError]           = useState<SpeechError | null>(null);

  const SpeechClass  = getSpeechClass();
  const isSupported  = SpeechClass !== null;
  const recRef       = useRef<any>(null);
  const activeRef    = useRef(false);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      try { recRef.current?.abort(); } catch { /* ignore */ }
    };
  }, []);

  const startListening = useCallback(() => {
    // Clear any old error first — user is trying again
    setError(null);

    if (!isSupported) {
      setStatus('unsupported');
      setError({ code: 'unsupported', message: mapSpeechError('unsupported') });
      return;
    }

    if (!isSecureContext()) {
      setStatus('error');
      setError({ code: 'insecure', message: mapSpeechError('insecure') });
      return;
    }

    // Abort any previous lingering instance
    try { recRef.current?.abort(); } catch { /* ignore */ }
    recRef.current = null;

    // Always create a fresh instance — the only reliable way to avoid "already started"
    const rec = new SpeechClass();
    rec.lang           = lang;
    rec.continuous     = false;
    rec.interimResults = false; // final transcript only → no UI glitch
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      console.log('[Speech] started');
      activeRef.current = true;
      setStatus('listening');
    };

    rec.onresult = (event: any) => {
      const text = (event.results?.[0]?.[0]?.transcript ?? '').trim().replace(/\.$/, '');
      console.log('[Speech] result:', text);
      if (text) setTranscript(text);
    };

    rec.onerror = (event: any) => {
      console.error('[Speech] error:', event.error);
      activeRef.current = false;

      // "no-speech" is harmless — user just didn't say anything, don't show error
      if (event.error === 'no-speech') {
        setStatus('idle');
        return;
      }

      setError({ code: event.error, message: mapSpeechError(event.error) });
      setStatus('error');
    };

    rec.onend = () => {
      console.log('[Speech] ended');
      if (activeRef.current) {
        activeRef.current = false;
        setStatus('idle');
      }
      recRef.current = null;
    };

    recRef.current = rec;
    activeRef.current = false; // will be set true in onstart

    try {
      rec.start();
      console.log('[Speech] rec.start() called');
    } catch (err: any) {
      console.error('[Speech] start failed:', err);
      setError({ code: 'start-failed', message: 'Failed to start microphone. Please try again.' });
      setStatus('error');
      recRef.current = null;
    }
  }, [isSupported, lang, SpeechClass]);

  const stopListening = useCallback(() => {
    console.log('[Speech] stopping');
    activeRef.current = false;
    try { recRef.current?.stop(); } catch { /* ignore */ }
    setStatus('idle');
  }, []);

  const toggleListening = useCallback(() => {
    if (status === 'listening') {
      stopListening();
    } else {
      setTranscript('');
      startListening();
    }
  }, [status, startListening, stopListening]);

  const clearTranscript = useCallback(() => setTranscript(''), []);
  const clearError      = useCallback(() => setError(null), []);

  return { status, transcript, error, isSupported, toggleListening, clearTranscript, clearError };
}
