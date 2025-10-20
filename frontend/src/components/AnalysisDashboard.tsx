// frontend/src/components/AnalysisDashboard.tsx
import React from 'react'; // <-- THIS IS THE FIX
import { AlertTriangle, CheckCircle, Info, RefreshCcw } from 'lucide-react';

// Define a simple type for an anomaly
interface Anomaly {
  type: 'info' | 'warning' | 'error';
  timestamp: string;
  message: string;
}

// Define the shape of the analysis prop
interface AnalysisDashboardProps {
  analysis: {
    summary: string;
    anomalies: Anomaly[];
  };
  onReset: () => void;
}

const iconMap = {
  info: <CheckCircle size={18} className="mr-2 text-green-400" />,
  warning: <AlertTriangle size={18} className="mr-2 text-yellow-400" />,
  error: <AlertTriangle size={18} className="mr-2 text-red-400" />,
};

const colorMap = {
  info: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
};

export default function AnalysisDashboard({ analysis, onReset }: AnalysisDashboardProps) {
  if (!analysis) {
    return (
      <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-lg shadow-lg text-gray-400 text-center">
        <Info size={32} className="mx-auto mb-4" />
        <p>Upload a file to see the analysis dashboard.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl p-8 bg-gray-800 rounded-lg shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-white">Analysis Report</h2>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw size={18} />
          Analyze New File
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-medium text-white mb-3">AI Summary</h3>
          <p className="text-gray-300 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* Anomalies Card */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-medium text-white mb-4">Detected Anomalies</h3>
          <ul className="mt-2 space-y-3">
            {analysis.anomalies.map((anomaly, index) => (
              <li key={index} className={`flex items-center ${colorMap[anomaly.type]}`}>
                {iconMap[anomaly.type]}
                <span className="font-mono text-sm mr-4">[{anomaly.timestamp}]</span>
                <span className="text-gray-300">{anomaly.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}