from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv
from typing import List, Optional
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Project Kisan - AI Backend")

# Enable CORS for the Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("CROP_HEALTH_API_KEY")
API_URL = "https://api.crop.health/v1/diagnose" # Placeholder URL

class Prediction(BaseModel):
    label: str
    confidence: float

class DiagnosisResponse(BaseModel):
    crop: str
    disease: str
    confidence: float
    top_3: List[Prediction]
    treatment_suggestions: List[str]

@app.post("/api/detect-disease", response_model=DiagnosisResponse)
async def detect_disease(file: UploadFile = File(...)):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API Key not configured")

    try:
        # Read file into memory
        contents = await file.read()
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            files = {'image': (file.filename, contents, file.content_type)}
            headers = {"Authorization": f"Bearer {API_KEY}"}
            
            response = await client.post(API_URL, files=files, headers=headers)
            
            if response.status_code == 429:
                raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait.")
            
            if not response.is_success:
                raise HTTPException(status_code=response.status_code, detail="Downstream API failure")

            data = response.json()
            
            # Map external API structure to our internal standard
            return DiagnosisResponse(
                crop=data.get("species", "Unknown"),
                disease=data.get("disease", "Healthy"),
                confidence=data.get("score", 0.0),
                top_3=data.get("recommendations", []),
                treatment_suggestions=data.get("remedies", [])
            )

    except httpx.TimeoutException:
        raise HTTPException(status_code=408, detail="AI Analysis timed out")
    except Exception as e:
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
