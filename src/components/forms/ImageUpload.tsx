import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage: File | null;
  imagePreview: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  imagePreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        onImageSelect(file, preview);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null as any, '');
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {!selectedImage ? (
        <div
          onClick={handleUploadClick}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all duration-300 active:scale-[0.98]"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-700 font-bold mb-1">Tap to Open Camera</p>
          <p className="text-sm text-gray-500">or select from gallery</p>
          <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG up to 10MB</p>
        </div>
      ) : (
        <div className="relative">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ImageIcon className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium text-gray-700">Selected Image</span>
              </div>
              <button
                onClick={handleRemoveImage}
                className="p-1 hover:bg-red-50 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
            <div className="text-center">
              <img
                src={imagePreview}
                alt="Selected plant"
                className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                style={{ maxHeight: '300px' }}
              />
              <p className="text-sm text-gray-500 mt-2">{selectedImage.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;