# 📖 Read More — EdTech Platform

AI-powered platform helping Bulgarian students find the right European university.

## Features

- 🧠 **RIASEC Career Test** — 18-question Holland Code assessment with radar chart
- 🤖 **AI Chatbot** — Ask questions about universities, scholarships, programs in Bulgarian
- 🗺️ **Interactive Europe Map** — Visual university browser by location
- 🎯 **Scholarship Finder** — 15 scholarships with filters (Erasmus+, DAAD, Chevening...)
- 🎓 **70 Universities** from 20+ European countries with detailed info
- 📊 **Side-by-side Comparison** — Compare up to 4 universities on 13 criteria
- ❤️ **Wishlist** — Save favorites and track your choices
- 💰 **Cost of Living** — Monthly expenses breakdown per city
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
│   ├── universities.js  # 70 universities with coords, programs, CoL
│   ├── testData.js      # RIASEC questions + scholarships
│   └── chatData.js      # AI chatbot patterns
└── styles/
    └── global.css       # Animations + base styles
```

## Competitors Analyzed

Studyportals, Study.eu, StudyinEurope.eu, CareerExplorer, UCAS, Educations.com, TopUniversities, ApplyBoard
