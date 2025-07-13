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
      const response = await axios.post("http://127.0.0.1:5000/generate", {
        prompt: prompt,
        duration: 10,
        guidance_scale: 1.0
      }, {
        responseType: 'arraybuffer',  // Important for binary data
      });

      // Create a Blob from the response and set it as audio source
      const audioBlob = new Blob([response.data], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(audioUrl);
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
