# 🌍 FootprintIQ: Carbon Intelligence Platform

**"Measure Smarter. Live Greener."**

FootprintIQ is a high-fidelity Carbon Intelligence Platform that transforms lifestyle data into actionable environmental intelligence using Google Gemini-powered insights and a robust carbon calculation engine.

---

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
- ✅ **Intelligence Hub**: Visual breakdown of your carbon profile.
- ✅ **EcoScore**: Real-time feedback on your sustainability rank.
- ✅ **30-Day Carbon Roadmap**: AI-generated, week-by-week behavioral pathways.
- ✅ **Monthly Goal Tracker**: Interactive progress monitoring for reduction targets.
- ✅ **Impact Forecast Studio**: Lifestyle change simulator with annual projections.
- ✅ **A11y Compliant**: Optimized for screen readers and keyboard navigation.

---

## 🏗 Architecture
- **Framework**: Next.js 15 (App Router)
- **AI**: Firebase Genkit & Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS & Shadcn UI
- **State**: React Hooks with persistent LocalStorage.
- **Testing**: Vitest for core calculation logic.

---

## 🛠 Setup & Installation
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/your-username/footprint-iq.git
   cd footprint-iq
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   - Create a `.env` file based on `.env.example`.
   - Add your `GEMINI_API_KEY`.
4. **Run Development**:
   ```bash
   npm run dev
   ```

## 🔐 Security
- **No Hardcoded Secrets**: All API keys are managed via environment variables.
- **Input Validation**: Strict schema enforcement using Zod.

## ♿ Accessibility
- Full ARIA landmark support.
- Keyboard-navigable interactive charts.
- Color contrast optimized for high readability.

## 🔮 Future Improvements
- **Global Leaderboards**: Social comparison for community-driven action.
- **Smart Meter Integration**: Automated electricity data importing.
- **Supply Chain Analytics**: Deep-dive product carbon footprinting for shopping.
