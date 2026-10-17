# 🚆 Railway Traffic Intelligence System (SIH)

An AI-driven Railway Traffic and Route Optimization platform built with React, Vite, Tailwind CSS, Express, and Google Gemini AI.

---

## 🚀 Quick Start Guide for Team Members

Follow these steps to set up and run the project locally on your machine.

### 1. Prerequisites
- **Node.js**: v18.x or later installed ([Download Node.js](https://nodejs.org/))
- **Git**: Installed and configured on your computer

---

### 2. Clone the Repository
Open your terminal (PowerShell, Command Prompt, or Git Bash) and run:
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd RailwayTraficSIH
```

---

### 3. Install Dependencies
Install all required frontend and backend npm packages:
```bash
npm install
```

---

### 4. Configure Environment Variables (.env)
This project uses external APIs (Google Gemini, WeatherAPI / OpenWeather, and OpenRouteService). Sensitive credentials are kept out of GitHub.

1. In the project root, make a copy of `.env.example` and name it `.env`:
   - On Windows (PowerShell):
     ```powershell
     cp .env.example .env
     ```
   - On Mac / Linux:
     ```bash
     cp .env.example .env
     ```
2. Open `.env` in your code editor and fill in your API keys:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_WEATHER_API_KEY=your_weather_api_key_here
   VITE_ORS_API_KEY=your_openrouteservice_api_key_here
   ```
   > ⚠️ **Note**: Never commit your `.env` file to GitHub! It is already ignored by `.gitignore`.

---

### 5. Running the Application

You will need two terminal windows open:

#### Terminal 1: Backend Server (Express + Gemini API)
```bash
npm run server
```
- Server will run at: `http://localhost:5000`

#### Terminal 2: Frontend (Vite + React)
```bash
npm run dev
```
- Web application will run at: `http://localhost:5173`

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Leaflet / React-Leaflet, Recharts
- **Backend**: Node.js, Express, Google Generative AI (@google/generative-ai), dotenv, cors
- **APIs**:
  - Google Gemini API (Assistant chat & route intelligence)
  - WeatherAPI / OpenWeather (Live weather alerts for tracks)
  - OpenStreetMap / OpenRouteService (Routing and geocoding)

---

## 🤝 Team Contribution Workflow

To avoid conflicts and keep the repository clean:
1. **Pull the latest changes** before starting work:
   ```bash
   git pull origin main
   ```
2. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: describe your change"
   ```
4. **Push your branch to GitHub**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request (PR)** on GitHub to merge into `main`.
