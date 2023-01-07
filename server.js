const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const server = express();

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

const request = async () => {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
            message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }

    const animal = req.body.animal || '';

    if (animal.trim().length === 0) {
        res.status(400).json({
            error: {
            message: "Please enter a valid animal",
            }
        });
        return;
    }

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(animal),
            temperature: 0.6,
        });
        res.status(200).json({ result: completion.data.choices[0].text });
    } catch(error) {
        // Consider adjusting the error handling logic for your use case
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
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(bodyParser.json());

server.get("/", (req, res) => {
  res.send("Plaza Order Online");
});

server.use("/order", OrderRouter);

module.exports = server;