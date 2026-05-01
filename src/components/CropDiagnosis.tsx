import React, { useState } from 'react';
import { Camera, AlertCircle, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './forms/ImageUpload';
import DiagnosisResult from './common/DiagnosisResult';
import LoadingButton from './common/LoadingButton';
import CameraCapture from './CameraCapture';
import { aiService } from '../services/apiService';

const CropDiagnosis: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage(file);
    setImagePreview(preview);
    setResult('');
    setError('');
  };

  const handleCameraCapture = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    handleImageSelect(file, previewUrl);
    setShowCamera(false);
  };

  const handleDiagnosis = async () => {
    if (!selectedImage) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await aiService.analyzeCrop(selectedImage);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze the image. Please check if the backend is running.');
      console.error('Diagnosis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 w-full px-2 md:px-0">
      {showCamera && (
        <CameraCapture 
          onCapture={handleCameraCapture} 
          onCancel={() => setShowCamera(false)} 
        />
      )}

      <div className="text-center">
        <div className="flex items-center justify-center mb-4 md:mb-6">
          <div className="p-4 bg-green-50 rounded-full shadow-inner">
            <ImageIcon className="w-10 h-10 text-green-700" />
          </div>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2 md:mb-4 uppercase italic">
          Instant <span className="text-green-700 not-italic">Diagnosis</span>
        </h2>
        <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-medium">
          Upload a photo or use your camera to analyze crop diseases in real-time.
        </p>
      </div>

      <div className="bg-gray-50 p-4 md:p-6 rounded-[2rem] shadow-sm">
        {!selectedImage && (
          <button 
            onClick={() => setShowCamera(true)}
            className="w-full mb-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <Camera className="w-6 h-6" /> Open Camera
          </button>
        )}

        <ImageUpload
          onImageSelect={handleImageSelect}
          selectedImage={selectedImage}
          imagePreview={imagePreview}
        />
        
        {selectedImage && (
          <div className="mt-6">
            <LoadingButton
              onClick={handleDiagnosis}
              isLoading={isLoading}
              loadingText="Analyzing Image..."
              className="w-full bg-blue-600 active:bg-blue-800 hover:bg-blue-700 text-white px-6 py-4 rounded-xl text-lg font-bold transition-all shadow-lg flex items-center justify-center"
            >
              <Camera className="w-6 h-6 mr-2" />
              Diagnose Crop
            </LoadingButton>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      )}

      {result && (
        <div className="w-full">
          <DiagnosisResult data={result} />
        </div>
      )}
    </div>
  );
};


export default CropDiagnosis;