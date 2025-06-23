import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { projectsApi, layersApi, apiClient } from '../../../services/api';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  duration?: number;
  error?: any;
}

const IntegrationTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (name: string, updates: Partial<TestResult>) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, ...updates } : test
    ));
  };

  const runIntegrationTests = async () => {
    setIsRunning(true);
    
    const testSuite: TestResult[] = [
      { name: 'Backend Health Check', status: 'pending' },
      { name: 'API v1 Test', status: 'pending' },
      { name: 'Supabase Connection', status: 'pending' },
      { name: 'Create Project', status: 'pending' },
      { name: 'Get Recent Projects', status: 'pending' },
      { name: 'Create Layer', status: 'pending' },
      { name: 'Get Project Layers', status: 'pending' },
      { name: 'Update Project', status: 'pending' },
      { name: 'Delete Test Data', status: 'pending' }
    ];
    
    setTests(testSuite);

    let testProjectId: string | null = null;
    let testLayerId: string | null = null;

    // Test 1: Health Check
    try {
      updateTest('Backend Health Check', { status: 'running' });
      const start = Date.now();
      await apiClient.get('/health');
      updateTest('Backend Health Check', { 
        status: 'success', 
        message: 'Backend is healthy',
        duration: Date.now() - start
      });
    } catch (error) {
      updateTest('Backend Health Check', { 
        status: 'error', 
        message: 'Backend not responding',
        error
      });
    }

    // Test 2: API v1 Test
    try {
      updateTest('API v1 Test', { status: 'running' });
      const start = Date.now();
      const response = await apiClient.get('/api/v1/test');
      updateTest('API v1 Test', { 
        status: 'success', 
        message: `API working: ${response.data.message}`,
        duration: Date.now() - start
      });
    } catch (error) {
      updateTest('API v1 Test', { 
        status: 'error', 
        message: 'API v1 endpoint failed',
        error
      });
    }

    // Test 3: Supabase Connection
    try {
      updateTest('Supabase Connection', { status: 'running' });
      const start = Date.now();
      const response = await apiClient.get('/api/v1/test/supabase');
      updateTest('Supabase Connection', { 
        status: 'success', 
        message: `Database connected: ${response.data.database}`,
        duration: Date.now() - start
      });
    } catch (error) {
      updateTest('Supabase Connection', { 
        status: 'error', 
        message: 'Supabase connection failed',
        error
      });
    }

    // Test 4: Create Project
    try {
      updateTest('Create Project', { status: 'running' });
      const start = Date.now();
      const response = await projectsApi.create({
        name: 'Integration Test Project',
        description: 'Test project created by integration test',
        settings: { mapCenter: [0, 0], mapZoom: 2 }
      });
      testProjectId = response.data.data.id;
      updateTest('Create Project', {
        status: 'success',
        message: `Project created: ${testProjectId}`,
        duration: Date.now() - start
      });
    } catch (error: any) {
      console.error('Create Project Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      const statusCode = error.response?.status || 'No status';
      updateTest('Create Project', {
        status: 'error',
        message: `Failed to create project: ${statusCode} - ${errorMessage}`,
        error
      });
    }

    // Test 5: Get Recent Projects
    try {
      updateTest('Get Recent Projects', { status: 'running' });
      const start = Date.now();
      const response = await projectsApi.getRecent(5);
      updateTest('Get Recent Projects', {
        status: 'success',
        message: `Found ${response.data.data.length} recent projects`,
        duration: Date.now() - start
      });
    } catch (error: any) {
      console.error('Get Recent Projects Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      const statusCode = error.response?.status || 'No status';
      updateTest('Get Recent Projects', {
        status: 'error',
        message: `Failed to get recent projects: ${statusCode} - ${errorMessage}`,
        error
      });
    }

    // Test 6: Create Layer (if project was created)
    if (testProjectId) {
      try {
        updateTest('Create Layer', { status: 'running' });
        const start = Date.now();
        const response = await layersApi.create({
          name: 'Test Layer',
          description: 'Test layer for integration test',
          project_id: testProjectId,
          layer_type: 'vector',
          style_config: { color: '#ff0000' }
        });
        testLayerId = response.data.data.id;
        updateTest('Create Layer', { 
          status: 'success', 
          message: `Layer created: ${testLayerId}`,
          duration: Date.now() - start
        });
      } catch (error) {
        updateTest('Create Layer', { 
          status: 'error', 
          message: 'Failed to create layer',
          error
        });
      }

      // Test 7: Get Project Layers
      try {
        updateTest('Get Project Layers', { status: 'running' });
        const start = Date.now();
        const response = await layersApi.getByProject(testProjectId);
        updateTest('Get Project Layers', { 
          status: 'success', 
          message: `Found ${response.data.data.length} layers`,
          duration: Date.now() - start
        });
      } catch (error) {
        updateTest('Get Project Layers', { 
          status: 'error', 
          message: 'Failed to get project layers',
          error
        });
      }

      // Test 8: Update Project
      try {
        updateTest('Update Project', { status: 'running' });
        const start = Date.now();
        await projectsApi.update(testProjectId, {
          id: testProjectId,
          name: 'Updated Integration Test Project',
          description: 'Updated by integration test'
        });
        updateTest('Update Project', { 
          status: 'success', 
          message: 'Project updated successfully',
          duration: Date.now() - start
        });
      } catch (error) {
        updateTest('Update Project', { 
          status: 'error', 
          message: 'Failed to update project',
          error
        });
      }

      // Test 9: Cleanup - Delete Test Data
      try {
        updateTest('Delete Test Data', { status: 'running' });
        const start = Date.now();
        await projectsApi.delete(testProjectId);
        updateTest('Delete Test Data', { 
          status: 'success', 
          message: 'Test data cleaned up',
          duration: Date.now() - start
        });
      } catch (error) {
        updateTest('Delete Test Data', { 
          status: 'error', 
          message: 'Failed to cleanup test data',
          error
        });
      }
    } else {
      updateTest('Create Layer', { status: 'error', message: 'Skipped - no project created' });
      updateTest('Get Project Layers', { status: 'error', message: 'Skipped - no project created' });
      updateTest('Update Project', { status: 'error', message: 'Skipped - no project created' });
      updateTest('Delete Test Data', { status: 'error', message: 'Skipped - no project created' });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const totalTests = tests.length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Frontend-Backend Integration Test</h2>
          <p className="text-sm text-gray-600 mt-1">
            Test all API endpoints and functionality
          </p>
        </div>
        <button
          onClick={runIntegrationTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>

      {tests.length > 0 && (
        <>
          {/* Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span>Progress: {successCount + errorCount}/{totalTests}</span>
              <div className="flex items-center gap-4">
                <span className="text-green-600">✓ {successCount} passed</span>
                <span className="text-red-600">✗ {errorCount} failed</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((successCount + errorCount) / totalTests) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <span className={`font-medium ${getStatusColor(test.status)}`}>
                      {test.name}
                    </span>
                    {test.message && (
                      <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                    )}
                  </div>
                </div>
                {test.duration && (
                  <span className="text-xs text-gray-500">{test.duration}ms</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default IntegrationTest;
