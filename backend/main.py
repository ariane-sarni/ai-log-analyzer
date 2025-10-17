# backend/main.py
import time
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal

app = FastAPI(
    title="AI Log Analyzer API",
    description="API for uploading and analyzing log files.",
    version="0.1.0"
)

# --- CORS Configuration ---
# This is crucial to allow the React frontend
# (running on a different port) to communicate with the API.
origins = [
    "http://localhost:5173",  # Default Vite dev server port
    "http://localhost:3000",  # Common alternative
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# --- Pydantic Models (for response structure) ---

class Anomaly(BaseModel):
    type: Literal['info', 'warning', 'error']
    timestamp: str
    message: str

class AnalysisReport(BaseModel):
    summary: str
    anomalies: List[Anomaly]

# --- API Endpoints ---

@app.get("/")
def read_root():
    """
    Health check endpoint.
    """
    return {"status": "ok", "message": "AI Log Analyzer API is running."}


@app.post("/api/analyze", response_model=AnalysisReport)
async def analyze_log_file(file: UploadFile = File(...)):
    """
    Receives a log file, simulates analysis, and returns a report.
    """
    print(f"Received file: {file.filename}, Content-Type: {file.content_type}, Size: {file.size}")
    
    # Simulate a time-consuming analysis
    time.sleep(2) 
    
    # In a real app, this is where we would:
    # 1. Read the file (await file.read())
    # 2. Send it to the Gemini API
    # 3. Parse the response and return it

    # For now, return a hardcoded "mock" response
    mock_response = {
        "summary": f"The log file '{file.filename}' shows 3 critical errors, 12 warnings, and 1 segmentation fault. The primary anomaly occurred at 03:00:15...",
        "anomalies": [
            {"type": "error", "timestamp": "03:00:15", "message": "SEGFAULT (Core Dumped)"},
            {"type": "warning", "timestamp": "02:45:10", "message": "Connection timeout to 'db-primary'."},
            {"type": "info", "timestamp": "01:15:02", "message": "System boot successful."}
        ]
    }
    
    return mock_response