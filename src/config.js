// API configuration
export const API_BASE_URL = "https://bible-quest-rupb.onrender.com";

export const API_ENDPOINTS = {
  askAI: `${API_BASE_URL}/api/ask-ai`,
  createCheckoutSession: `${API_BASE_URL}/api/create-checkout-session`,
  bible: `${API_BASE_URL}/api/bible`,
  bibleBooks: `${API_BASE_URL}/api/bible-books`,
  bibleChapters: `${API_BASE_URL}/api/bible-chapters`,
  bibleSearch: `${API_BASE_URL}/api/bible-search`,
  bibles: `${API_BASE_URL}/api/bibles`,
  testCors: `${API_BASE_URL}/api/test-cors`
};

const config = {
  API_BASE_URL,
  API_ENDPOINTS
};

export default config; 