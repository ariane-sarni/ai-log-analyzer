# backend/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    """
    Root endpoint for health checks.
    """
    return {"status": "ok", "message": "AI Log Analyzer backend is running!"}

# You can run this with: uvicorn backend.main:app --reload