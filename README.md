# 🌍 FootprintIQ: Carbon Intelligence Platform

**"Measure Smarter. Live Greener."**

FootprintIQ is an AI-powered Carbon Intelligence Platform designed to help individuals quantify, understand, and reduce their environmental impact through high-fidelity analytics and personalized behavioral pathways.

---

## 📖 Project Overview
FootprintIQ transforms complex environmental data into actionable intelligence. By combining a robust carbon calculation engine with Google Gemini-powered insights, the platform provides a comprehensive roadmap for personal sustainability.

### 🚩 Problem Statement
Most individuals want to live more sustainably but face three core barriers:
1.  **Complexity**: Quantifying lifestyle impact (CO2e) is difficult without specialized knowledge.
2.  **Lack of Context**: Raw numbers lack meaning without benchmarks or scoring.
3.  **Inaction**: Users often don't know the specific first steps to take.

### 🎯 Chosen Vertical
**Sustainability & Climate Action**: Targeting personal carbon management.

---

## 🧪 Approach and Logic

### Carbon Calculation Engine
Logic resides in `src/lib/carbon-calculator.ts`.
- **Transportation**: Daily commute (Gas/EV) + pro-rated annual flights.
- **Diet**: Food-related emissions based on protein sources.
- **Energy**: Home electricity, renewable offsets, and HVAC intensity.
- **EcoScore (0-100)**: Proprietary metric benchmarking footprint against global sustainability targets.

---

## 🚀 Key Features
- ✅ **EcoScore**: Immediate feedback on your sustainability rank.
- ✅ **30-Day Carbon Roadmap**: Week-by-week AI-generated action plan.
- ✅ **Monthly Goal Tracker**: Visualizes progress toward reduction targets.
- ✅ **Impact Forecast Studio**: Real-time lifestyle change simulator.
- ✅ **A11y Compliant**: Optimized for screen readers and keyboard navigation.

---

## 🏗 Architecture
- **Framework**: Next.js 15 (App Router)
- **AI**: Firebase Genkit & Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS & Shadcn UI
- **Testing**: Vitest (100% core coverage)

---

## 🛠 Setup
1. `npm install`
2. Add `GEMINI_API_KEY` to `.env`.
3. `npm run dev`
