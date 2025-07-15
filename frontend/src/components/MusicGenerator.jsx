import React, { useState } from "react";
import axios from "axios";

const MusicGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    setLoading(true);
    setAudioSrc(null);

    try {
      const response = await axios.post(
        "https://ai-music-generator-1-j629.onrender.com/predict",
        {
          data: [prompt, 10, 1.0], // prompt, duration, guidance_scale
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Gradio returns "file=/file/abc123.wav"
      const filePath = response.data.data[0]; // "file=/file/xyz.wav"
      const audioUrl = filePath.replace(
        "file=",
        "https://srijan12380-ai-music-generator.hf.space/file/"
      );

      setAudioSrc(audioUrl);
    } catch (err) {
      console.error("Error generating music:", err);
      alert("Failed to generate music. See console for details.");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎵 AI Music Generator</h2>
      <input
        type="text"
        placeholder="Enter a music prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "300px", padding: "10px", marginBottom: "10px" }}
      />
      <br />
      <button onClick={handleGenerate} disabled={loading} style={{ padding: "10px 20px" }}>
        {loading ? "Generating..." : "Generate Music"}
      </button>

      {audioSrc && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Music:</h3>
          <audio controls src={audioSrc}></audio>
        </div>
      )}
    </div>
  );
};

export default MusicGenerator;
