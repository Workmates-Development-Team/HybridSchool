import express from "express";
import cors from "cors";
import { AccessDeniedException, BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import fs from "fs";

const app = express();
const port = 8001;
app.use(cors());

// Initialize your BedrockRuntimeClient
const client = new BedrockRuntimeClient({
  region: 'us-east-1',
  AWS_ACCESS_KEY_ID: '',
  AWS_SECRET_ACCESS_KEY: '',
});

// Define your invokeClaude function
const invokeClaude = async (imageBase64) => {
  const modelId = "anthropic.claude-3-haiku-20240307-v1:0";

  const payload = {
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: {
              source: "upload",
              data: imageBase64,
            },
          },
        ],
      },
    ],
    max_tokens: 500,
    temperature: 1,
    anthropic_version: "bedrock-2023-05-31",
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
    const completion = responseBody.content[0].text;

    return completion;
  } catch (err) {
    if (err instanceof AccessDeniedException) {
      console.error(
        `Access denied. Ensure you have the correct permissions to invoke ${modelId}.`
      );
      throw err;
    } else {
      throw err;
    }
  }
};

// Define an API endpoint for uploading and invoking the model with an image
app.post("/invoke-claude-static", async (req, res) => {
  try {
    // Get the file path from the request body
    const { filePath } = req.body;

    // Read the image file as a buffer
    const imageBuffer = fs.readFileSync(filePath);

    // Convert the buffer to base64
    const imageBase64 = imageBuffer.toString('base64');

    // Invoke the model with the base64 image data
    const completion = await invokeClaude(imageBase64);

    // Return the completion as JSON
    res.json({ completion });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
