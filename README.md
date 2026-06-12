# FootprintIQ

**"Measure Smarter. Live Greener."**

FootprintIQ is a production-ready AI-powered Carbon Intelligence Platform designed to help individuals track, understand, and reduce their carbon footprint through personalized insights and sustainability forecasting.

## 🌍 Problem Statement
While many individuals want to reduce their environmental impact, they lack the tools to:
- Quantify their lifestyle emissions accurately.
- Understand the context of their consumption.
- Receive actionable, personalized guidance.
- Forecast the impact of potential lifestyle changes.

## 🚀 Key Features
- **Intelligent Assessment**: A multi-step lifestyle analysis engine.
- **Carbon Intelligence Hub**: A high-fidelity dashboard with interactive visualizations.
- **AI Sustainability Advisor**: Personalized, context-aware reduction strategies powered by Google Gemini.
- **Impact Forecast Studio**: A real-time habit simulation engine.
- **Conversational Assistant**: A chatbot for sustainability queries.
- **Personal Journey**: Badge and milestone tracking for behavioral reinforcement.

## 🛠 Tech Stack
- **Frontend**: Next.js 15+, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **AI Integration**: Google GenAI (Gemini) via Firebase Genkit
- **Animations**: CSS Transitions & Tailwind Animate

## 📐 Architecture
The project follows a modular architecture with a clear separation of concerns:
- `/src/app`: Page routes and layouts.
- `/src/components`: Reusable UI components.
- `/src/lib`: Core business logic (Carbon Calculator).
- `/src/ai`: Genkit flows for AI processing.
- `/src/types`: TypeScript interfaces for global data structures.

## 📦 Installation
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up environment variables in `.env`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Run development server: `npm run dev`.

## 🧪 Testing
Calculations are housed in `src/lib/carbon-calculator.ts` and can be tested using Jest or Vitest to ensure accuracy across Transport, Food, Energy, and Shopping categories.

---
Built with 💚 for the Planet.