import React from 'react';
// ...existing code...
import TextToSpeech from './TextToSpeech';

interface ResultDisplayProps {
  title: string;
  content: string;
  type: 'success' | 'error';
  icon: React.ElementType;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  title,
  content,
  type,
  icon: Icon,
}) => {
  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`${bgColor} ${borderColor} border rounded-xl p-6 relative`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className={`w-6 h-6 ${iconColor} mr-2`} />
          <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
        </div>
        {type === 'success' && (
          <TextToSpeech text={content} />
        )}
      </div>
      <div className={`${textColor} leading-relaxed whitespace-pre-wrap`}>
        {content}
      </div>
    </div>
  );
};

export default ResultDisplay;