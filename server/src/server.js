const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'YatraVerse API'
  });
});

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing on the server.' });
    }

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: 'You are the YatraVerse AI Travel Assistant, helping tourists plan trips to Nepal. You must strictly only answer questions related to Nepal tourism, trekking, hotels, guides, and travel. If the user asks anything off-topic, politely refuse to answer and tell them to only talk about what this website is about.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'Failed to generate response' });
    }

  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
