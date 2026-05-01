import React from 'react';
import { Mic, DivideIcon as LucideIcon } from 'lucide-react';
import LoadingButton from '../common/LoadingButton';
import VoiceInput from '../common/VoiceInput';

interface TextInputFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  buttonText: string;
  buttonIcon: LucideIcon;
  isLoading: boolean;
  loadingText: string;
  rows?: number;
}

const TextInputForm: React.FC<TextInputFormProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonText,
  buttonIcon: ButtonIcon,
  isLoading,
  loadingText,
  rows = 4,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleVoiceInput = (transcript: string) => {
    onChange(transcript);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
        />
        <div className="absolute right-3 top-3">
          <VoiceInput onTranscript={handleVoiceInput} />
        </div>
      </div>

      <div className="text-center">
        <LoadingButton
          type="submit"
          onClick={onSubmit}
          isLoading={isLoading}
          loadingText={loadingText}
          disabled={!value.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:transform-none disabled:shadow-none"
        >
          <ButtonIcon className="w-5 h-5 mr-2" />
          {buttonText}
        </LoadingButton>
      </div>
    </form>
  );
};

export default TextInputForm;