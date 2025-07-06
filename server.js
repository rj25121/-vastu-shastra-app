// A simple Express server to act as a proxy for the Gemini API
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// Use express.json() to parse JSON bodies
app.use(express.json());

// Serve the static files from the root directory
app.use(express.static(__dirname));

// Create a proxy endpoint for the Gemini API
app.post('/gemini-proxy', async (req, res) => {
  // Get the prompt from the request body sent by the frontend
  const userPrompt = req.body.prompt;
  
  // Get your secret API key from the environment variables
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not found on the server.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: userPrompt }] }]
  };

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to call Gemini API.' });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Listen for requests
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

