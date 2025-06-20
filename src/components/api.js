// API configuration
const getBaseUrl = () => {
  // For development
  if (process.env.NODE_ENV === 'development') {
    return 'http://192.168.68.70:5050';
  }
  
  // For production
  if (window.location.protocol === 'https:') {
    return 'https://bible-quest-backend.onrender.com';
  }
  
  // For local testing on device
  const hostname = window.location.hostname;
  return `http://${hostname}:5050`;
};

export const API_BASE_URL = getBaseUrl();

// Add error handling wrapper
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response;
};

// API endpoints with error handling
export const API_ENDPOINTS = {
  askAI: `${API_BASE_URL}/api/ask-ai`,
  createCheckoutSession: `${API_BASE_URL}/api/create-checkout-session`,
  bible: `${API_BASE_URL}/api/bible`,
  bibleBooks: `${API_BASE_URL}/api/bible-books`,
  bibleChapters: `${API_BASE_URL}/api/bible-chapters`,
  bibles: `${API_BASE_URL}/api/bibles`
};

// Helper functions for API calls
export const fetchApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    await handleApiError(response);
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

const apiConfig = {
  API_BASE_URL,
  API_ENDPOINTS,
  fetchApi
};

export default apiConfig;
