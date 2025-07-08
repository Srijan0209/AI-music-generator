from flask import Flask, request, jsonify, Response
from transformers import MusicgenForConditionalGeneration, AutoProcessor
import torch
from flask_cors import CORS
import wave
import numpy as np
from io import BytesIO

app = Flask(__name__)

# Enable CORS for React frontend
CORS(app, origins=["http://localhost:5173"])

# Load the model and processor with correct configuration
model_name = "facebook/musicgen-small"
device = "cuda" if torch.cuda.is_available() else "cpu"

model = MusicgenForConditionalGeneration.from_pretrained(
    model_name, 
    attn_implementation="eager"  # Fix attention issue
).to(device)

processor = AutoProcessor.from_pretrained(model_name)

@app.route('/generate', methods=['POST'])
def generate_music():
    try:
        data = request.json
        prompt = data.get("prompt", "A soothing piano melody")
        duration = data.get("duration", 10)
        guidance_scale = data.get("guidance_scale", 1.0)

        if not prompt:
            return jsonify({"error": "Prompt cannot be empty"}), 400

        # Process the input prompt and convert to model input
        inputs = processor(text=[prompt], padding=True, return_tensors="pt").to(device)

        # Generate the music output from the model
        with torch.no_grad():
            output = model.generate(
                **inputs,
                max_new_tokens=int(duration * 50),  # Adjust based on duration
                guidance_scale=guidance_scale
            )

        # Convert the tensor to a format that can be saved as a WAV file
        audio_data = output.cpu().numpy().flatten()  # Flatten the tensor to 1D array
        
        # Normalize the audio data to be in the range of -1.0 to 1.0
        audio_data = audio_data / np.max(np.abs(audio_data))  # Normalize to the range -1 to 1

        # Convert to 16-bit PCM audio
        audio_data = (audio_data * 32767).astype(np.int16)

        # Convert to WAV format using wave module
        byte_io = BytesIO()
        with wave.open(byte_io, 'wb') as wave_file:
            wave_file.setnchannels(1)  # Mono channel
            wave_file.setsampwidth(2)  # Sample width (16-bit)
            wave_file.setframerate(44100)  # Sample rate (44.1kHz)
            wave_file.writeframes(audio_data.tobytes())
        
        byte_io.seek(0)

        # Return the WAV file as binary response
        return Response(byte_io, mimetype="audio/wav")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
