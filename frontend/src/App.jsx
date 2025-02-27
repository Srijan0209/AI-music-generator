import React from "react";
import Navbar from "./components/Navbar";
import MusicGenerator from "./components/MusicGenerator";

function App() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>AI Music Generator</h1>
        <p>Enter a prompt and generate AI-powered music!</p>
        <MusicGenerator />
      </div>
    </div>
  );
}

export default App;
