const handleGenerate = async () => {
  if (!prompt.trim()) {
    alert("Please enter a prompt ");
    return;
  }

  setLoading(true);
  setAudioSrc(null);

  try {
    const response = await axios.post(
      "https://ai-music-generator-1-j629.onrender.com/generate",
      {
        prompt: prompt,
        duration: 10,
        guidance_scale: 1.0,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob", // 👈 This is important
      }
    );

    const audioBlob = new Blob([response.data], { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioSrc(audioUrl);
  } catch (err) {
    console.error("Error generating music:", err);
    alert("Failed to generate music. See console for details.");
  }

  setLoading(false);
};
