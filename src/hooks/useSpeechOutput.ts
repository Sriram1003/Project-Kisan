import { useCallback, useRef } from 'react';

/**
 * useSpeechOutput — wraps speechSynthesis for voice responses.
 * Creates a fresh utterance per call; cancels any previous speech automatically.
 */
export function useSpeechOutput() {
  const currentRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, lang = 'en-IN') => {
    if (!('speechSynthesis' in window)) return;

    // Stop anything already playing
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    currentRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}
