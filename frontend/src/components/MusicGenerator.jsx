import React, { useState } from "react";
import axios from "axios";
import { FaMusic } from "react-icons/fa";

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
        "https://ai-music-generator-1-j629.onrender.com/generate",
        {
          prompt,
          duration: 10,
          guidance_scale: 1.0,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      const audioBlob = new Blob([response.data], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(audioUrl);
    } catch (err) {
      console.error("Error generating music:", err);
      alert("Failed to generate music. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Music Generator</h1>
      <p className="typing-text">Enter a prompt and generate AI-powered music!</p>

      <h2>
        <FaMusic style={{ marginBottom: "-5px", marginRight: "8px" }} />
        Music Generator
      </h2>

      <input
        type="text"
        placeholder="Type your music prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          marginTop: "15px",
        }}
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Music"}
      </button>

      {audioSrc && (
        <div style={{ marginTop: "30px" }}>
          <h3>Generated Music:</h3>
          <audio controls src={audioSrc} style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default MusicGenerator;
