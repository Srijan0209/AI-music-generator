from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from gradio_client import Client
import requests
import os
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/generate", methods=["POST"])
def generate_music():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")
        duration = data.get("duration", 10)
        guidance_scale = data.get("guidance_scale", 1.0)

        print("⏳ Generating music with prompt:", prompt)

        # Connect to Gradio space
        client = Client("Srijan12380/AI-music-generator")

        # Call the API
        result_path = client.predict(
            prompt=prompt,
            duration=duration,
            guidance_scale=guidance_scale,
            api_name="/predict"
        )

        print("✅ Received result path:", result_path)

        # If result_path is a valid URL or path (e.g. "/file=..."), download the file
        if result_path.startswith("/file="):
            file_url = f"https://srijan12380-ai-music-generator.hf.space{result_path}"
            print("📥 Downloading from:", file_url)

            audio_response = requests.get(file_url)
            audio_response.raise_for_status()

            # Save to temp file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
            temp_file.write(audio_response.content)
            temp_file.close()

            print("📤 Sending audio file...")
            return send_file(temp_file.name, mimetype="audio/wav")

        else:
            return jsonify({"error": "Invalid audio file path returned"}), 500

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
