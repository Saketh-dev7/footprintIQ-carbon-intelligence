# 🌍 FootprintIQ: Carbon Intelligence Platform
# FootprintIQ

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4)
![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18)
![Status](https://img.shields.io/badge/Status-Active-success)
![Hackathon](https://img.shields.io/badge/Hack2Skill-PromptWars-orange)

AI-Powered Carbon Intelligence Platform
**"Measure Smarter. Live Greener."**

FootprintIQ is a high-fidelity Carbon Intelligence Platform that transforms lifestyle data into actionable environmental intelligence using Google Gemini-powered insights and a robust carbon calculation engine.
## Project Highlights

- AI-Powered Sustainability Advisor
- Carbon Footprint Analysis Engine
- Impact Forecast Studio
- Personalized Carbon Reduction Plans
- Progress Tracking & EcoScore
- Google Gemini Integration
- Accessibility Focused
- Tested with Vitest

---
# FootprintIQ

AI-Powered Carbon Intelligence Platform

## Features
- Carbon Footprint Assessment
- Sustainability Dashboard
- Impact Forecast Studio
- AI Sustainability Advisor
- Personalized Recommendations

## Tech Stack
- Next.js
- TypeScript
- Firebase Studio
- Google Gemini
- Genkit
- Tailwind CSS
- Vitest

## Live Demo
https://co2footprint.netlify.app

## AI Assistant

The Sustainability Assistant uses Google Gemini through Genkit.
When AI services are temporarily unavailable, FootprintIQ provides intelligent fallback sustainability recommendations to ensure uninterrupted user guidance.


## 📖 Project Overview
FootprintIQ addresses the complexity of personal carbon management by providing users with a precise EcoScore (0-100), a 30-day personalized roadmap, and real-time impact forecasting.

### 🚩 Problem Statement
Individuals want to reduce their footprint but are often paralyzed by:
1.  **Complexity**: Difficulty in quantifying impact (CO2e) across diverse categories.
2.  **Lack of Context**: Raw numbers lack benchmarks or scoring.
3.  **Inaction**: Users don't know the specific first steps to take.

### 🎯 Chosen Vertical
**Sustainability & Climate Action**: Empowering individuals to lead the transition to net zero.

---

## 🧪 Approach and Logic
The platform uses validated emission factors (kg CO2e) derived from global standards:
- **Transportation**: Distance-based metrics for Gas/EV/Hybrid + pro-rated flight impacts.
- **Diet**: Protein-source intensity scaling (Vegan to Meat-Heavy).
- **Energy**: kWh consumption adjusted for renewable energy offsets and HVAC intensity.
- **EcoScore**: A proprietary 0-100 benchmark comparing user impact against global sustainability targets.

---

## 🚀 Key Features
- ✅ **Intelligence Hub**: Visual breakdown of your carbon profile using high-fidelity Recharts.
- ✅ **EcoScore**: Real-time feedback on your sustainability rank (0-100).
- ✅ **30-Day Carbon Roadmap**: AI-generated, week-by-week behavioral pathways using Google Gemini.
- ✅ **Monthly Goal Tracker**: Interactive progress monitoring for specific reduction targets.
- ✅ **Impact Forecast Studio**: Lifestyle change simulator with annual projections.
- ✅ **Sustainability Assistant**: Conversational AI for personalized green advice.
- ✅ **A11y Compliant**: Optimized for screen readers and keyboard navigation (WCAG standards).

---

## 🏗 Architecture
- **Framework**: Next.js 15 (App Router)
- **AI**: Firebase Genkit & Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS & Shadcn UI
- **State**: React Hooks with persistent LocalStorage via `useFootprint`.
- **Testing**: Vitest for core calculation logic and edge cases.

---

## 🛠 Setup & Installation
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/SAKETH-007-dev/footprintIQ-carbon-intelligence.git
   cd footprint-iq
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   - Rename `.env.example` to `.env`.
   - Add your `GOOGLE_GENAI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey).
4. **Run Development**:
   ```bash
   npm run dev
   ```

---

## 🔐 Security
- **No Hardcoded Secrets**: All API keys are managed via environment variables.
- **Input Validation**: Strict schema enforcement using Zod on both client and server (Genkit).
- **Hardened Git**: Comprehensive `.gitignore` to prevent leakage of artifacts or secrets.

## ♿ Accessibility
- Full ARIA landmark support and semantic HTML.
- Keyboard-navigable interactive charts and multi-step forms.
- High color contrast and screen reader friendly live regions.
- "Skip to Content" links for efficient keyboard navigation.

## 🔮 Future Improvements
- **Global Leaderboards**: Social comparison for community-driven action.
- **Smart Meter Integration**: Automated electricity data importing.
- **Supply Chain Analytics**: Deep-dive product carbon footprinting for shopping.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
