// frontend/src/components/FileUploader.tsx
import React, { useState, useRef, DragEvent } from 'react'; // <-- THIS IS THE FIX
import { UploadCloud, FileText, Loader2, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onUpload: () => void;
  isLoading: boolean;
  error: string | null; // New error prop
}

export default function FileUploader({ file, setFile, onUpload, isLoading, error }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ... (file change and drag/drop handlers remain the same) ...
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const dropzoneClasses = `border-2 border-dashed border-gray-600 rounded-lg p-12 text-center text-gray-400 transition-colors ${
    isDragging ? 'border-blue-400 bg-gray-700' : 'hover:border-blue-400'
  } ${error ? 'border-red-500' : ''}`; // Highlight border on error

  return (
    <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-white text-center">Upload Log File</h2>

      <input 
        type="file" 
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".log,.txt,text/plain"
      />

      {!file && (
        <div 
          className={dropzoneClasses}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud size={48} className="mx-auto" />
          <p className="mt-4">Drag and drop your log file here</p>
          <p className="text-sm text-gray-500">or</p>
          <button 
            onClick={handleBrowseClick}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Files
          </button>
        </div>
      )}

      {file && (
        <div className="text-center">
          <FileText size={48} className="mx-auto text-blue-400" />
          <p className="mt-4 text-lg font-medium text-white">{file.name}</p>
          <p className="text-sm text-gray-400">({(file.size / 1024).toFixed(2)} KB)</p>
          
          <div className="mt-6 flex justify-center gap-4">
            <button 
              onClick={() => setFile(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
              disabled={isLoading}
            >
              Clear
            </button>
            <button 
              onClick={onUpload}
              className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors w-36"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={24} className="mx-auto animate-spin" />
              ) : (
                'Start Analysis'
              )}
            </button>
          </div>
        </div>
      )}

      {/* New Error Message Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}