const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import cors
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Use cors middleware
app.use(express.json());

app.post('/api/openai', async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4-0314',
      messages,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    res.status(500).json({ error: 'Error communicating with OpenAI API' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


