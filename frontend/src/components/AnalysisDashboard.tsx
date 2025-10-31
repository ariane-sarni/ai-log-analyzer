// frontend/src/components/AnalysisDashboard.tsx
import React from 'react';
import { Bot, RefreshCw } from 'lucide-react';
import AnomalyItem from './AnomalyItem'; // Import the new component

// Define the types
type AnomalyType = 'info' | 'warning' | 'error';
interface Anomaly {
  type: AnomalyType;
  timestamp: string;
  message: string;
}
interface AnalysisReport {
  summary: string;
  anomalies: Anomaly[];
}

interface AnalysisDashboardProps {
  analysis: AnalysisReport | null;
  onReset: () => void;
}

export default function AnalysisDashboard({ analysis, onReset }: AnalysisDashboardProps) {

  if (!analysis) {
    return (
      <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Analysis Report</h2>
        <p className="text-gray-400">No analysis data available.</p>
      </div>
    );
  }

  const { summary, anomalies } = analysis;

  return (
    <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-lg shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Analysis Report</h2>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Analyze New File
        </button>
      </div>

      {/* AI Summary Section */}
      <div className="mb-8">
        <h3 className="flex items-center text-xl font-semibold text-gray-200 mb-3">
          <Bot className="w-5 h-5 mr-2 text-blue-400" />
          AI Summary
        </h3>
        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
          {summary ? (
            <p className="text-gray-300 leading-relaxed">{summary}</p>
          ) : (
            <p className="text-gray-500">No data was provided for analysis. The system health cannot be determined from the current input.</p>
          )}
        </div>
      </div>

      {/* Detected Anomalies Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-200 mb-3">
          Detected Anomalies
        </h3>
        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
          {anomalies && anomalies.length > 0 ? (
            <div className="flex flex-col gap-3">
              {anomalies.map((anomaly, index) => (
                <AnomalyItem key={index} anomaly={anomaly} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No anomalies were detected in this log file.</p>
          )}
        </div>
      </div>
    </div>
  );
}