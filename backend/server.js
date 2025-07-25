import OpenAI from 'openai';
import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import webhookRoutes from './webhook.js';
import donationRoutes from './donationRoutes.js';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5050;

// Enable CORS for all routes with explicit configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://bible-quest.netlify.app', 'https://bible-quest-app.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'api-key'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Add CORS debugging middleware
app.use((req, res, next) => {
  console.log('Request origin:', req.headers.origin);
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  console.log('Request headers:', req.headers);
  next();
});

// Simple test endpoint to verify CORS is working
app.get('/api/cors-test', (req, res) => {
  console.log('CORS test endpoint hit');
  console.log('Origin:', req.headers.origin);
  console.log('Method:', req.method);
  
  res.json({
    message: 'CORS test successful!',
    origin: req.headers.origin,
    method: req.method,
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

app.use(express.json());
app.use('/webhook', webhookRoutes);
app.use('/', donationRoutes);

// Simple root endpoint to test if server is running
app.get('/', (req, res) => {
  res.json({ 
    message: 'BibleQuest Backend is running!',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Setup rate limiter for AI endpoint
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 20,
  message: {
    error: 'Too many AI requests. Please wait a few minutes before trying again.'
  }
});

// Apply rate limiter only to POST requests, not OPTIONS
app.use('/api/ask-ai', (req, res, next) => {
  if (req.method === 'OPTIONS') {
    // Skip rate limiting for preflight requests
    return next();
  }
  return aiLimiter(req, res, next);
});

app.post('/api/ask-ai', async (req, res) => {
  console.log('POST /api/ask-ai');
  
  const { prompt, character } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are Bible Buddy, a friendly AI assistant for children. Use simple, safe language with a Biblical focus. The question is about "${character}".`
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (answer) res.json({ answer });
    else res.status(500).json({ error: 'No answer from OpenAI.' });

  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Health checks
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
  console.log('GET /api/test-cors');
  console.log('Origin:', req.headers.origin);
  
  res.json({ 
    message: 'CORS test successful!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

app.get('/test-stripe', (req, res) => {
  res.json({
    message: 'Stripe Test OK',
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7)
  });
});

// Bible API proxy endpoint
app.post('/api/bible', async (req, res) => {
  console.log('\n=== Bible Passage Request ===');
  console.log('Request body:', req.body);
  
  const { bibleId, passage } = req.body;
  
  if (!process.env.BIBLE_API_KEY) {
    console.error('Bible API key not configured');
    return res.status(500).json({ error: 'Bible API key not set in backend.' });
  }
  if (!bibleId || !passage) {
    console.error('Missing required parameters:', { bibleId, passage });
    return res.status(400).json({ error: 'Missing bibleId or passage.' });
  }
  try {
    // Format the passage reference properly
    const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${passage}`;
    
    console.log('Making request to:', url);
    
    const apiRes = await fetch(url, {
      headers: { 
        'api-key': process.env.BIBLE_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    console.log('API response status:', apiRes.status);
    
    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error('Bible API error response:', errorText);
      return res.status(apiRes.status).json({ 
        error: `Bible API error: ${apiRes.status} ${apiRes.statusText}`,
        details: errorText
      });
    }
    
    const data = await apiRes.json();
    console.log('Bible API success for:', { bibleId, passage });
    res.json(data);
  } catch (err) {
    console.error('Bible API error:', err);
    res.status(500).json({ error: 'Failed to fetch Bible passage: ' + err.message });
  }
});

// Get list of books for a Bible version
app.post('/api/bible-books', async (req, res) => {
  console.log('\n=== Bible Books Request ===');
  console.log('Request body:', req.body);
  
  const { bibleId } = req.body;
  if (!process.env.BIBLE_API_KEY) {
    console.error('Bible API key not configured');
    return res.status(500).json({ error: 'Bible API key not set in backend.' });
  }
  if (!bibleId) {
    console.error('Missing bibleId');
    return res.status(400).json({ error: 'Missing bibleId.' });
  }
  try {
    const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/books`;
    console.log('Making request to:', url);
    
    const apiRes = await fetch(url, {
      headers: { 
        'api-key': process.env.BIBLE_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    console.log('API response status:', apiRes.status);
    
    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error('Bible API error response:', errorText);
      return res.status(apiRes.status).json({ 
        error: `Bible API error: ${apiRes.status} ${apiRes.statusText}`,
        details: errorText
      });
    }
    
    const data = await apiRes.json();
    console.log('Bible API success for books');
    res.json(data);
  } catch (err) {
    console.error('Bible API error:', err);
    res.status(500).json({ error: 'Failed to fetch Bible books: ' + err.message });
  }
});

// Get list of chapters for a book
app.post('/api/bible-chapters', async (req, res) => {
  console.log('\n=== Bible Chapters Request ===');
  console.log('Request body:', req.body);
  
  const { bibleId, bookId } = req.body;
  if (!process.env.BIBLE_API_KEY) {
    console.error('Bible API key not configured');
    return res.status(500).json({ error: 'Bible API key not set in backend.' });
  }
  if (!bibleId || !bookId) {
    console.error('Missing required parameters:', { bibleId, bookId });
    return res.status(400).json({ error: 'Missing bibleId or bookId.' });
  }
  try {
    const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${bookId}/chapters`;
    console.log('Making request to:', url);
    
    const apiRes = await fetch(url, {
      headers: { 
        'api-key': process.env.BIBLE_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    console.log('API response status:', apiRes.status);
    
    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error('Bible API error response:', errorText);
      return res.status(apiRes.status).json({ 
        error: `Bible API error: ${apiRes.status} ${apiRes.statusText}`,
        details: errorText
      });
    }
    
    const data = await apiRes.json();
    console.log('Bible API success for chapters');
    res.json(data);
  } catch (err) {
    console.error('Bible API error:', err);
    res.status(500).json({ error: 'Failed to fetch Bible chapters: ' + err.message });
  }
});

// Get available Bibles
app.get('/api/bibles', async (req, res) => {
  try {
    const apiRes = await fetch('https://api.scripture.api.bible/v1/bibles', {
      headers: { 'api-key': process.env.BIBLE_API_KEY }
    });
    const data = await apiRes.json();
    console.log('Available Bibles:', data);
    res.json(data);
  } catch (err) {
    console.error('Error fetching Bibles:', err);
    res.status(500).json({ error: 'Failed to fetch Bible list.' });
  }
});

// Bible search endpoint
app.post('/api/bible-search', async (req, res) => {
  console.log('\n=== Bible Search Request ===');
  console.log('Request body:', req.body);
  
  const { bibleId, query, limit = 10 } = req.body;
  
  if (!process.env.BIBLE_API_KEY) {
    console.error('Bible API key not configured');
    return res.status(500).json({ error: 'Bible API key not set in backend.' });
  }
  if (!bibleId || !query) {
    console.error('Missing required parameters:', { bibleId, query });
    return res.status(400).json({ error: 'Missing bibleId or query.' });
  }
  
  try {
    // Encode the query for URL
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/search?query=${encodedQuery}&limit=${limit}`;
    
    console.log('Making search request to:', url);
    
    const apiRes = await fetch(url, {
      headers: { 
        'api-key': process.env.BIBLE_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    console.log('Search API response status:', apiRes.status);
    
    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error('Bible Search API error response:', errorText);
      return res.status(apiRes.status).json({ 
        error: `Bible Search API error: ${apiRes.status} ${apiRes.statusText}`,
        details: errorText
      });
    }
    
    const data = await apiRes.json();
    console.log('Bible Search API success for query:', query);
    res.json(data);
  } catch (err) {
    console.error('Bible Search API error:', err);
    res.status(500).json({ error: 'Failed to search Bible: ' + err.message });
  }
});

// Root route handler
app.get('/', (req, res) => {
  res.json({
    message: 'Bible Quest API Server',
    status: 'running',
    endpoints: {
      bible: '/api/bible',
      books: '/api/bible-books',
      chapters: '/api/bible-chapters',
      search: '/api/bible-search',
      bibles: '/api/bibles',
      ai: '/api/ask-ai'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});


