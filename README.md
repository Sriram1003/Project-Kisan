# Project Kisan - AI Farmer Assistant

A modern React application that helps farmers with crop diagnosis, market analysis, and government scheme information using AI-powered services.

## Features

### 🌱 Crop Diagnosis
- Upload plant leaf images for disease detection
- AI-powered analysis using Google Gemini
- Actionable remedies for small-scale farmers

### 📈 Market Analysis
- Real-time market price queries
- Voice input support
- Market trend analysis using Groq API

### 🏛️ Government Schemes
- Information about agricultural subsidies
- Telangana-specific scheme details
- Direct links to government portals

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **APIs**: Google Gemini AI, Groq API
- **Features**: Voice recognition, Text-to-speech

## Setup Instructions

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Configure API Keys**
   Edit `src/services/apiService.ts` and replace the placeholder API keys:
   ```typescript
   const GEMINI_API_KEY = "your_gemini_api_key_here";
   const GROQ_API_KEY = "your_groq_api_key_here";
   ```

3. **Get API Keys**
   - **Gemini API**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Groq API**: Visit [Groq Console](https://console.groq.com/keys)

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── LoadingButton.tsx
│   │   ├── ResultDisplay.tsx
│   │   ├── TextToSpeech.tsx
│   │   └── VoiceInput.tsx
│   ├── forms/            # Form components
│   │   ├── ImageUpload.tsx
│   │   └── TextInputForm.tsx
│   ├── CropDiagnosis.tsx
│   ├── GovernmentSchemes.tsx
│   ├── Header.tsx
│   ├── MarketAnalysis.tsx
│   └── TabNavigation.tsx
├── services/
│   └── apiService.ts     # API integration
├── types/
│   └── index.ts          # TypeScript definitions
└── App.tsx               # Main application
```

## Features Overview

### Voice Integration
- Speech-to-text for query input
- Text-to-speech for result reading
- Browser-native Web Speech API

### Image Processing
- Drag-and-drop image upload
- Image preview with removal option
- Base64 encoding for API transmission

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Clean, modern interface

### Error Handling
- Comprehensive error messages
- Loading states for all operations
- Graceful API failure handling

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Limited voice features
- Mobile browsers: Core features supported

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.