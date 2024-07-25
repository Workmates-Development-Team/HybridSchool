import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import { fileURLToPath } from "url";
import {
  AccessDeniedException,
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import fs from 'fs/promises';

const app = express();
const port = 8008;
app.use(cors());
app.use(bodyParser.json());



// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to load an image and convert it to Base64
async function loadImageAsBase64(filePath) {
  try {
    const data = await fs.readFile(filePath);
    const base64String = data.toString('base64');
    return base64String;
  } catch (error) {
    console.error('Error loading the image:', error);
    throw error;
  }
}

/**
 * Invokes the Anthropic Claude 3 model to run an inference using the input
 * provided in the request body.
 *
 * @param {string} prompt - The prompt that you want Claude to complete.
 * @param {string} imagePath - The path of the image file to be analyzed.
 * @returns {string} The inference response (completion) from the model.
 */
const invokeClaude = async (prompt, imagePath) => {
  const client = new BedrockRuntimeClient({ region: "us-east-1" });
  const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
  const imageBase64 = await loadImageAsBase64(imagePath);

  const payload = {
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: imageBase64
            }
          },
          {
            type: "text",
            text: prompt
          }
        ]
      }
    ],
    max_tokens: 500,
    temperature: 0.5,
    anthropic_version: "bedrock-2023-05-31"
  };

  const command = new InvokeModelCommand({
    body: JSON.stringify(payload),
    contentType: "application/json",
    accept: "application/json",
    modelId,
  });

  try {
    const response = await client.send(command);
    const decodedResponseBody = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(decodedResponseBody);
    return responseBody.content[0].text;
  } catch (err) {
    if (err instanceof AccessDeniedException) {
      console.error(
        `Access denied. Ensure you have the correct permissions to invoke ${modelId}.`,
      );
    } else {
      throw err;
    }
  }
};

// API endpoint for image upload and question
app.post("/invoke-claude-image", upload.single('image'), async (req, res) => {
  const  prompt  = "Give me the details of this picture"; // Extract prompt from request body
  const imagePath = req.file.path; // Get path of uploaded image

  try {
    const completion = await invokeClaude(prompt, imagePath);
    res.json({ completion });
    await fs.unlink(imagePath); // Delete the uploaded image file
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
