import React, { useState } from 'react';
import { API_ENDPOINTS, API_BASE_URL } from '../config.js';

function CorsTest() {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message, success = true) => {
    setTestResults(prev => [...prev, {
      message,
      success,
      timestamp: new Date().toISOString()
    }]);
  };

  const testCors = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    addResult('Starting CORS tests...', true);
    
    try {
      // Test 1: Simple GET request
      addResult('Testing simple GET request...', true);
      console.log('Testing CORS with endpoint:', API_ENDPOINTS.corsTest);
      
      const response = await fetch(API_ENDPOINTS.corsTest, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ GET request successful: ${data.message}`, true);
        console.log('CORS test response:', data);
      } else {
        addResult(`❌ GET request failed: ${response.status} ${response.statusText}`, false);
      }
    } catch (error) {
      addResult(`❌ GET request error: ${error.message}`, false);
      console.error('CORS test error:', error);
    }

    try {
      // Test 2: POST request (like the Bible API calls)
      addResult('Testing POST request...', true);
      console.log('Testing AI endpoint:', API_ENDPOINTS.askAI);
      
      const response = await fetch(API_ENDPOINTS.askAI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          prompt: 'Hello',
          character: 'David'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ POST request successful: ${data.answer ? 'AI responded' : 'No answer'}`, true);
      } else {
        addResult(`❌ POST request failed: ${response.status} ${response.statusText}`, false);
      }
    } catch (error) {
      addResult(`❌ POST request error: ${error.message}`, false);
      console.error('AI test error:', error);
    }

    try {
      // Test 3: Bible books endpoint
      addResult('Testing Bible books endpoint...', true);
      
      const response = await fetch(API_ENDPOINTS.bibleBooks, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          bibleId: 'de4e12af7f28f599-02'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Bible books request successful: ${data.data ? data.data.length + ' books' : 'No data'}`, true);
      } else {
        addResult(`❌ Bible books request failed: ${response.status} ${response.statusText}`, false);
      }
    } catch (error) {
      addResult(`❌ Bible books request error: ${error.message}`, false);
      console.error('Bible books test error:', error);
    }

    setIsLoading(false);
    addResult('CORS tests completed!', true);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>CORS Test</h2>
      <p>This will test the connection to your backend API and check for CORS issues.</p>
      
      <button 
        onClick={testCors} 
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Testing...' : 'Run CORS Tests'}
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Test Results:</h3>
        {testResults.map((result, index) => (
          <div 
            key={index} 
            style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor: result.success ? '#d4edda' : '#f8d7da',
              border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '5px',
              color: result.success ? '#155724' : '#721c24'
            }}
          >
            {result.message}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Backend URL:</strong> {API_BASE_URL}</p>
        <p><strong>Frontend Origin:</strong> {window.location.origin}</p>
      </div>
    </div>
  );
}

export default CorsTest; 