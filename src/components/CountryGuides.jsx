import React, { useState, useMemo } from 'react';
import { countryGuides, destQuestions } from '../data/countryData.js';
import { universities } from '../data/universities.js';
import { Btn, Card } from './UI.jsx';

// ─── DESTINATION QUIZ ─────────────────────────
function DestQuiz({ onFinish }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const pick = (opt) => {
    const next = [...answers, { type: destQuestions[step].type, ...opt }];
    setAnswers(next);
    if (step < destQuestions.length - 1) setStep(step + 1);
    else onFinish(calcResults(next));
  };

  const calcResults = (ans) => {
    const scores = {};
    countryGuides.forEach(c => scores[c.id] = 0);
    ans.forEach(a => {
      if (a.countries && a.countries.length > 0) {
        a.countries.forEach(cid => { if (scores[cid] !== undefined) scores[cid] += 2; });
      } else {
        // "any" / no preference → small bonus to all
        Object.keys(scores).forEach(k => scores[k] += 0.5);
      }
    });
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, score]) => ({ ...countryGuides.find(c => c.id === id), score }));
  };

  const q = destQuestions[step];
  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', fontSize: 11, color: '#A8A29E', marginBottom: 6 }}>
        Въпрос {step + 1} / {destQuestions.length}
      </div>
      <div style={{ height: 4, background: '#E7E5E4', borderRadius: 2, marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg,#059669,#2563EB)', borderRadius: 2, width: `${(step + 1) / destQuestions.length * 100}%`, transition: 'width .4s' }} />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 32, marginBottom: 8, animation: 'float 3s ease-in-out infinite' }}>🗺️</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>{q.q}</div>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {q.opts.map((opt, i) => (
          <button key={i} onClick={() => pick(opt)} style={{
            padding: '16px 18px', background: 'white', border: '2px solid #E7E5E4', borderRadius: 12,
            fontSize: 14, fontWeight: 500, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all .18s ease', animation: `slideIn .3s ease-out ${i * 0.06}s both`
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.background = '#ECFDF5' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#E7E5E4'; e.currentTarget.style.background = 'white' }}>
            {opt.label}
          </button>
        ))}
      </div>
      {step > 0 && <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}
          style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, background: 'white', border: '1px solid #E7E5E4', color: '#78716C', cursor: 'pointer', fontFamily: 'inherit' }}>← Назад</button>
      </div>}
    </div>
  );
}

// ─── QUIZ RESULTS ─────────────────────────────
function QuizResults({ results, onViewGuide, onRetake }) {
  return (
    <div className="page-enter">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎯</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600, marginBottom: 4 }}>
          Твоите <span className="grad-text">топ дестинации</span>
        </h2>
        <p style={{ color: '#78716C', fontSize: 13 }}>Базирано на бюджет, език, климат, приоритети</p>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {results.map((r, i) => {
          const matchPct = Math.round((r.score / (destQuestions.length * 2)) * 100);
          return (
            <Card key={r.id} onClick={() => onViewGuide(r.id)}
              style={{ cursor: 'pointer', padding: '16px 18px', animation: `slideIn .4s ease-out ${i * 0.08}s both` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 32 }}>{r.flag}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</span>
                    {i === 0 && <span style={{ padding: '1px 8px', borderRadius: 8, fontSize: 9, background: '#ECFDF5', color: '#059669', fontWeight: 600 }}>🏆 Топ избор</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#78716C' }}>
                    💰 ~€{r.cost}/мес · 🎓 {r.tuition} · 🏫 {r.unis} уни · 🏆 {r.topUni}
                  </div>
                  <div style={{ height: 4, background: '#E7E5E4', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: i === 0 ? '#059669' : '#2563EB', borderRadius: 2, width: `${matchPct}%`, transition: 'width .8s cubic-bezier(0.4,0,0.2,1)' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display',serif", color: i === 0 ? '#059669' : '#2563EB' }}>{matchPct}%</div>
                  <div style={{ fontSize: 9, color: '#A8A29E' }}>съвпадение</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
        <Btn onClick={onRetake} sm>🔄 Повтори</Btn>
        <Btn accent onClick={() => onViewGuide(results[0].id)} sm>📖 Виж топ гайда →</Btn>
      </div>
    </div>
  );
}

// ─── SINGLE COUNTRY GUIDE ─────────────────────
function CountryDetail({ guide, onBack, onBrowse }) {
  const countryUnis = universities.filter(u => u.country === guide.name).sort((a, b) => a.rank - b.rank);

  const sections = [
    { icon: '🛂', title: 'Виза', text: guide.visa },
    { icon: '🏥', title: 'Здравно осигуряване', text: guide.insurance },
    { icon: '🏠', title: 'Жилище', text: guide.housing },
    { icon: '💼', title: 'Работа', text: guide.work },
    { icon: '🚌', title: 'Транспорт', text: guide.transport },
    { icon: '🎭', title: 'Култура и живот', text: guide.culture },
  ];

  return (
    <div className="page-enter">
      <Btn onClick={onBack} sm style={{ marginBottom: 14 }}>← Всички гайдове</Btn>

      {/* Header */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 44 }}>{guide.flag}</div>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600 }}>{guide.name}</h1>
          <div style={{ fontSize: 12, color: '#78716C' }}>
            🗣️ {guide.lang} · 💱 {guide.currency} · {guide.climate}
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 8, marginBottom: 18 }}>
        {[
          { v: `€${guide.cost}`, l: 'Месечен разход', cl: '#2563EB', bg: '#EFF6FF' },
          { v: guide.tuition, l: 'Годишна такса', cl: '#059669', bg: '#ECFDF5' },
          { v: guide.unis, l: 'Университета', cl: '#7C3AED', bg: '#F5F3FF' },
          { v: guide.topUni, l: 'Топ университет', cl: '#EA580C', bg: '#FFF7ED' },
        ].map((s, i) => (
          <Card key={i} style={{ textAlign: 'center', padding: 10, background: s.bg, border: 'none', animation: `scaleIn .3s ease-out ${i * 0.05}s both` }}>
            <div style={{ fontSize: s.l === 'Топ университет' ? 11 : 16, fontWeight: 700, fontFamily: "'Playfair Display',serif", color: s.cl }}>{s.v}</div>
            <div style={{ fontSize: 9, color: s.cl, fontWeight: 500 }}>{s.l}</div>
          </Card>
        ))}
      </div>

      {/* Pros / Cons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        <Card style={{ background: '#ECFDF5', border: 'none' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#059669', marginBottom: 6 }}>✅ Предимства</div>
          {guide.pros.map((p, i) => <div key={i} style={{ fontSize: 11, color: '#065F46', padding: '3px 0', lineHeight: 1.4 }}>• {p}</div>)}
        </Card>
        <Card style={{ background: '#FFF1F2', border: 'none' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#E11D48', marginBottom: 6 }}>⚠️ Предизвикателства</div>
          {guide.cons.map((c, i) => <div key={i} style={{ fontSize: 11, color: '#9F1239', padding: '3px 0', lineHeight: 1.4 }}>• {c}</div>)}
        </Card>
      </div>

      {/* Info sections */}
      <div style={{ display: 'grid', gap: 8, marginBottom: 18 }}>
        {sections.map((s, i) => (
          <Card key={i} style={{ padding: '12px 16px', animation: `slideIn .3s ease-out ${i * 0.04}s both` }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: '#78716C', lineHeight: 1.5 }}>{s.text}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Deadlines */}
      <Card style={{ background: '#FFF7ED', border: 'none', marginBottom: 18 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#EA580C', marginBottom: 4 }}>📅 Срокове за кандидатстване</div>
        <div style={{ fontSize: 12, color: '#9A3412', lineHeight: 1.5 }}>{guide.deadlines}</div>
      </Card>

      {/* Universities in this country */}
      {countryUnis.length > 0 && <>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 8 }}>🎓 Университети в {guide.name} ({countryUnis.length})</h3>
        {countryUnis.map((u, i) => (
          <Card key={u.id} onClick={() => onBrowse(u)} style={{ cursor: 'pointer', padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, animation: `slideIn .3s ease-out ${i * 0.04}s both` }}>
            <span style={{ fontSize: 18 }}>{u.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{u.nameEn}</div>
              <div style={{ fontSize: 10, color: '#78716C' }}>📍{u.city} · 🏆#{u.rank} · ⭐{u.rating} · 💰€{u.tuition[0]}–{u.tuition[1]}</div>
            </div>
          </Card>
        ))}
      </>}
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────
export default function CountryGuidesPage({ onBrowseUni }) {
  const [mode, setMode] = useState('list'); // list | quiz | quizResults | detail
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return countryGuides;
    const s = search.toLowerCase();
    return countryGuides.filter(g => g.name.toLowerCase().includes(s) || g.lang.toLowerCase().includes(s));
  }, [search]);

  const viewGuide = (id) => {
    setSelectedGuide(countryGuides.find(g => g.id === id));
    setMode('detail');
  };

  if (mode === 'quiz') return (
    <div style={{ padding: '32px 0' }} className="page-enter">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 10, background: '#ECFDF5', color: '#059669', fontSize: 10, fontWeight: 600, marginBottom: 6 }}>🗺️ Destination Quiz</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600 }}>Къде да учиш?</h2>
        <p style={{ color: '#78716C', fontSize: 12 }}>6 въпроса → твоите топ 5 дестинации</p>
      </div>
      <DestQuiz onFinish={(res) => { setQuizResults(res); setMode('quizResults'); }} />
    </div>
  );

  if (mode === 'quizResults') return (
    <div style={{ padding: '32px 0' }}>
      <QuizResults results={quizResults} onViewGuide={viewGuide} onRetake={() => setMode('quiz')} />
    </div>
  );

  if (mode === 'detail' && selectedGuide) return (
    <div style={{ padding: '32px 0' }}>
      <CountryDetail guide={selectedGuide} onBack={() => setMode('list')} onBrowse={onBrowseUni} />
    </div>
  );

  // ─── LIST MODE ──────────────────────────────
  return (
    <div style={{ padding: '32px 0' }} className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600 }}>🌍 Гайдове по държави</h2>
          <p style={{ color: '#78716C', fontSize: 13, marginBottom: 14 }}>Всичко за живот и учене в {countryGuides.length} държави</p>
        </div>
        <Btn accent onClick={() => setMode('quiz')} sm>🗺️ Къде да уча? Quiz</Btn>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Търси държава..."
          style={{ width: '100%', padding: '9px 10px 9px 32px', border: '1px solid #E7E5E4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'white', outline: 'none' }} />
      </div>

      {/* Country cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10 }}>
        {filtered.map((g, i) => (
          <Card key={g.id} onClick={() => viewGuide(g.id)}
            style={{ cursor: 'pointer', padding: '16px 18px', animation: `slideIn .3s ease-out ${i * 0.03}s both` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>{g.flag}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{g.name}</div>
                <div style={{ fontSize: 10, color: '#78716C' }}>🗣️ {g.lang} · {g.climate}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: 11, color: '#78716C', marginBottom: 8 }}>
              <span>💰 ~€{g.cost}/мес</span>
              <span>🎓 {g.tuition}</span>
              <span>🏫 {g.unis} университета</span>
              <span>🏆 {g.topUni}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {g.pros.slice(0, 2).map((p, j) => (
                <span key={j} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 9, background: '#ECFDF5', color: '#059669', fontWeight: 500 }}>✓ {p}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
