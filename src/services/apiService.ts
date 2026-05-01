/**
 * PRODUCTION-GRADE API CLIENT
 * Implementation: Senior API Engineer Pattern
 */

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

export class ApiError extends Error {
  constructor(public status: number, public message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Handles exponential backoff
 */
const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Hardened Fetch Wrapper
 */
async function hardenedFetch(url: string, options: RequestOptions = {}) {
  const { timeout = 15000, retries = 3, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle Rate Limits (429) with Retry
      if (response.status === 429 && retries > 0) {
        console.warn(`Rate limit hit. Retrying... (${retries} left)`);
        await wait(2000 * (4 - retries)); // Exponential wait
        return hardenedFetch(url, { ...options, retries: retries - 1 });
      }

      const errorMessage = errorData.error || response.statusText;
      throw new ApiError(response.status, errorMessage, errorData);
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') throw new ApiError(408, 'Request Timeout');
    throw error;
  }
}

/**
 * Sanitize AI Markdown Output
 */
function sanitizeAIOutput(text: string): string {
  // Remove markdown code blocks if AI wraps the JSON
  return text.replace(/```json\n?|```/g, '').trim();
}
/**
 * AI SERVICE IMPLEMENTATION
 */
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;

/**
 * Backend URL — driven by environment variable.
 * In production (Netlify): set VITE_BACKEND_URL=https://your-backend.onrender.com
 * In local dev: falls back to http://localhost:8000
 */
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');

export const aiService = {
  async diagnose(prompt: string, image: File) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
    
    // Convert file to base64
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(image);
    });

    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: image.type, data: base64 } }
        ]
      }]
    };

    const result = await hardenedFetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
  },

  async askAI(prompt: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
    
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const result = await hardenedFetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
  },

  async getMandiData(commodity: string) {
    const url = `${BACKEND_URL}/api/mandi?commodity=${encodeURIComponent(commodity)}`;
    console.log('[API] Mandi request:', url);
    return await hardenedFetch(url, { method: 'GET' });
  },

  async getWeatherData(city: string) {
    const url = `${BACKEND_URL}/api/weather?city=${encodeURIComponent(city)}`;
    console.log('[API] Weather request:', url);
    return await hardenedFetch(url, { method: 'GET' });
  },

  async analyzeCrop(image: File, district?: string) {
    const url = `${BACKEND_URL}/api/analyze`;
    console.log('[API] Analyze request:', url);
    const formData = new FormData();
    formData.append('image', image);
    if (district) formData.append('district', district);

    return await hardenedFetch(url, {
      method: 'POST',
      body: formData,
    });
  }
};