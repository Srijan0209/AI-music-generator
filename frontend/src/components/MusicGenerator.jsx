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
    const response = await axios.post("https://srijan12380-ai-music-generator.hf.space/run/predict", {
      data: [prompt, 10, 1]
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const generatedAudioUrl = response.data.data[0];
    setAudioSrc(generatedAudioUrl);
  } catch (error) {
    console.error("Error generating music:", error);
    alert("Error generating music. Check console for details.");
  }

  setLoading(false);
};




  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Music Generator</h2>
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
