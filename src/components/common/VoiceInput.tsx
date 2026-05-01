// Minimal custom types for SpeechRecognition API
type SpeechRecognitionType = {
  lang: string;
  interimResults: boolean;
  start(): void;
  stop(): void;
  addEventListener(type: 'start' | 'end' | 'result' | 'error', listener: (ev: Event) => void): void;
};

type SpeechRecognitionResultEvent = Event & {
  resultIndex: number;
  results: Array<{ 0: { transcript: string } }>;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};
import React, { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  React.useEffect(() => {
    const SpeechRecognitionCtor =
      (window as typeof window & { SpeechRecognition?: new () => SpeechRecognitionType; webkitSpeechRecognition?: new () => SpeechRecognitionType }).SpeechRecognition ||
      (window as typeof window & { SpeechRecognition?: new () => SpeechRecognitionType; webkitSpeechRecognition?: new () => SpeechRecognitionType }).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor() as SpeechRecognitionType;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.addEventListener('start', () => setIsListening(true));
    recognition.addEventListener('end', () => setIsListening(false));
    recognition.addEventListener('result', (event: Event) => {
      const resultEvent = event as SpeechRecognitionResultEvent;
      let transcript = '';
      for (let i = resultEvent.resultIndex; i < resultEvent.results.length; ++i) {
        transcript += resultEvent.results[i][0].transcript;
      }
      onTranscript(transcript.trim());
    });
    recognition.addEventListener('error', (event: Event) => {
      const errorEvent = event as SpeechRecognitionErrorEvent;
      console.error('Speech recognition error:', errorEvent.error);
      setIsListening(false);
    });

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const handleMicClick = () => {
    if (!isSupported) return;

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleMicClick}
      className={`p-2 rounded-full transition-all duration-200 ${
        isListening
          ? 'bg-red-500 text-white shadow-lg'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
};

export default VoiceInput;