# AI-music-generator


 Install Backend (Flask + AI Model) Dependencies
They need to install the required Python libraries for the Flask backend and MusicGen model.
 Create a Virtual Environment (Recommended)


python -m venv venv




venv\Scripts\activate      # For Windows

Install Dependencies



pip install flask flask-cors torch transformers numpy

Download Pretrained Model (One-Time Setup)

Since the project uses Facebook's MusicGen model, download it by running:


python -c "from transformers import MusicgenForConditionalGeneration; MusicgenForConditionalGeneration.from_pretrained('facebook/musicgen-small')"


This will automatically download and cache the model.

 Install Frontend (React) Dependencies
 
In the frontend folder (where package.json exists), run:


npm install
This installs all necessary Node.js packages.
