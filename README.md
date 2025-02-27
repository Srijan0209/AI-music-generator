# AI-music-generator
1️⃣ Clone the Repository
First, they need to clone your project from GitHub:

sh
Copy
Edit
git clone https://github.com/your-username/AI-Music-Generator.git
cd AI-Music-Generator
2️⃣ Install Backend (Flask + AI Model) Dependencies
They need to install the required Python libraries for the Flask backend and MusicGen model.

🔹 Create a Virtual Environment (Recommended)
sh
Copy
Edit
python -m venv venv
source venv/bin/activate   # For macOS/Linux
venv\Scripts\activate      # For Windows
🔹 Install Dependencies
sh
Copy
Edit
pip install -r requirements.txt
If requirements.txt is missing, they can install manually:

sh
Copy
Edit
pip install flask flask-cors torch transformers numpy
3️⃣ Download Pretrained Model (One-Time Setup)
Since the project uses Facebook's MusicGen model, they must download it by running:

sh
Copy
Edit
python -c "from transformers import MusicgenForConditionalGeneration; MusicgenForConditionalGeneration.from_pretrained('facebook/musicgen-small')"
This will automatically download and cache the model.

4️⃣ Install Frontend (React) Dependencies
In the frontend folder (where package.json exists), run:

sh
Copy
Edit
npm install
This installs all necessary Node.js packages.
