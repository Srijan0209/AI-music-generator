from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from gradio_client import Client
import requests
import os
import tempfile

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

@app.route("/generate", methods=["POST"])
def generate_music():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")
        duration = int(data.get("duration", 10))
        guidance_scale = float(data.get("guidance_scale", 1.0))

        print("==> Received prompt:", prompt)
        print("==> Duration:", duration)
        print("==> Guidance scale:", guidance_scale)

        # Initialize Hugging Face Gradio Client
        client = Client("Srijan12380/AI-music-generator")

        # Call the Gradio Space
        result_path = client.predict(
            prompt,
            duration,
            guidance_scale,
            api_name="/predict"
        )

        print("==> Received result path:", result_path)

        # Full URL to the audio file hosted by Hugging Face Space
        audio_url = f"https://srijan12380-ai-music-generator.hf.space{result_path}"
        print("==> Downloading audio from:", audio_url)

        # Download the audio file
        audio_response = requests.get(audio_url)
        if audio_response.status_code != 200:
            raise Exception(f"Failed to download audio. Status: {audio_response.status_code}")

        # Save audio to temp file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        temp_file.write(audio_response.content)
        temp_file.close()

        print("==> Audio saved locally. Sending to frontend.")
        return send_file(temp_file.name, mimetype="audio/wav")

    except Exception as e:
        print("==> Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
