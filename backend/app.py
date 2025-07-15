from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from gradio_client import Client
import requests
import tempfile
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/", methods=["GET"])
def home():
    return "🎵 Welcome to the AI Music Generator API. Use POST /generate to generate music."

@app.route("/generate", methods=["POST"])
def generate_music():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")
        duration = data.get("duration", 10)
        guidance_scale = data.get("guidance_scale", 1.0)

        # Connect to Gradio Space
        client = Client("Srijan12380/AI-music-generator")

        # Call /predict endpoint
        result_path = client.predict(
            prompt=prompt,
            duration=duration,
            guidance_scale=guidance_scale,
            api_name="/predict"
        )

        # Download the generated audio
        audio_url = f"https://srijan12380-ai-music-generator.hf.space{result_path}"
        audio_response = requests.get(audio_url)

        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        temp_file.write(audio_response.content)
        temp_file.close()

        return send_file(temp_file.name, mimetype="audio/wav")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
