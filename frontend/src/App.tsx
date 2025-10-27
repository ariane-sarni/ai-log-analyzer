// frontend/src/App.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import AnalysisDashboard from './components/AnalysisDashboard';

// Define the API URL
const API_URL = "http://localhost:8000/api/analyze";

type AnalysisResult = any;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We add query to the handleUpload function
  const handleUpload = async (query: string) => {
    if (!file) return;

    console.log(`Uploading file: ${file.name} with query: "${query}"`);
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("query", query); // Add the query to the form data

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setAnalysis(response.data);

    } catch (err) {
      console.error("Error uploading file:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Error: ${err.response.data.detail || err.response.statusText}`);
      } else if (axios.isAxiosError(err) && err.request) {
        setError("Error: The server is not responding. Is the backend running?");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto p-8 flex flex-col items-center gap-8 w-full">
        {!analysis && (
          <FileUploader 
            file={file}
            setFile={setFile}
            onUpload={handleUpload} // onUpload now expects the query
            isLoading={isLoading}
            error={error}
          />
        )}
        
        {analysis && (
          <AnalysisDashboard 
            analysis={analysis} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  )
}

export default App