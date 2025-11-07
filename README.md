# AI-Powered Log Analyzer

A web-based tool for uploading and analyzing complex system logs using the Gemini API.

This project allows users to upload large log files (e.g., from Kubernetes, robotics, game servers) and receive an AI-powered analysis. The system automatically identifies anomalies, provides natural-language summaries, and allows users to ask specific questions about the log data.

## Features

* **File Upload:** A clean, responsive drag-and-drop file uploader.

* **AI Summary:** Automatically generates a concise summary of the log file's overall health and key events.

* **Anomaly Detection:** Identifies and lists critical, warning, and info-level anomalies, complete with timestamps and messages.

* **Specific Queries:** Users can ask specific questions (e.g., "What caused the SEGFAULT at 03:00?") to get a targeted AI-generated answer.

* **Polished UI:** A dark-mode interface with color-coded reports for easy reading.

## Tech Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Axios

* **Backend:** Python 3, FastAPI, Uvicorn

* **AI:** Google Gemini API (via `google-generativeai`)

* **Tooling:** `python-dotenv`, `pydantic`

## How to Run

You will need two terminals to run the project.

### 1. Backend (FastAPI Server)

1. **Navigate to the backend directory:**

```
cd backend
```

2. **Create and activate a virtual environment:**

```
# (If using fish shell)
python -m venv venv
source venv/bin/activate.fish
```

3. **Install Python dependencies:**

```
pip install -r requirements.txt
```

4. **Create your environment file:**

* Copy `.env.example` to a new file named `.env`.

* Add your Gemini API key to the `.env` file:
  `GEMINI_API_KEY="YOUR_API_KEY_HERE"`

5. **Run the server:**

```
uvicorn main:app --reload
```

The backend will be running at `http://localhost:8000`.

### 2. Frontend (React App)

1. **Navigate to the frontend directory:**

```
cd frontend
```

2. **Activate Node.js (if using nvm):**

```
nvm use --lts
```

3. **Install Node.js dependencies:**

```
npm install
```

4. **Run the app:**

```
npm run dev
```

The frontend will be running at `http://localhost:5173`.
