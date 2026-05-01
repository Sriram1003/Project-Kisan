import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, Check, RefreshCw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Unable to access camera. Please check permissions.");
      onCancel();
    }
  }, [onCancel]);

  React.useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
      }
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      // Convert Data URL to File object
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          onCapture(file);
        });
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={onCancel} className="p-3 bg-white/20 rounded-full text-white backdrop-blur-md">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative w-full max-w-lg aspect-[3/4] sm:aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
        {!capturedImage ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {isStreaming && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <button 
                  onClick={takePhoto}
                  className="w-20 h-20 bg-white/30 rounded-full p-2 border-4 border-white backdrop-blur-md flex items-center justify-center hover:bg-white/50 transition-all"
                >
                  <div className="w-14 h-14 bg-white rounded-full" />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
              <button 
                onClick={retakePhoto}
                className="px-6 py-4 bg-white/20 rounded-2xl text-white backdrop-blur-md font-bold flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" /> Retake
              </button>
              <button 
                onClick={confirmPhoto}
                className="px-8 py-4 bg-green-600 rounded-2xl text-white shadow-lg shadow-green-600/50 font-bold flex items-center gap-2"
              >
                <Check className="w-5 h-5" /> Use Photo
              </button>
            </div>
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
