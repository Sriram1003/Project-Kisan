# 🌾 Project Kisan — AI Agriculture Assistant

An intelligent, mobile-first web application that helps farmers and agri-enthusiasts with **crop disease diagnosis, mandi price analysis, weather insights, and AI-driven crop advisory**.

🔗 Live Demo: https://project-kisan.netlify.app/

---

## 🚀 Features

### 🌿 Crop Diagnosis

* Upload leaf images to detect plant diseases
* Uses AI-based image analysis (Plant.id API)
* Provides treatment suggestions and risk levels

### 📊 Mandi Intelligence

* Real-time crop price lookup
* Supports multiple vegetables and crops
* Voice-enabled search (speech recognition)

### 🌦️ Weather Insights

* Live weather data using OpenWeather API
* Displays temperature, humidity, wind, etc.

### 💡 Crop Advisory

* AI recommendations based on weather + crop data
* Helps farmers decide optimal actions

### 🎤 Voice Assistant

* Speech-to-text input for search queries
* Works across desktop and mobile browsers

### 📱 Mobile-First UI

* Fully responsive design
* Optimized for low-end devices and mobile usage

---

## 🧱 Tech Stack

### Frontend

* React + Vite
* TypeScript
* Tailwind CSS

### Backend

* Node.js + Express
* REST APIs

### APIs Used

* Plant.id (Crop disease detection)
* OpenWeatherMap (Weather data)
* Mandi Price API (Market data)

### Deployment

* Frontend: Netlify
* Backend: Render

---

## ⚙️ Environment Variables

### Frontend (.env)

```env
VITE_BACKEND_URL=https://your-backend.onrender.com
VITE_OPENWEATHER_API_KEY=your_key
VITE_MANDI_API_KEY=your_key
VITE_CROP_API_KEY=your_key
```

---

### Backend (Render Environment Variables)

```env
OPENWEATHER_API=your_key
PLANT_ID_API_KEY=your_key
MANDI_API_KEY=your_key
PORT=8000
```

---

## 🖥️ Local Development

### 1. Clone the repository

```bash
git clone https://github.com/your-username/project-kisan.git
cd project-kisan
```

---

### 2. Setup Frontend

```bash
npm install
npm run dev
```

---

### 3. Setup Backend

```bash
cd server
npm install
node server.js
```

---

### 4. Access App

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:8000
```

---

## 🚀 Deployment

### 🔹 Frontend (Netlify)

1. Run:

```bash
npm run build
```

2. Upload `dist/` folder to Netlify

3. Add environment variable:

```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

---

### 🔹 Backend (Render)

1. Create Web Service

2. Configure:

   * Build: `npm install`
   * Start: `node server.js`
   * Root directory: `server` (if applicable)

3. Add environment variables

4. Deploy and copy URL

---

## 🧠 Architecture

```
Frontend (React + Vite)
        ↓
Backend API (Node + Express)
        ↓
External APIs (Plant.id, OpenWeather, Mandi)
```

---

## 🔐 Security Notes

* API keys are stored in environment variables
* No sensitive data exposed in frontend
* Backend acts as secure proxy for API calls

---

## 📈 Future Improvements

* ML-based price prediction
* Multi-language support (Telugu/Hindi)
* Offline mode (PWA)
* Farmer chatbot assistant
* Image history tracking

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Sriram
AI Developer | Full Stack Enthusiast

---
