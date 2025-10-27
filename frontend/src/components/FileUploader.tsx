// frontend/src/components/FileUploader.tsx
import React, { useState, useRef, DragEvent } from 'react';
import { UploadCloud, FileText, Loader2, AlertCircle, MessageSquare } from 'lucide-react';

interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onUpload: (query: string) => void; // Updated signature
  isLoading: boolean;
  error: string | null;
}

export default function FileUploader({ file, setFile, onUpload, isLoading, error }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [query, setQuery] = useState(""); // State for the text area
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>, over: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(over);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDrag(e, false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleStartAnalysis = () => {
    if (file) {
      onUpload(query); // Pass the query string
    }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      {/* File Upload Section */}
      <div 
        className={`w-full p-8 border-2 ${isDragOver ? 'border-blue-500 bg-gray-700' : 'border-dashed border-gray-600'} bg-gray-800 rounded-lg text-center transition-all ${file ? 'hidden' : 'block'}`}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDragOver={(e) => handleDrag(e, true)}
        onDrop={handleDrop}
      >
        <UploadCloud className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Drag & drop your log file</h3>
        <p className="text-gray-400 mb-4">or</p>
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button 
          onClick={handleBrowseClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Browse File
        </button>
      </div>

      {/* File Selected & Query Section */}
      {file && (
        <div className="w-full p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              <div>
                <p className="font-medium text-white">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="text-sm text-gray-400 hover:text-white"
            >
              Change file
            </button>
          </div>

          {/* New Query Text Area */}
          <div className="w-full">
            <label htmlFor="query" className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <MessageSquare className="w-4 h-4 mr-2" />
              Specific Question (Optional)
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'What caused the SEGFAULT at 03:00?'"
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <button 
            onClick={handleStartAnalysis}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:bg-gray-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Start Analysis'
            )}
          </button>
        </div>
      )}
    </div>
  )
}