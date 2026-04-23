# Aegis AI: Threat Detector

An AI-powered cybersecurity tool that analyzes system symptoms to detect potential threats and provides remediation steps.

## Features
- **AI Symptom Analysis**: Uses Gemini AI to analyze plain English descriptions of system behavior.
- **Threat Identification**: Detects malware, ransomware, spyware, adware, phishing, and more.
- **Severity Assessment**: Provides color-coded severity levels (Low to Critical).
- **Remediation Steps**: Actionable steps to secure your system.
- **Scan History**: Keeps track of previous analyses (stored locally).
- **Dark Cybersecurity Theme**: Professional, high-contrast UI with neon accents.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion.
- **AI**: Google Gemini API (@google/genai).
- **Icons**: Lucide React.

## Setup Instructions
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Gemini API Key in a `.env` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Disclaimer
This tool is for educational and preliminary analysis purposes. It is not a replacement for professional antivirus software or cybersecurity consulting.

