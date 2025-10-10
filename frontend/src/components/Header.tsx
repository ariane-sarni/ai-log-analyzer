// frontend/src/components/Header.tsx
import { Bot } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-gray-950 p-4 border-b border-gray-700">
      <div className="container mx-auto flex items-center">
        <Bot size={32} className="text-blue-400" />
        <h1 className="ml-3 text-2xl font-bold text-white">
          AI Log Analyzer
        </h1>
      </div>
    </header>
  );
}