import React, { useState } from 'react';
import { Building2, FileText, AlertCircle } from 'lucide-react';
import TextInputForm from './forms/TextInputForm';
import ResultDisplay from './common/ResultDisplay';
import { aiService } from '../services/apiService';

const GovernmentSchemes: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSchemeSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a query about government schemes.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const prompt = `Act as a government agricultural scheme navigator for a farmer in Telangana, India. 
      The farmer asks: "${query}". 
      Explain relevant schemes (e.g., Rythu Bharosa, PM-Kisan) and provide:
      1. Eligibility requirements.
      2. Application steps.
      3. A direct link to the relevant portal (e.g., https://rythubharosa.telangana.gov.in/).
      Provide the response in TWO sections: first in simple English, then translate the key points into Telugu.`;
      
      const response = await aiService.askAI(prompt);
      setResult(response);
    } catch (err) {
      setError('Failed to fetch scheme information. Please try again.');
      console.error('Scheme search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setError('');
    setResult('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-green-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Government Scheme Navigator</h2>
        </div>
        <p className="text-gray-600">
          Ask about government subsidies or schemes available for farmers.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl">
        <TextInputForm
          value={query}
          onChange={handleQueryChange}
          onSubmit={handleSchemeSearch}
          placeholder="e.g., Subsidies for drip irrigation?"
          buttonText="Get Scheme Info"
          buttonIcon={FileText}
          isLoading={isLoading}
          loadingText="Searching Schemes..."
          rows={3}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {result && (
        <ResultDisplay
          title="Government Schemes Information"
          content={result}
          type="success"
          icon={Building2}
        />
      )}
    </div>
  );
};

export default GovernmentSchemes;