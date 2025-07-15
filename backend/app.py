from flask import Flask, request, jsonify, send_file
from gradio_client import Client
import requests
import os
import tempfile

app = Flask(__name__)

@app.route("/generate", methods=["POST"])
def generate_music():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")
        duration = data.get("duration", 10)
        guidance_scale = data.get("guidance_scale", 1.0)

        # Connect to your Gradio Space
        client = Client("Srijan12380/AI-music-generator")

        # Run prediction on Hugging Face Space
        result_path = client.predict(
            prompt=prompt,
            duration=duration,
            guidance_scale=guidance_scale,
            api_name="/predict"
        )

        # Download audio from Hugging Face Space
        audio_url = f"https://srijan12380-ai-music-generator.hf.space{result_path}"
        audio_response = requests.get(audio_url)

        # Save it to a temp file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        temp_file.write(audio_response.content)
        temp_file.close()

        # Send file to frontend
        return send_file(temp_file.name, mimetype="audio/wav")

    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

