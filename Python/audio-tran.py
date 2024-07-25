# Latest code 


import os
import asyncio
import sounddevice as sd
from flask import Flask, request, jsonify
from amazon_transcribe.client import TranscribeStreamingClient
from amazon_transcribe.handlers import TranscriptResultStreamHandler
from amazon_transcribe.model import TranscriptEvent
from tempfile import NamedTemporaryFile

app = Flask(__name__)

class MyEventHandler(TranscriptResultStreamHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.transcripts = []
        self.last_transcript = ""

    async def handle_transcript_event(self, transcript_event: TranscriptEvent):
        results = transcript_event.transcript.results
        for result in results:
            if not result.is_partial:
                for alt in result.alternatives:
                    self.transcripts.append(alt.transcript)
                    self.last_transcript = alt.transcript

async def transcribe_audio(audio_path):
    client = TranscribeStreamingClient(region="us-west-2")
    stream = await client.start_stream_transcription(
        language_code="en-US",
        media_sample_rate_hz=16000,
        media_encoding="pcm",
    )
    handler = MyEventHandler(stream.output_stream)

    async def write_chunks():
        with open(audio_path, "rb") as audio_file:
            while chunk := audio_file.read(1024):
                await stream.input_stream.send_audio_event(audio_chunk=chunk)
        await stream.input_stream.end_stream()

    await asyncio.gather(write_chunks(), handler.handle_events())
    return handler.transcripts

@app.route("/transcribe", methods=["POST"])
def transcribe():
    if 'file' not in request.files:
        return jsonify(error="No file part"), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify(error="No selected file"), 400

    if file:
        with NamedTemporaryFile(delete=False) as temp_file:
            file.save(temp_file.name)
            audio_path = temp_file.name

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            transcripts = loop.run_until_complete(transcribe_audio(audio_path))
        finally:
            loop.close()
            os.remove(audio_path)  # Clean up the temporary file

        final_transcript = " ".join(transcripts)
        return jsonify(transcript=final_transcript)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
 