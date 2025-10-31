// frontend/src/components/AnomalyItem.tsx
import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

type AnomalyType = 'info' | 'warning' | 'error';

interface Anomaly {
  type: AnomalyType;
  timestamp: string;
  message: string;
}

interface AnomalyItemProps {
  anomaly: Anomaly;
}

const anomalyConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-900/30',
    borderColor: 'border-blue-700',
    iconColor: 'text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-900/30',
    borderColor: 'border-yellow-700',
    iconColor: 'text-yellow-400',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-900/30',
    borderColor: 'border-red-700',
    iconColor: 'text-red-400',
  },
};

export default function AnomalyItem({ anomaly }: AnomalyItemProps) {
  const config = anomalyConfig[anomaly.type] || anomalyConfig.info;
  const Icon = config.icon;

  return (
    <div className={`w-full p-4 rounded-lg border ${config.bgColor} ${config.borderColor} flex gap-4`}>
      <Icon className={`w-5 h-5 mt-1 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-grow">
        <p className="font-mono text-sm text-gray-400">{anomaly.timestamp}</p>
        <p className="text-white mt-1">{anomaly.message}</p>
      </div>
    </div>
  );
}