import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import IntegrationTestComponent from '../../components/molecules/IntegrationTest';
import BackendDebug from '../../components/molecules/BackendDebug';

const IntegrationTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SG</span>
              </div>
              <span className="font-semibold text-gray-900">ScapeGIS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Integration Testing</h1>
          <p className="text-gray-600 mt-2">
            Test the integration between frontend and backend systems. Make sure your backend is running on{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">http://localhost:8001</code>
          </p>
        </div>

        <IntegrationTestComponent />

        {/* Debug Component */}
        <div className="mt-8">
          <BackendDebug />
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Before Running Tests:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Make sure your backend FastAPI server is running on <code>http://localhost:8001</code></li>
            <li>Ensure Supabase database is configured and accessible</li>
            <li>Check that all required environment variables are set</li>
            <li>Verify CORS is configured to allow <code>http://localhost:3000</code></li>
          </ol>
        </div>

        {/* Backend Status */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Backend Check:</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Backend API:</strong>{' '}
              <a 
                href="http://localhost:8001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                http://localhost:8001
              </a>
            </div>
            <div>
              <strong>API Documentation:</strong>{' '}
              <a 
                href="http://localhost:8001/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                http://localhost:8001/docs
              </a>
            </div>
            <div>
              <strong>Health Check:</strong>{' '}
              <a 
                href="http://localhost:8001/health" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                http://localhost:8001/health
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTestPage;
