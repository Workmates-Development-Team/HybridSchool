from flask import Flask, request, jsonify, send_file
from moviepy.editor import VideoFileClip
import os

app = Flask(__name__)

@app.route('/extract_audio', methods=['POST'])
def extract_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    # Save the uploaded video file
    video_path = os.path.join("uploads", file.filename)
    file.save(video_path)
    
    try:
        # Ensure the file is closed before proceeding
        file.close()
        
        # Extract audio from video
        video = VideoFileClip(video_path)
        audio_path = os.path.join("uploads", "extracted_audio.wav")
        video.audio.write_audiofile(audio_path)
        
        # Clean up temporary video file
        # os.remove(video_path)
        
        return send_file(audio_path, as_attachment=True)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(host='0.0.0.0', port=6000, debug=True)
 