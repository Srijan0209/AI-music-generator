import React, { useState } from 'react';

const MusicGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setAudioUrl(null); // clear previous result
    try {
      const response = await fetch('https://ai-music-generator-1-j629.onrender.com/generate
, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error(error);
      alert('Something went wrong while generating audio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>AI Music Generator</h2>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt (e.g. relaxing piano)"
      />
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Music'}
      </button>

      {audioUrl && (
        <div>
          <h4>Output:</h4>
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
};

export default MusicGenerator;
