// frontend/src/App.tsx
import { useState } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import AnalysisDashboard from './components/AnalysisDashboard';

// We'll define a type for our analysis results later
type AnalysisResult = any;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = () => {
    if (!file) return;

    console.log("Uploading file:", file.name);
    setIsLoading(true);
    
    // TODO: Actually send the file to the backend
    // For now, just simulate a successful analysis
    setTimeout(() => {
      setAnalysis({
        summary: `The log file '${file.name}' shows 3 critical errors, 12 warnings, and 1 segmentation fault. The primary anomaly occurred at 03:00:15...`,
        anomalies: [
          { type: 'error', timestamp: '03:00:15', message: 'SEGFAULT (Core Dumped)' },
          { type: 'warning', timestamp: '02:45:10', message: "Connection timeout to 'db-primary'." },
          { type: 'info', timestamp: '01:15:02', message: 'System boot successful.' },
        ]
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto p-8 flex flex-col items-center gap-8 w-full">
        {!analysis && (
          <FileUploader 
            file={file}
            setFile={setFile}
            onUpload={handleUpload}
            isLoading={isLoading}
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