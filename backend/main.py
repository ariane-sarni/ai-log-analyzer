# backend/main.py
import os
import json
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal
from dotenv import load_dotenv
import google.generativeai as genai

# --- Load Environment Variables ---
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("Warning: GEMINI_API_KEY not found. API calls will fail.")
else:
    genai.configure(api_key=API_KEY)

# --- FastAPI App Initialization ---
app = FastAPI(
    title="AI Log Analyzer API",
    description="API for uploading and analyzing log files.",
    version="0.2.0"
)

# --- CORS Configuration ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models (for response structure) ---
class Anomaly(BaseModel):
    type: Literal['info', 'warning', 'error']
    timestamp: str
    message: str

class AnalysisReport(BaseModel):
    summary: str
    anomalies: List[Anomaly]

# --- AI Configuration ---
SYSTEM_PROMPT = """
You are a 'Level 5' Site Reliability Engineer and an expert in analyzing complex system logs. 
A user will provide a log file. You must analyze it and return a structured JSON report.

Your report MUST strictly follow this JSON schema:
{
  "summary": "A concise, one-paragraph summary of the log file's overall health and key events.",
  "anomalies": [
    {
      "type": "info | warning | error",
      "timestamp": "The timestamp of the anomaly (e.g., '03:00:15' or 'YYYY-MM-DD HH:MM:SS'). If no timestamp is present, use 'N/A'.",
      "message": "A clear description of the anomaly."
    }
  ]
}

- Identify 3-5 of the *most critical* or *representative* anomalies.
- Classify each anomaly as 'info', 'warning', or 'error'.
- If the log is clean, return a summary saying so and an empty 'anomalies' list.
- Do not add any text or formatting outside of the JSON structure.
"""

# Configure the model to output JSON
generation_config = genai.GenerationConfig(
    response_mime_type="application/json",
)

model = genai.GenerativeModel(
    'gemini-2.5-flash-preview-09-2025',
    generation_config=generation_config,
    system_instruction=SYSTEM_PROMPT
)


# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Log Analyzer API is running."}


@app.post("/api/analyze", response_model=AnalysisReport)
async def analyze_log_file(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}, Content-Type: {file.content_type}")

    if not API_KEY:
        raise HTTPException(status_code=500, detail="Server is missing API key.")

    try:
        # Read the file content
        log_content_bytes = await file.read()
        log_content = log_content_bytes.decode('utf-8')
        
        # Limit the content size to avoid hitting token limits (e.g., first 500 lines)
        log_lines = log_content.splitlines()
        if len(log_lines) > 500:
            print(f"Warning: Log file has {len(log_lines)} lines. Truncating to 500.")
            log_content = "\n".join(log_lines[:500])

    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Invalid file. Only UTF-8 encoded text logs are supported.")
    
    try:
        # Send to Gemini
        print("Sending to Gemini API for analysis...")
        response = await model.generate_content_async(log_content)
        
        # Parse the JSON response
        report_data = json.loads(response.text)
        
        # Validate and return the report
        return AnalysisReport(**report_data)

    except Exception as e:
        print(f"Error during Gemini API call: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing log file: {str(e)}")