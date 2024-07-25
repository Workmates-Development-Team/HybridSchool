import express from 'express';
import cors from 'cors';
import bhashini from 'bhashini-translation';
import multer from 'multer';
import bodyParser from 'body-parser';
import fs from 'fs';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid'; 
import path from 'path';
import { dirname } from 'path';




const app = express();
const port = 3002;

app.use(cors());


app.use(bodyParser.raw({ type: 'audio/mpeg', limit: '50mb' }));

//bhashini.auth("787f1cda7ffe494b80385f987b7b48a4", "252fee7cc6-0c59-42e9-accc-72ece8d01295", "feWJIq_V_yWKEzehKNQkMtMtQv0E1t5PmVBJIeiQjhUAj0iYJ7n_Dh1PUjJB6oyq");
bhashini.auth("baaf0629e3ca4b919ca0f22c1f462b73", "45d164c346-eb2b-4ef0-970a-46ae643defb5", "81uH0Rw-pQslUW_Gzyt6KcyEXKzWGz0df7yuSMnS4SDZzBzOKsZ6zYjohvAfJrct");



app.use(express.static('public'));
// Set up multer for handling file uploads
const upload = multer();









app.post('/voice-to-text', upload.single('mp3File'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Read the uploaded MP3 file
        const mp3FileBuffer = req.file.buffer;

        // Convert the MP3 file buffer to Base64
        const mp3Base64 = mp3FileBuffer.toString('base64');
        
        // Perform voice-to-text conversion
        const result = await bhashini.asr('en', mp3Base64);

        res.json({ result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error occurred while processing voice-to-text.");
    }
});



//bhashini bengali audio to text
app.post('/voice-to-text-bn', upload.single('mp3File'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Read the uploaded MP3 file
        const mp3FileBuffer = req.file.buffer;

        // Convert the MP3 file buffer to Base64
        const mp3Base64 = mp3FileBuffer.toString('base64');

        // Perform voice-to-text conversion
        const result = await bhashini.asr('bn', mp3Base64);

        res.json({ result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error occurred while processing voice-to-text.");
    }
});

//dynamic speech to text
app.post('/voice-to-text-check', upload.single('mp3File'), async (req, res) => {
    try {
        const { lang } = req.query;

        if (!lang) {
            return res.status(400).send('Language code is required.');
        }

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Read the uploaded MP3 file
        const mp3FileBuffer = req.file.buffer;

        // Convert the MP3 file buffer to Base64
        const mp3Base64 = mp3FileBuffer.toString('base64');

        // Perform voice-to-text conversion
        const result = await bhashini.asr(lang, mp3Base64);

        res.json({ result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error occurred while processing voice-to-text.");
    }
});

app.post('/text-to-voice', async (req, res) => {
    try {
        const { sourceLang, targetLang, text, gender } = req.query;

        if (!sourceLang || !targetLang || !text || !gender) {
            console.log('Missing parameters');
            return res.status(400).send('Missing required parameters.');
        }

        // Perform text-to-speech conversion
        const result = await bhashini.nmt_tts(sourceLang, targetLang, text, gender);

        // Assuming result contains a blob URI, fetch the audio data
        const audioUri = result.audioUri; // This is the blob URI
        const audioData = await fetch(audioUri).then(res => res.arrayBuffer());

        // Generate a unique filename
        const filename = `${uuidv4()}.mp3`;
        const filePath = path.join(process.cwd(), 'public', filename);

        fs.readdirSync("./public").forEach((file) => {
            fs.unlinkSync(`./public/${file}`);
          });

        // Save the audio file
        fs.writeFileSync(filePath, Buffer.from(audioData));

        // Respond with the URL to the audio file
        res.json({ audioUrl: `/public/${filename}`});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error occurred while processing text-to-voice.");
    }
});

//api for text to voice
app.post('/text-to-voice-other', async (req, res) => {
    try {
        const { sourceLang, text, gender } = req.query;

        

        // Perform text-to-speech conversion
        //const resultText = await bhashini.nmt_tts(sourceLang, targetLang, text, gender);
        const result = await bhashini.tts(sourceLang,text,gender);

        //console.log(resultText);
        // Assuming result contains a blob URI, fetch the audio data
        const audioUri = result; // This is the blob URI
        const audioData = await fetch(audioUri).then(res => res.arrayBuffer());

        // Generate a unique filename
        const filename = `${uuidv4()}.mp3`;
        const filePath = path.join(process.cwd(), 'public', filename);

        fs.readdirSync("./public").forEach((file) => {
            fs.unlinkSync(`./public/${file}`);
          });

        // Save the audio file
        fs.writeFileSync(filePath, Buffer.from(audioData));

        // Respond with the URL to the audio file
        res.json({ audioUrl: `/${filename}`});

        //res.json({ result: result});


        // // Assuming result contains a blob URI, fetch the audio data
        // const audioUri = result.audioUri; // This is the blob URI
        // const audioData = await fetch(audioUri).then(res => res.arrayBuffer());

        // // Generate a unique filename
        // const filename = `${uuidv4()}.mp3`;
        // const filePath = path.join(process.cwd(), 'public', filename);

        // fs.readdirSync("./public").forEach((file) => {
        //     fs.unlinkSync(`./public/${file}`);
        //   });

        // // Save the audio file
        // fs.writeFileSync(filePath, Buffer.from(audioData));

        // // Respond with the URL to the audio file
        // res.json({ audioUrl: `/public/${filename}`});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error occurred while processing text-to-voice.");
    }
});







app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

