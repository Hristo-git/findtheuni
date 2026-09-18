# 📖 Read More — EdTech Platform

AI-powered platform helping Bulgarian students find the right European university.

## Features

- 🧠 **RIASEC Career Test** — 18-question Holland Code assessment with radar chart
- 🤖 **AI Chatbot** — Ask questions about universities, scholarships, programs in Bulgarian
- 🗺️ **Interactive Europe Map** — Visual university browser by location
- 🎯 **Scholarship Finder** — 15 scholarships with filters (Erasmus+, DAAD, Chevening...)
- 🎓 **108 Universities** from 25 European countries with detailed info (QS 2026 ranks, per-region tuition, teaching languages)
- 📊 **Side-by-side Comparison** — Compare up to 4 universities on 13 criteria
- ❤️ **Wishlist** — Save favorites and track your choices
- 💰 **Cost of Living** — Monthly expenses breakdown per city
- 🧾 **Personalised tuition** — the published range resolved to what a Bulgarian (EU) student actually pays,
  from citizenship, language of instruction and public/private (`src/lib/fees.js`)
- 🧮 **Italy aid estimator** — household income → estimated ISEE → tuition band + DSU scholarship (`src/lib/isee.js`)
- 📝 **How to apply** — portal, diploma recognition, language level and entrance exams per university,
  composed from country rules + field rules + own-procedure overrides (`src/data/admissions.js`)
- 👔 **Employability** — Graduate employment rates
- 📋 **Personal Dashboard** — RIASEC profile, recommendations, analytics

## Tech Stack

- React 18 + Vite
- React Router v6
- Custom SVG components (radar chart, map)
- Zero external UI libraries

## Getting Started

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
npx vercel
```

## Project Structure

```
src/
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
├── components/
│   ├── UI.jsx           # Shared components (Btn, Card, RadarChart, AnimBar)
│   ├── AIChatbot.jsx    # AI chatbot with knowledge base
│   ├── EuropeMap.jsx    # Interactive SVG map
│   └── ScholarshipFinder.jsx  # Scholarship browser
├── data/
│   ├── universities.js  # 108 universities with coords, programs, CoL
│   ├── testData.js      # RIASEC questions + scholarships
│   └── chatData.js      # AI chatbot patterns
└── styles/
    └── global.css       # Animations + base styles
```

## Competitors Analyzed

Studyportals, Study.eu, StudyinEurope.eu, CareerExplorer, UCAS, Educations.com, TopUniversities, ApplyBoard
