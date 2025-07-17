import React, { useState } from 'react';
import axios from 'axios';

const MusicGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setAudioUrl(null);

      const response = await axios.post(
        'https://ai-music-generator-1-j629.onrender.com/generate', // ✅ your Flask Render URL
        { prompt },
        {
          responseType: 'blob', // ⚠️ Crucial: tells Axios to treat response as binary
        }
      );

      const blob = new Blob([response.data], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error('Error generating music:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Music Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
      />
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Music'}
      </button>

      {audioUrl && (
        <audio controls autoPlay>
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default MusicGenerator;
