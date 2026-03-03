🔐 Password Security Assessment & Resilience Analyzer

A sleek, dark-themed web application for analyzing, scoring, and generating secure passwords — built using Flask + Vanilla JavaScript.

🚀 Live Features

🔴 Real-Time Strength Meter (Animated Gradient)

✅ 7-Point Security Checklist

📐 Entropy Calculation (Backend)

⏱️ Brute-Force Crack Time Estimation (zxcvbn)

💡 Smart Feedback Suggestions

⚡ Cryptographically Secure Password Generator

🎨 Modern Dark Glass UI with Cursor Glow

📖 Built-in Password Security Learning Section

🛠️ Technology Stack

Backend: Python Flask

Frontend: HTML, CSS, Vanilla JavaScript

Security Library: zxcvbn

Random Generator: Python secrets module

📂 Project Structure
password-app/
│
├── app.py
│
├── templates/
│   └── index.html
│
└── static/
    └── style.css
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/yourusername/password-app.git
cd password-app
2️⃣ Create Virtual Environment
python -m venv venv
source venv/Scripts/activate   # Windows (Git Bash)
# source venv/bin/activate     # macOS / Linux
3️⃣ Install Dependencies
pip install flask zxcvbn
4️⃣ Run the Application
python app.py

Open your browser and go to:

http://127.0.0.1:5000
🔌 API Endpoints
GET /

Loads the main webpage.

POST /analyze

Request:

{
  "password": "Example@123"
}

Response:

{
  "entropy": 52.4,
  "crack_time": "3 hours",
  "score": 2,
  "feedback": ["Add another word or two."],
  "warning": ""
}
POST /generate

Request:

{
  "length": 16,
  "uppercase": true,
  "lowercase": true,
  "numbers": true,
  "special": true
}

Response:

{
  "password": "Xk#9mP!vLq2@Yw7n"
}
🧠 How It Works
🔹 Strength Scoring (Frontend)

JavaScript evaluates:

Length ≥ 8

Length ≥ 12

Length ≥ 16

Uppercase

Lowercase

Numbers

Special characters

🔹 Entropy Calculation (Backend)

Formula:

Entropy = Length × log₂(Charset Size)

Target:
60+ bits = Strong Security

🔹 Crack Time Estimation

Uses zxcvbn offline slow hashing model
Simulates 10,000 guesses per second (bcrypt scenario)

🔒 Security Considerations

Passwords are never stored

No database required

No logging of sensitive data

Uses secrets.SystemRandom() for cryptographic randomness

Suitable for local security testing & education

🚀 Future Improvements

Add rate limiting

Deploy with HTTPS

Integrate breach database API

Add authentication dashboard

Deploy to AWS / Render / Railway

👨‍💻 Author

Harsh Pal
Cybersecurity & Full-Stack Enthusiast

⭐ If You Like This Project

Give it a ⭐ on GitHub!
