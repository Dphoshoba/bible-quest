const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 5050;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// API endpoints
app.post('/api/ask-ai', (req, res) => {
  // Mock response for now
  res.json({
    answer: "Did you know? The Bible was written over a period of about 1,500 years by 40 different authors!"
  });
});

app.post('/api/bible-books', (req, res) => {
  // Mock response for now
  res.json({
    books: ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"]
  });
});

// Handle all other routes by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 