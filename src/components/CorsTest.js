import React, { useState } from 'react';
import { API_ENDPOINTS, API_BASE_URL } from '../config.js';

function CorsTest() {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testRootEndpoint = async () => {
    setLoading(true);
    setError('');
    setTestResult('');
    
    try {
      console.log('Testing root endpoint:', API_BASE_URL);
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Root Response status:', response.status);
      console.log('Root Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Root Response data:', data);
      setTestResult(JSON.stringify(data, null, 2));
      
    } catch (err) {
      console.error('Root endpoint test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testCors = async () => {
    setLoading(true);
    setError('');
    setTestResult('');
    
    try {
      console.log('Testing CORS with endpoint:', API_ENDPOINTS.testCors);
      
      const response = await fetch(API_ENDPOINTS.testCors, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      setTestResult(JSON.stringify(data, null, 2));
      
    } catch (err) {
      console.error('CORS test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testAiEndpoint = async () => {
    setLoading(true);
    setError('');
    setTestResult('');
    
    try {
      console.log('Testing AI endpoint:', API_ENDPOINTS.askAI);
      
      const response = await fetch(API_ENDPOINTS.askAI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Hello, this is a test message.',
          character: 'general'
        }),
      });
      
      console.log('AI Response status:', response.status);
      console.log('AI Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('AI Response data:', data);
      setTestResult(JSON.stringify(data, null, 2));
      
    } catch (err) {
      console.error('AI endpoint test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: '#fff',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '15px',
      zIndex: 3000,
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>CORS Test</h3>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={testRootEndpoint}
          disabled={loading}
          style={{
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '12px'
          }}
        >
          {loading ? 'Testing...' : 'Test Root'}
        </button>
        
        <button 
          onClick={testCors}
          disabled={loading}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '12px'
          }}
        >
          {loading ? 'Testing...' : 'Test CORS'}
        </button>
        
        <button 
          onClick={testAiEndpoint}
          disabled={loading}
          style={{
            background: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '12px'
          }}
        >
          {loading ? 'Testing...' : 'Test AI'}
        </button>
      </div>
      
      {error && (
        <div style={{ 
          color: 'red', 
          fontSize: '12px', 
          marginBottom: '10px',
          background: '#ffe6e6',
          padding: '8px',
          borderRadius: '4px'
        }}>
          Error: {error}
        </div>
      )}
      
      {testResult && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '8px', 
          borderRadius: '4px',
          fontSize: '11px',
          maxHeight: '200px',
          overflow: 'auto',
          border: '1px solid #dee2e6'
        }}>
          <strong>Result:</strong>
          <pre style={{ margin: '5px 0 0 0', whiteSpace: 'pre-wrap' }}>
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
}

export default CorsTest; 