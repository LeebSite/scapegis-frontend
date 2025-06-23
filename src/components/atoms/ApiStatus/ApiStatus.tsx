import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { apiClient } from '../../../services/api';

interface ApiStatusProps {
  className?: string;
}

type ConnectionStatus = 'checking' | 'connected' | 'disconnected' | 'error';

const ApiStatus: React.FC<ApiStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkApiHealth = async () => {
    setStatus('checking');
    try {
      const response = await apiClient.get('/health');
      if (response.status === 200) {
        setStatus('connected');
        setLastChecked(new Date());
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('API Health Check Failed:', error);
      setStatus('disconnected');
    }
  };

  useEffect(() => {
    checkApiHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader className="w-4 h-4 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'connected':
        return 'API Connected';
      case 'disconnected':
        return 'API Disconnected';
      case 'error':
        return 'API Error';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-blue-600';
      case 'connected':
        return 'text-green-600';
      case 'disconnected':
        return 'text-red-600';
      case 'error':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      {lastChecked && status === 'connected' && (
        <span className="text-xs text-gray-500">
          ({lastChecked.toLocaleTimeString()})
        </span>
      )}
      <button
        onClick={checkApiHealth}
        className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
        disabled={status === 'checking'}
      >
        Refresh
      </button>
    </div>
  );
};

export default ApiStatus;
