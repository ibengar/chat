const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");

const server = express();
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(bodyParser.json());

const configuration = new Configuration({apiKey: process.env.OPENAI_API_KEY});

const openai = new OpenAIApi(configuration);

server.get("/", (req, res) => {
  res.send("Chat GPT API");
});

server.post("/api/translate", async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
    error: { message: "OpenAI API key not configured, please follow instructions in README.md" }
    });
    return;
  }

  const from = req.body.from;
  const to = req.body.to;
  const text = req.body.text || '';

  if (text.length === 0) {
    res.status(400).json({
      error: {
        message: text,
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      max_tokens: 1000,
      prompt: `Translate ${text} from ${from} to ${to}`,
      temperature: 0.1,
    });
    res.status(200).json({ result: completion.data.choices[0]?.text?.slice(2) });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
})

server.post("/api/english-dari", async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
    error: { message: "OpenAI API key not configured, please follow instructions in README.md" }
    });
    return;
  }

  const text = req.body.text || '';

  if (text.length === 0) {
    res.status(400).json({
      error: {
        message: text,
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      max_tokens: 1000,
      prompt: `Translate the following English phrase into modern Afghan Dari. You can only respond using letters from the English alphabet: ${text}`,
      temperature: 0.1,
    });
    res.status(200).json({ result: completion.data.choices[0].text?.slice(2) });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
})

server.post('/api/bedtime-story', async (req, res) => {
    if (!configuration.apiKey) {
        res.status(500).json({
        error: { message: "OpenAI API key not configured, please follow instructions in README.md" }
        });
        return;
    }

    const text = req.body.text || '';

    if (text.length === 0) {
      res.status(400).json({
        error: {
          message: "Please enter a valid prompt",
        }
      });
      return;
    }

    try {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          max_tokens: 1000,
          prompt: `Tell me a story about ${text}`,
          temperature: 0.6,
        });
        res.status(200).json({ result: completion.data.choices[0].text?.slice(2) });
      } catch(error) {
        if (error.response) {
          console.error(error.response.status, error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else {
          console.error(`Error with OpenAI API request: ${error.message}`);
          res.status(500).json({
            error: {
              message: 'An error occurred during your request.',
            }
          });
        }
      }
});

module.exports = server;