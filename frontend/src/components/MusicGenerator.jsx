import React, { useState } from "react";
import axios from "axios";

const MusicGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    setLoading(true);
    setAudioSrc(null);

    try {
      // Step 1: Call Hugging Face Space to get file path
      const predictResponse = await axios.post(
        "https://Srijan12380-ai-music-generator.hf.space/run/predict",
        {
          data: [prompt, 10, 1.0]
        }
      );

      const filePath = predictResponse.data.data[0]; // e.g. "/file=..."

      // Step 2: Use the file path directly in the audio tag
      const fullUrl = `https://Srijan12380-ai-music-generator.hf.space${filePath}`;
      setAudioSrc(fullUrl);
    } catch (error) {
      console.error("Error generating music:", error);
      alert("Error generating music. Check console for details.");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎵 AI Music Generator</h2>
      <input
        type="text"
        placeholder="Enter music prompt..."
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

