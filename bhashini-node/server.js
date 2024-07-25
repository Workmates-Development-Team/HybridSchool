import express from 'express';
import cors from 'cors';
import bhashini from 'bhashini-translation';
import multer from 'multer';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.raw({ type: 'audio/mpeg', limit: '50mb' }));
bhashini.auth("baaf0629e3ca4b919ca0f22c1f462b73", "45d164c346-eb2b-4ef0-970a-46ae643defb5", "81uH0Rw-pQslUW_Gzyt6KcyEXKzWGz0df7yuSMnS4SDZzBzOKsZ6zYjohvAfJrct");

// Set up multer for handling file uploads
const upload = multer();

// Function to split audio file into segments of specified duration (in seconds)
function splitAudioFile(audioBuffer, durationInSeconds = 30) {
    const segments = [];
    const bytesPerSegment = audioBuffer.length / (audioBuffer.duration * 1000) * durationInSeconds;

    for (let i = 0; i < audioBuffer.length; i += bytesPerSegment) {
        const segment = audioBuffer.slice(i, i + bytesPerSegment);
        segments.push(segment);
    }

    return segments;
}

// Route to process voice-to-text
app.post('/voice-to-text', upload.single('mp3File'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Read the uploaded MP3 file
        const mp3FileBuffer = req.file.buffer;

        // Split the audio file into segments if it's longer than 30 seconds
        const segments = splitAudioFile(mp3FileBuffer, 30);

        // Process each segment and save as MP3 locally
        const results = [];
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const segmentFileName = `segment_${i + 1}.mp3`;
            fs.writeFileSync(segmentFileName, segment);
            results.push(segmentFileName);
        }

        res.json({ results });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error occurred while processing voice-to-text.");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
