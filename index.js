// Import required packages
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors')

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Define the /generate endpoint
app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
    // Generate content based on the prompt with custom configuration
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            }
          ],
        }
      ],
      generationConfig: {
        maxOutputTokens: 200, // Limits the number of tokens in the output
        temperature: 0.1, // Controls the creativity of the output
      },
    });
  
    // Send the generated content back to the client
    console.log('REsponse--------------', result.response.text())
    res.json({ content: result.response.text() });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Error generating content' });
  }
  
});

// Start the server
app.listen(port, () => {
  console.log(`geminiAPI running at http://localhost:${port}`);
});
