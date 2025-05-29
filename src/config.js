// API configuration
export const API_BASE_URL = 'http://192.168.68.70:5050';  // Your local IP address

export const API_ENDPOINTS = {
  askAI: `${API_BASE_URL}/api/ask-ai`,
  createCheckoutSession: `${API_BASE_URL}/api/create-checkout-session`,
  bible: `${API_BASE_URL}/api/bible`,
  bibleBooks: `${API_BASE_URL}/api/bible-books`,
  bibleChapters: `${API_BASE_URL}/api/bible-chapters`,
  // Add other endpoints as needed
};

export default {
  API_BASE_URL,
  API_ENDPOINTS
}; 