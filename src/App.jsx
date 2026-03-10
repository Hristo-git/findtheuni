import React, { useState, useMemo, useEffect } from 'react';
import { universities, allFields, allCountries, fieldEmoji } from './data/universities';
import { questions, RIASEC_MAP, dimEmoji, getArchetype, careerOutcomes, scholarships } from './data/testData';
import { Btn, Card, RadarChart, AnimBar, MatchRing } from './components/UI';
import AIChatbot from './components/AIChatbot';
import EuropeMap from './components/EuropeMap';
import ScholarshipFinder from './components/ScholarshipFinder';
import CountryGuidesPage from './components/CountryGuides';
import ApplicationTracker from './components/ApplicationTracker';
import StudentReviews from './components/StudentReviews';
import PeerChat from './components/PeerChat';
import OnboardingWizard from './components/OnboardingWizard';
import ProgramExplorer from './components/ProgramExplorer';
import B2BPage from './components/B2BPage';
import CostCalculator from './components/CostCalculator';
import DecisionHelper from './components/DecisionHelper';
import JourneyBar from './components/JourneyBar';
import { useUser } from './UserContext';
import { calcMatch, getRecommendedUnis } from './utils/matching';

const cls = ["#CCFF00", "#5D5FEF", "#22C55E", "#F59E0B", "#EF4444", "#14B8A6"];

function getNextActions(profile) {
  const actions = [];
  if (!profile.onboarded) return [{ text: 'Настрой профила си', desc: 'Отнема 60 секунди', icon: '👤', route: 'home', primary: true }];
  if (!profile.riasecDone) actions.push({ text: 'Открий кариерния си път', desc: 'RIASEC тест — 18 въпроса', icon: '🧬', route: 'test', primary: true });
  if (!profile.quizResults) actions.push({ text: 'Намери идеалната държава', desc: 'Quiz за най-подходящи дестинации', icon: '🌍', route: 'guides', primary: !actions.length });
  if (profile.favorites.length < 3) actions.push({ text: `Добави университети (${profile.favorites.length}/3)`, desc: 'Разгледай и запази любими', icon: '🎓', route: 'browse', primary: !actions.length });
  if (profile.favorites.length >= 3 && !profile.applications.length) actions.push({ text: 'Започни кандидатстване', desc: `${profile.favorites.length} любими университета чакат`, icon: '📝', route: 'tracker', primary: true });
  if (profile.applications.length > 0) {
    const pending = profile.applications.filter(a => a.status === 'idea' || a.status === 'research' || a.status === 'docs');
    if (pending.length > 0) actions.push({ text: `${pending.length} кандидатури в процес`, desc: 'Провери прогреса и дедлайни', icon: '📋', route: 'tracker', primary: true });
  }
  const docsReady = Object.values(profile.docs).filter(Boolean).length;
  if (docsReady < 5 && profile.favorites.length > 0) actions.push({ text: `Подготви документи (${docsReady}/10)`, desc: 'Диплома, CV, мотивационно...', icon: '✅', route: 'tracker' });
  return actions.slice(0, 3);
}

export default function App() {
  const user = useUser();
  const { profile } = user;
  const [pg, sP] = useState("home");
  const [sr, sR] = useState("");
  const [ft, sF] = useState({ c: "", f: "", s: "ranking", type: "", free: false });
  const [sf, sSf] = useState(false);
  const [sl, sL] = useState(null);
  const [st, sSt] = useState(0);
  const [ans, sA] = useState({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [dn, sD] = useState(false);
  const [cp, sCp] = useState(1);
  const [tab, sTab] = useState("info");
  const [chat, setChat] = useState(false);
  const [mapMode, setMap] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const cm = profile.compared;
  const fav = profile.favorites;
  const tc = id => user.toggleCompare(id);
  const tf = id => user.toggleFav(id);

  useEffect(() => { if (!profile.onboarded) setShowOnboarding(true); }, []);
  useEffect(() => { if (profile.riasecDone && profile.riasecScores) { sA(profile.riasecScores); sD(true); } }, []);

  const ls = useMemo(() => {
    let l = [...universities];
    if (sr) { const s = sr.toLowerCase(); l = l.filter(u => u.name.toLowerCase().includes(s) || u.nameEn.toLowerCase().includes(s) || u.city.toLowerCase().includes(s) || u.country.toLowerCase().includes(s) || u.programs.some(p => p.toLowerCase().includes(s))); }
    if (ft.c) l = l.filter(u => u.country === ft.c);
    if (ft.f) l = l.filter(u => u.fields.includes(ft.f));
    if (ft.type) l = l.filter(u => u.type === ft.type);
    if (ft.free) l = l.filter(u => u.tuition[0] === 0);
    if (ft.s === "match" && profile.onboarded) l.sort((a, b) => (calcMatch(b, profile) || 0) - (calcMatch(a, profile) || 0));
    else if (ft.s === "ranking") l.sort((a, b) => a.rank - b.rank);
    else if (ft.s === "rating") l.sort((a, b) => b.rating - a.rating);
    else if (ft.s === "tuition") l.sort((a, b) => a.tuition[0] - b.tuition[0]);
    else if (ft.s === "emp") l.sort((a, b) => b.employability - a.employability);
    else if (ft.s === "col") l.sort((a, b) => a.costOfLiving - b.costOfLiving);
    return l;
  }, [sr, ft]);

  const tp = Math.ceil(ls.length / 10);
  const sh = ls.slice((cp - 1) * 10, cp * 10);

  const getR = () => {
    const sorted = Object.entries(ans).sort((a, b) => b[1] - a[1]);
    const top3 = sorted.slice(0, 3).map(([k]) => k);
    const allFl = [...new Set(top3.flatMap(k => RIASEC_MAP[k].fields))];
    return { dims: sorted, top3, fields: allFl, code: top3.join("") };
  };

  const gU = () => {
    const { fields } = getR();
    return universities.map(u => ({ ...u, ms: u.fields.filter(f => fields.includes(f)).length })).filter(u => u.ms > 0).sort((a, b) => b.ms - a.ms || a.rank - b.rank).slice(0, 10);
  };

  const answer = (val) => {
    const dim = questions[st].dim;
    const newAns = { ...ans, [dim]: ans[dim] + val };
    sA(newAns);
    if (st < questions.length - 1) sSt(st + 1);
    else {
      sD(true);
      const sorted = Object.entries(newAns).sort((a, b) => b[1] - a[1]);
      const top3 = sorted.slice(0, 3).map(([k]) => k);
      const code = top3.join("");
      const arch = getArchetype(top3.slice(0, 2));
      user.saveRiasec(newAns, code, arch.name);
    }
  };

  const nv = p => { sP(p); sL(null); sTab("info"); };

  const UniRow = ({ u }) => {
    const matchedProgs = sr ? u.programs.filter(p => p.toLowerCase().includes(sr.toLowerCase())) : [];
    const matchScore = calcMatch(u, profile);
    return (
    <Card style={{ padding: "16px 18px", marginBottom: 10, cursor: "pointer", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center" }}
      onClick={() => { sL(u); if (pg !== "browse") nv("browse"); sTab("info"); }}>
      <div style={{ position: "relative" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{u.emoji}</div>
        {matchScore !== null && <div style={{ position: "absolute", bottom: -3, right: -3, width: 22, height: 22, borderRadius: "50%", background: matchScore >= 75 ? "#22C55E" : matchScore >= 50 ? "#F59E0B" : "#71717A", color: "#0A0A0B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, border: "2px solid #0A0A0B" }}>{matchScore}</div>}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#fff" }}>{u.name}</div>
        <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#71717A", flexWrap: "wrap", marginTop: 2 }}>
          <span>📍{u.city}, {u.country}</span><span>🏆#{u.rank}</span>
          <span style={{ color: u.tuition[0] === 0 ? "#22C55E" : "#A1A1AA" }}>{u.tuition[0] === 0 && u.tuition[1] === 0 ? "🎉 Безпл." : `💶 €${u.tuition[0]}–${u.tuition[1]}`}</span>
        </div>
        {matchedProgs.length > 0 && <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
          {matchedProgs.slice(0, 3).map((p, i) => <span key={i} style={{ padding: "2px 8px", borderRadius: 100, fontSize: 10, background: "rgba(34,197,94,0.12)", color: "#22C55E" }}>🎓 {p}</span>)}
          {matchedProgs.length > 3 && <span style={{ fontSize: 10, color: "#71717A" }}>+{matchedProgs.length - 3}</span>}
        </div>}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#F59E0B" }}>⭐{u.rating}</span>
        <div onClick={e => { e.stopPropagation(); tf(u.id) }} style={{ fontSize: 18, cursor: "pointer" }}>{fav.includes(u.id) ? "❤️" : "🤍"}</div>
        <div onClick={e => { e.stopPropagation(); tc(u.id) }} style={{ width: 22, height: 22, border: cm.includes(u.id) ? "none" : "2px solid rgba(255,255,255,0.15)", borderRadius: 7, background: cm.includes(u.id) ? "#5D5FEF" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{cm.includes(u.id) ? "✓" : ""}</div>
      </div>
    </Card>
  ); };

  if (showOnboarding && !profile.onboarded) {
    return <OnboardingWizard onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0B" }}>
      {/* GLASSMORPHISM NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,11,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div onClick={() => nv("home")} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: 10, background: "#CCFF00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎓</span>
            <span className="grad-text">FindTheUni</span>
          </div>
          <div style={{ display: "flex", gap: 2, overflowX: "auto", padding: "4px 0" }}>
            {[["home", "🏠"], ["test", "🧠"], ["browse", "🎓"], ["programs", "📚"], ["guides", "🌍"], ["scholarships", "🎯"], ["cost", "💰"], ["tracker", "📝"], ["decision", "🤔"], ["reviews", "🌟"], ["peers", "💬"], ["compare", "📊"], ["dash", "📋"]].map(([k, icon]) =>
              <button key={k} onClick={() => nv(k)} style={{ padding: "6px 12px", borderRadius: 100, fontSize: 12, fontWeight: pg === k ? 600 : 500, color: pg === k ? "#CCFF00" : "#71717A", background: pg === k ? "rgba(204,255,0,0.1)" : "transparent", border: "none", flexShrink: 0 }}>{icon}</button>
            )}
          </div>
        </div>
        <JourneyBar onNavigate={nv} />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(12px, 3vw, 20px)", paddingBottom: 80 }}>

        {/* HOME */}
        {pg === "home" && <div className="page-enter">
          <div style={{ textAlign: "center", padding: "72px 0 48px" }}>
            <div style={{ display: "inline-flex", padding: "5px 16px", background: "rgba(204,255,0,0.1)", color: "#CCFF00", borderRadius: 100, fontSize: 12, fontWeight: 600, marginBottom: 20, border: "1px solid rgba(204,255,0,0.2)" }}>✨ Новият начин да избереш бъдещето си</div>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(32px,6vw,56px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.02em" }}>
              Find your future,<br/><span className="grad-text">not just a degree</span>
            </h1>
            <p style={{ fontSize: 16, color: "#A1A1AA", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.6 }}>
              {profile.onboarded && profile.riasecDone
                ? `${profile.archetype ? `🏆 ${profile.archetype}` : ''} · ${profile.fields.slice(0,2).join(', ') || 'Всички области'} · €${profile.budget}/мес`
                : '70 университета · 20+ държави · AI matching · Всичко на български'}
            </p>
            <div style={{ maxWidth: 560, margin: "0 auto 32px", position: "relative" }}>
              <input value={sr} onChange={e => { sR(e.target.value); sCp(1); if (e.target.value) nv("browse"); }}
                placeholder="Искам да уча Дизайн в Нидерландия..."
                style={{ width: "100%", padding: "16px 24px", paddingRight: 56, background: "#161618", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, fontSize: 15, fontFamily: "inherit", color: "#fff", outline: "none", transition: "all 0.3s" }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(204,255,0,0.4)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(204,255,0,0.08)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = ''; }} />
              <span style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
            </div>
            {/* Next-best-action CTAs */}
            {(() => { const actions = getNextActions(profile); return (
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {actions.slice(0, 1).map((a, i) => <Btn key={i} primary onClick={() => nv(a.route)}>{a.icon} {a.text}</Btn>)}
                <Btn ghost onClick={() => nv("browse")}>🎓 Университети</Btn>
                <Btn accent onClick={() => setChat(true)}>🤖 AI Съветник</Btn>
              </div>
            ); })()}
            <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 48, flexWrap: "wrap" }}>
              {[[String(universities.length), "Университета"], [String(allCountries.length), "Държави"], [String(scholarships.length), "Стипендии"], ["AI", "Matching"]].map(([n, l]) =>
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 700, color: "#CCFF00" }}>{n}</div>
                  <div style={{ fontSize: 12, color: "#71717A", marginTop: 2 }}>{l}</div>
                </div>)}
            </div>
          </div>

          {/* Next Steps Cards — only when onboarded */}
          {profile.onboarded && (() => { const actions = getNextActions(profile); return actions.length > 0 && (
            <Card glow style={{ marginBottom: 20, padding: '20px 24px', background: 'rgba(204,255,0,0.04)', border: '1px solid rgba(204,255,0,0.15)' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🎯</span> Следващи стъпки
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10 }}>
                {actions.map((a, i) => (
                  <button key={i} onClick={() => nv(a.route)} style={{
                    padding: '14px 16px', background: a.primary ? 'rgba(204,255,0,0.08)' : '#161618',
                    border: a.primary ? '1px solid rgba(204,255,0,0.25)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all .15s ease',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#CCFF00'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = a.primary ? 'rgba(204,255,0,0.25)' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{a.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: '#71717A' }}>{a.desc}</div>
                  </button>
                ))}
              </div>
            </Card>
          ); })()}

          {/* Bento Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 40 }}>
            {[
              { i: "🤖", t: "AI Съветник", d: "Питай Claude за университети, стипендии, програми.", click: () => setChat(true), accent: true },
              { i: "🧬", t: "RIASEC Тест", d: "18 въпроса → Holland Code + Архетип.", click: () => nv("test") },
              { i: "🗺️", t: "Карта на Европа", d: "Интерактивна карта с всички университети.", click: () => nv("browse") },
              { i: "🌍", t: "Гайдове", d: "15 държави — виза, жилище, работа.", click: () => nv("guides") },
              { i: "🎯", t: "Стипендии", d: "Erasmus+, DAAD, Chevening и други.", click: () => nv("scholarships") },
              { i: "💰", t: "Калкулатор", d: "Разходи, стипендии, бюджет.", click: () => nv("cost") },
              { i: "📝", t: "Tracker", d: "Следи кандидатури и дедлайни.", click: () => nv("tracker") },
              { i: "🌟", t: "Отзиви", d: "Мнения от студенти в чужбина.", click: () => nv("reviews") },
              { i: "💬", t: "Peer Чат", d: "Питай студенти-амбасадори.", click: () => nv("peers") },
              { i: "📊", t: "Сравнение", d: "Side-by-side до 4 университета.", click: () => nv("compare") },
              { i: "📋", t: "Табло", d: "Radar chart, кариери, любими.", click: () => nv("dash") },
            ].map((f, i) => <Card key={i} glow={f.accent} style={{ cursor: "pointer", padding: 20, animation: `scaleIn .4s ease-out ${i * 0.04}s both`, background: f.accent ? "rgba(204,255,0,0.06)" : "#161618", border: f.accent ? "1px solid rgba(204,255,0,0.2)" : undefined }} onClick={f.click}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.i}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "#fff" }}>{f.t}</div>
              <div style={{ fontSize: 12, color: "#71717A", lineHeight: 1.5 }}>{f.d}</div>
            </Card>)}
          </div>
        </div>}

        {/* TEST */}
        {pg === "test" && <div style={{ padding: "40px 0" }} className="page-enter">
          {!dn ? <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <div style={{ textAlign: "center", fontSize: 12, color: "#71717A", marginBottom: 8 }}>Въпрос {st + 1} / {questions.length}</div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 28, overflow: "hidden" }}><div style={{ height: "100%", background: "linear-gradient(90deg,#CCFF00,#5D5FEF)", borderRadius: 2, width: `${(st + 1) / questions.length * 100}%`, transition: "width .4s", boxShadow: "0 0 10px rgba(204,255,0,0.3)" }} /></div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 10, animation: "float 3s ease-in-out infinite" }}>{questions[st].e}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#CCFF00", marginBottom: 6 }}>RIASEC · {RIASEC_MAP[questions[st].dim].name}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 28, lineHeight: 1.3 }}>{questions[st].q}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                {[[1, "😐 Не особено"], [2, "🤔 Донякъде"], [3, "😊 Да!"], [4, "🤩 Много!"]].map(([v, l]) =>
                  <button key={v} onClick={() => answer(v)} style={{ padding: "14px 20px", background: "#161618", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, fontSize: 14, fontWeight: 500, minWidth: 110, color: "#fff", fontFamily: "inherit" }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = "#CCFF00"; e.currentTarget.style.background = "rgba(204,255,0,0.06)"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "#161618"; }}>{l}</button>
                )}
              </div>
            </div>
            {st > 0 && <div style={{ textAlign: "center", marginTop: 14 }}><button onClick={() => sSt(st - 1)} style={{ padding: "7px 14px", borderRadius: 100, fontSize: 12, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#71717A", fontFamily: "inherit" }}>← Назад</button></div>}
          </div>
          : <div className="page-enter">
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 56, marginBottom: 10 }}>🎉</div>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Holland Code: <span className="grad-text" style={{ fontSize: 34, letterSpacing: 3 }}>{getR().code}</span></h2>
              <p style={{ color: "#71717A", fontSize: 14 }}>Базирано на RIASEC теория</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14, marginBottom: 24 }}>
              <Card><div style={{ fontSize: 13, fontWeight: 600, color: "#71717A", marginBottom: 10 }}>🧬 RIASEC Радар</div><RadarChart data={getR().dims.map(([k, v]) => ({ label: k, value: v }))} /></Card>
              <Card><div style={{ fontSize: 13, fontWeight: 600, color: "#71717A", marginBottom: 14 }}>📊 Резултати</div>
                {getR().dims.map(([k, v], i) => <AnimBar key={k} value={v} max={Math.max(...getR().dims.map(d => d[1]))} color={cls[i]} label={`${dimEmoji[k]} ${RIASEC_MAP[k].name}`} />)}
                <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(93,95,239,0.1)", borderRadius: 14, fontSize: 12, color: "#818CF8", lineHeight: 1.5, border: "1px solid rgba(93,95,239,0.15)" }}>
                  <strong>Топ тип:</strong> {RIASEC_MAP[getR().top3[0]].desc}
                </div>
              </Card>
            </div>
            {(() => { const arch = getArchetype(getR().top3.slice(0, 2)); return (
              <Card style={{ marginBottom: 24, background: "rgba(204,255,0,0.04)", border: "1px solid rgba(204,255,0,0.15)", textAlign: "center", padding: "28px" }}>
                <div style={{ fontSize: 50, marginBottom: 8 }}>{arch.emoji}</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Ти си <span className="grad-text">{arch.name}</span></div>
                <p style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.6, maxWidth: 440, margin: "0 auto 12px" }}>{arch.desc}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ padding: "5px 14px", borderRadius: 100, fontSize: 11, background: "rgba(34,197,94,0.12)", color: "#22C55E" }}>💼 {arch.careers}</span>
                  <span style={{ padding: "5px 14px", borderRadius: 100, fontSize: 11, background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>⭐ {arch.famous}</span>
                </div>
              </Card>
            ); })()}
            {(() => { const topCountries = [...new Set(gU().map(u => u.country))].slice(0, 4); return topCountries.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>👔 Кариерни перспективи</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
                  {topCountries.map((c, i) => { const co = careerOutcomes[c]; if (!co) return null; return (
                    <Card key={c} style={{ padding: 14, textAlign: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{c}</div>
                      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: "#22C55E" }}>€{(co.salary1y / 1000).toFixed(0)}K</div>
                      <div style={{ fontSize: 10, color: "#71717A", marginBottom: 6 }}>1-ва год</div>
                      <div style={{ fontSize: 11, color: "#A1A1AA" }}>→ €{(co.salary3y / 1000).toFixed(0)}K (3г) → €{(co.salary5y / 1000).toFixed(0)}K (5г)</div>
                    </Card>
                  ); })}
                </div>
              </div>
            ); })()}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>🎯 Препоръчани области</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {getR().fields.map((f, i) => <button key={i} onClick={() => { sF({ ...ft, f }); nv("browse"); }} style={{ padding: "6px 16px", borderRadius: 100, fontSize: 13, fontWeight: 500, background: "rgba(204,255,0,0.1)", color: "#CCFF00", border: "1px solid rgba(204,255,0,0.2)", cursor: "pointer", fontFamily: "inherit" }}>{fieldEmoji[f] || "📌"} {f} →</button>)}
              </div>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, marginBottom: 12 }}>🎓 Топ за теб</h3>
            {gU().map(u => <UniRow key={u.id} u={u} />)}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
              <Btn ghost onClick={() => { sSt(0); sA({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }); sD(false) }} sm>🔄 Повтори</Btn>
              <Btn accent onClick={() => nv("dash")} sm>📋 Табло</Btn>
              <Btn primary onClick={() => nv("browse")} sm>Всички →</Btn>
            </div>
          </div>}
        </div>}

        {/* BROWSE */}
        {pg === "browse" && <div style={{ padding: "32px 0" }} className="page-enter">
          {sl ? <div>
            <Btn ghost onClick={() => sL(null)} sm style={{ marginBottom: 18 }}>← Назад</Btn>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 18 }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{sl.emoji}</div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, marginBottom: 4 }}>{sl.name}</h1>
                <div style={{ color: "#71717A", fontSize: 13 }}>📍 {sl.city}, {sl.country} · {sl.type === "public" ? "🏛️ Държавен" : "🏢 Частен"} · 📅 {sl.founded}</div>
              </div>
              <div onClick={() => tf(sl.id)} style={{ fontSize: 24, cursor: "pointer" }}>{fav.includes(sl.id) ? "❤️" : "🤍"}</div>
            </div>
            {(() => { const ms = calcMatch(sl, profile); return ms !== null && (
              <Card style={{ marginBottom: 16, background: ms >= 75 ? 'rgba(34,197,94,0.08)' : ms >= 50 ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${ms >= 75 ? 'rgba(34,197,94,0.2)' : ms >= 50 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                <MatchRing score={ms} size={48} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: ms >= 75 ? '#22C55E' : ms >= 50 ? '#F59E0B' : '#71717A' }}>{ms >= 75 ? '🎯 Отлично съвпадение!' : ms >= 50 ? '👍 Добро съвпадение' : '🔍 Частично съвпадение'}</div>
                  <div style={{ fontSize: 11, color: '#71717A' }}>Базирано на: {profile.fields.slice(0, 2).join(', ') || '—'} · €{profile.budget}/мес</div>
                </div>
              </Card>
            ); })()}
            <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
              {[["info", "📋 Инфо"], ["prg", "🎓 Програми"], ["cost", "💰 Разходи"]].map(([k, l]) =>
                <button key={k} onClick={() => sTab(k)} style={{ padding: "8px 16px", borderRadius: 100, fontSize: 13, fontWeight: tab === k ? 600 : 500, color: tab === k ? "#CCFF00" : "#71717A", background: tab === k ? "rgba(204,255,0,0.1)" : "transparent", border: "none", fontFamily: "inherit" }}>{l}</button>
              )}
            </div>
            {tab === "info" && <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10, marginBottom: 16 }}>
                {[{ v: `#${sl.rank}`, l: "Ранг", cl: "#CCFF00" }, { v: `⭐${sl.rating}`, l: "Рейтинг", cl: "#F59E0B" }, { v: sl.tuition[0] === 0 && sl.tuition[1] === 0 ? "Безпл." : `€${sl.tuition[0]}–${sl.tuition[1]}`, l: "Такса", cl: "#22C55E" }, { v: sl.students.toLocaleString(), l: "Студенти", cl: "#5D5FEF" }, { v: `${sl.acceptance}%`, l: "Приемане", cl: "#EF4444" }, { v: `${sl.employability}%`, l: "Заетост", cl: "#14B8A6" }].map((s, i) => <Card key={i} style={{ textAlign: "center", padding: 12 }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: s.cl }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: "#71717A", marginTop: 2 }}>{s.l}</div>
                </Card>)}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{sl.fields.map((f, i) => <span key={i} style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, background: "rgba(255,255,255,0.06)", color: "#A1A1AA" }}>{f}</span>)}</div>
            </div>}
            {tab === "prg" && <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Програми ({sl.programs.length})</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {sl.programs.map((p, i) => <span key={i} style={{ padding: "7px 16px", borderRadius: 100, fontSize: 13, background: "rgba(93,95,239,0.1)", color: "#818CF8" }}>{p}</span>)}
              </div>
            </div>}
            {tab === "cost" && <div>
              <Card style={{ marginBottom: 12 }}>
                {[["🏠 Наем:", `€${Math.round(sl.costOfLiving * 0.55)}/мес`], ["🍕 Храна:", `€${Math.round(sl.costOfLiving * 0.25)}/мес`], ["🚌 Транспорт:", `€${Math.round(sl.costOfLiving * 0.1)}/мес`], ["📱 Други:", `€${Math.round(sl.costOfLiving * 0.1)}/мес`], ["📊 Общо:", `≈ €${sl.costOfLiving}/мес`]].map(([l, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none", fontSize: 14 }}>
                  <span style={{ color: "#71717A" }}>{l}</span><span style={{ fontWeight: i === 4 ? 700 : 500, color: i === 4 ? "#CCFF00" : "#fff" }}>{v}</span>
                </div>)}
              </Card>
              <Btn ghost sm onClick={() => nv("cost")}>💰 Пълен калкулатор →</Btn>
            </div>}
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              <Btn primary onClick={() => { user.addApplication({ uniId: sl.id, uni: sl.nameEn, country: sl.country, program: sl.programs[0] || 'General', emoji: sl.emoji }); nv("tracker"); }}>📤 Кандидатствай</Btn>
              <Btn accent onClick={() => tc(sl.id)} sm>{cm.includes(sl.id) ? "✓ В сравнението" : "📊 Сравни"}</Btn>
              <Btn ghost onClick={() => tf(sl.id)} sm>{fav.includes(sl.id) ? "❤️ В любими" : "🤍 Запази"}</Btn>
            </div>
            {/* Cross-module links */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <button onClick={() => nv("scholarships")} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 11, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E', cursor: 'pointer', fontFamily: 'inherit' }}>🎯 Стипендии за {sl.country}</button>
              <button onClick={() => nv("guides")} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 11, background: 'rgba(93,95,239,0.08)', border: '1px solid rgba(93,95,239,0.2)', color: '#818CF8', cursor: 'pointer', fontFamily: 'inherit' }}>🌍 Гайд за {sl.country}</button>
            </div>
          </div>
          : <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700 }}>Университети</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn ghost sm onClick={() => setMap(!mapMode)} style={{ color: mapMode ? "#CCFF00" : undefined }}>🗺️ Карта</Btn>
                {fav.length > 0 && <Btn ghost sm>❤️ {fav.length}</Btn>}
              </div>
            </div>
            <p style={{ color: "#71717A", fontSize: 14, marginBottom: 16 }}>{ls.length} резултата</p>

            {/* Recommended for you — shows when no filters/search active */}
            {profile.onboarded && !sr && !ft.c && !ft.f && !mapMode && (() => {
              const recs = getRecommendedUnis(profile, 5);
              return recs.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#CCFF00', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 16 }}>🎯</span> Препоръчани за теб
                    </div>
                    <span style={{ fontSize: 10, color: '#71717A' }}>Базирано на профила ти</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
                    {recs.map((u, i) => (
                      <Card key={u.id} onClick={() => { sL(u); sTab("info"); }} style={{
                        cursor: 'pointer', padding: '14px 16px', minWidth: 200, flexShrink: 0,
                        background: 'rgba(204,255,0,0.04)', border: '1px solid rgba(204,255,0,0.15)',
                        animation: `scaleIn .3s ease-out ${i * 0.06}s both`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 20 }}>{u.emoji}</span>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: u.matchScore >= 75 ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 700,
                            color: u.matchScore >= 75 ? '#22C55E' : '#F59E0B',
                          }}>{u.matchScore}%</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{u.nameEn}</div>
                        <div style={{ fontSize: 10, color: '#71717A' }}>📍{u.city} · 🏆#{u.rank}</div>
                        <div style={{ fontSize: 10, color: '#A1A1AA', marginTop: 3 }}>
                          {u.tuition[0] === 0 ? '🎉 Безпл.' : `💶 €${u.tuition[0]}`} · €{u.costOfLiving}/мес
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })()}

            {mapMode && <div style={{ marginBottom: 18 }}><EuropeMap onSelectUni={u => { sL(u); sTab("info"); setMap(false); }} filters={{ c: ft.c, field: ft.f }} /></div>}
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔍</span>
                <input value={sr} onChange={e => { sR(e.target.value); sCp(1) }} placeholder="Търси университет, програма, град..."
                  style={{ width: "100%", padding: "11px 14px 11px 38px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, fontSize: 14, fontFamily: "inherit", background: "#161618", color: "#fff", outline: "none" }} />
              </div>
              <Btn ghost sm onClick={() => sSf(!sf)} style={{ color: sf ? "#CCFF00" : undefined }}>⚙️ Филтри</Btn>
            </div>
            {sf && <Card style={{ marginBottom: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
              {[["Държава", "c", allCountries], ["Област", "f", allFields]].map(([l, k, ops]) => <div key={k}><div style={{ fontSize: 10, fontWeight: 600, color: "#71717A", textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.05em" }}>{l}</div>
                <select value={ft[k]} onChange={e => { sF({ ...ft, [k]: e.target.value }); sCp(1) }} style={{ width: "100%", padding: "8px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontFamily: "inherit", fontSize: 12, background: "#0A0A0B", color: "#A1A1AA" }}><option value="">Всички</option>{ops.map(o => <option key={o}>{o}</option>)}</select></div>)}
              <div><div style={{ fontSize: 10, fontWeight: 600, color: "#71717A", textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.05em" }}>Сортиране</div>
                <select value={ft.s} onChange={e => sF({ ...ft, s: e.target.value })} style={{ width: "100%", padding: "8px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontFamily: "inherit", fontSize: 12, background: "#0A0A0B", color: "#A1A1AA" }}>
                  <option value="ranking">Класиране</option>{profile.onboarded && <option value="match">🎯 Match %</option>}<option value="rating">Рейтинг</option><option value="tuition">Такса ↑</option><option value="emp">Заетост ↓</option><option value="col">Разходи ↑</option></select></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 16 }}>
                <input type="checkbox" checked={ft.free} onChange={e => { sF({ ...ft, free: e.target.checked }); sCp(1) }} style={{ accentColor: "#CCFF00" }} />
                <span style={{ fontSize: 12, color: "#A1A1AA" }}>Безплатно</span></div>
            </Card>}
            {sh.map(u => <UniRow key={u.id} u={u} />)}
            {tp > 1 && <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 20 }}>
              {Array.from({ length: tp }, (_, i) => <button key={i} onClick={() => sCp(i + 1)} style={{ width: 32, height: 32, borderRadius: 10, border: cp === i + 1 ? "1px solid #CCFF00" : "1px solid rgba(255,255,255,0.1)", background: cp === i + 1 ? "rgba(204,255,0,0.15)" : "transparent", color: cp === i + 1 ? "#CCFF00" : "#71717A", fontSize: 12, fontFamily: "inherit" }}>{i + 1}</button>)}</div>}
          </div>}
        </div>}

        {pg === "programs" && <ProgramExplorer onSelectUni={(u) => { sL(u); nv("browse"); sTab("info"); }} />}
        {pg === "scholarships" && <div style={{ padding: "32px 0" }}><ScholarshipFinder /></div>}
        {pg === "guides" && <CountryGuidesPage
          onBrowseUni={(u) => { sL(u); nv("browse"); sTab("info"); }}
          onBrowseCountry={(countryName) => { sF({ ...ft, c: countryName }); sSf(true); nv("browse"); }}
        />}
        {pg === "cost" && <CostCalculator onNavigate={nv} />}
        {pg === "decision" && <DecisionHelper onNavigate={nv} />}
        {pg === "tracker" && <ApplicationTracker />}
        {pg === "reviews" && <div style={{ padding: "32px 0" }}><StudentReviews /></div>}
        {pg === "peers" && <PeerChat />}
        {pg === "b2b" && <B2BPage />}

        {/* COMPARE */}
        {pg === "compare" && <div style={{ padding: "32px 0" }} className="page-enter">
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Сравнение</h2>
          {cm.length === 0 ? <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ fontSize: 48, marginBottom: 10 }}>📊</div><h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 6, color: '#fff' }}>Сравни университети</h3><p style={{ color: "#71717A", fontSize: 13, maxWidth: 360, margin: '0 auto 14px' }}>{fav.length > 0 ? `Имаш ${fav.length} любими. Добави ги за сравнение от страницата с университети!` : 'Разгледай университетите и добави до 4 за side-by-side сравнение.'}</p><Btn primary onClick={() => nv("browse")} style={{ marginTop: 14 }}>🎓 Разгледай университети →</Btn></div>
            : (() => {
              const cmpUnis = cm.map(id => universities.find(x => x.id === id)).filter(Boolean);
              const cmpScores = profile.onboarded ? cmpUnis.map(u => calcMatch(u, profile) || 0) : [];
              const bestIdx = cmpScores.length > 0 ? cmpScores.indexOf(Math.max(...cmpScores)) : -1;
              const numRows = [
                ["Ранг", u => u.rank, 'low'],
                ["Рейтинг", u => u.rating, 'high'],
                ["Приемане", u => u.acceptance, 'high'],
                ["Заетост", u => u.employability, 'high'],
                ["€/мес", u => u.costOfLiving, 'low'],
                ["Такса мин.", u => u.tuition[0], 'low'],
              ];
              return <div>
              {/* Match score cards */}
              {profile.onboarded && (
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cmpUnis.length}, 1fr)`, gap: 10, marginBottom: 16 }}>
                  {cmpUnis.map((u, i) => (
                    <Card key={u.id} style={{
                      textAlign: 'center', padding: '16px 12px',
                      background: i === bestIdx ? 'rgba(204,255,0,0.06)' : undefined,
                      border: i === bestIdx ? '1px solid rgba(204,255,0,0.3)' : undefined,
                    }}>
                      <div style={{ fontSize: 28, marginBottom: 4 }}>{u.emoji}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{u.nameEn}</div>
                      <MatchRing score={cmpScores[i]} size={52} />
                      {i === bestIdx && <div style={{ marginTop: 6, fontSize: 10, fontWeight: 700, color: '#CCFF00' }}>🏆 Най-добро съвпадение</div>}
                    </Card>
                  ))}
                </div>
              )}

              {/* Radar comparison */}
              {cmpUnis.length >= 2 && (
                <Card style={{ marginBottom: 16, padding: '16px 20px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#71717A', marginBottom: 12 }}>📊 Визуално сравнение</div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${numRows.length}, 1fr)`, gap: 6 }}>
                    {numRows.map(([label, fn, mode]) => {
                      const vals = cmpUnis.map(u => fn(u));
                      const best = mode === 'high' ? Math.max(...vals) : Math.min(...vals);
                      return (
                        <div key={label} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 9, color: '#71717A', marginBottom: 6, fontWeight: 600 }}>{label}</div>
                          {cmpUnis.map((u, i) => {
                            const v = vals[i];
                            const isBest = v === best && new Set(vals).size > 1;
                            return (
                              <div key={u.id} style={{
                                padding: '4px 0', fontSize: 11, fontWeight: isBest ? 700 : 400,
                                color: isBest ? '#CCFF00' : '#A1A1AA',
                              }}>
                                {label === 'Ранг' ? `#${v}` : label.includes('€') || label.includes('Такса') ? `€${v}` : label.includes('%') || label === 'Приемане' || label === 'Заетост' ? `${v}%` : `${v}`}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Full comparison table */}
              <div style={{ overflow: "auto" }}><Card style={{ overflow: "hidden", padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}><th style={{ padding: 12, textAlign: "left", fontWeight: 600, color: "#71717A", fontSize: 11, background: "#161618", minWidth: 100 }}></th>
                  {cmpUnis.map((u, i) => <th key={u.id} style={{ padding: 12, textAlign: "center", minWidth: 140, background: i === bestIdx ? 'rgba(204,255,0,0.04)' : undefined }}>
                    <div style={{ fontSize: 22 }}>{u.emoji}</div><div style={{ fontWeight: 600, fontSize: 12, color: "#fff", marginTop: 4 }}>{u.nameEn}</div>
                    <div onClick={() => user.toggleCompare(u.id)} style={{ fontSize: 10, color: "#71717A", cursor: "pointer", marginTop: 4 }}>✕ Премахни</div>
                  </th>)}</tr></thead>
                <tbody>{[
                  ["Място", u => `${u.city}, ${u.country}`, null],
                  ["Ранг", u => `#${u.rank}`, u => u.rank, 'low'],
                  ["Рейтинг", u => `⭐${u.rating}`, u => u.rating, 'high'],
                  ["Такса", u => u.tuition[0] === 0 && u.tuition[1] === 0 ? "Безпл.!" : `€${u.tuition[0]}–${u.tuition[1]}`, u => u.tuition[0], 'low'],
                  ["Студенти", u => u.students.toLocaleString(), null],
                  ["Осн.", u => u.founded, null],
                  ["Приемане", u => `${u.acceptance}%`, u => u.acceptance, 'high'],
                  ["Заетост", u => `${u.employability}%`, u => u.employability, 'high'],
                  ["€/мес", u => `€${u.costOfLiving}`, u => u.costOfLiving, 'low'],
                  ["Тип", u => u.type === "public" ? "Държавен" : "Частен", null],
                  ["Стипендии", u => u.scholarships ? "✅" : "❌", null],
                  ["Езици", u => u.languages.join(", "), null],
                  ["Програми", u => u.programs.slice(0, 4).join(", "), null],
                ].map(([l, fn, numFn, mode], i) => {
                  const vals = numFn ? cmpUnis.map(u => numFn(u)) : [];
                  const best = numFn ? (mode === 'high' ? Math.max(...vals) : Math.min(...vals)) : null;
                  return <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "#71717A", fontSize: 11, background: "rgba(255,255,255,0.02)" }}>{l}</td>
                  {cmpUnis.map((u, j) => {
                    const isBest = numFn && vals[j] === best && new Set(vals).size > 1;
                    return <td key={u.id} style={{
                      padding: "10px 12px", textAlign: "center", fontSize: 12,
                      color: isBest ? "#CCFF00" : "#A1A1AA",
                      fontWeight: isBest ? 700 : 400,
                      background: j === bestIdx ? 'rgba(204,255,0,0.02)' : undefined,
                    }}>{fn(u)}</td>;
                  })}
                </tr>})}</tbody></table>
            </Card></div>
            </div>; })()}
        </div>}

        {/* DASHBOARD */}
        {pg === "dash" && <div style={{ padding: "32px 0" }}>
          {!dn ? <div style={{ textAlign: "center", padding: "56px 0" }} className="page-enter">
            <div style={{ fontSize: 56, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>📋</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Твоето табло</h2>
            <p style={{ color: "#71717A", fontSize: 15, marginBottom: 20 }}>Направи RIASEC теста за персонализирано табло.</p>
            <Btn primary onClick={() => nv("test")}>🧠 Започни теста</Btn></div>
            : <div className="page-enter">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div><h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700 }}>Табло</h2>
                  <p style={{ color: "#71717A", fontSize: 13 }}>Holland Code: <span style={{ color: "#CCFF00", fontWeight: 700, fontSize: 16, letterSpacing: 2 }}>{getR().code}</span></p></div>
                <Btn ghost sm onClick={() => { sSt(0); sA({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }); sD(false); nv("test") }}>🔄 Повтори</Btn>
              </div>

              {/* Journey Progress Card */}
              {(() => { const actions = getNextActions(profile); return (
                <Card glow style={{ marginBottom: 20, padding: '20px 24px', background: 'rgba(204,255,0,0.04)', border: '1px solid rgba(204,255,0,0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>🎯</span> Прогрес на пътешествието
                    </div>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: '#CCFF00' }}>{user.journeyProgress}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, marginBottom: 16, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg,#CCFF00,#5D5FEF)', borderRadius: 3, width: `${user.journeyProgress}%`, transition: 'width .6s', boxShadow: '0 0 10px rgba(204,255,0,0.3)' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(100px,1fr))', gap: 6, marginBottom: 16 }}>
                    {user.JOURNEY_STAGES.map(stage => {
                      const isDone = user.completedStages.includes(stage.id);
                      const isCurrent = user.currentStage === stage.id;
                      return (
                        <div key={stage.id} onClick={() => nv(stage.route)} style={{
                          padding: '8px', borderRadius: 8, textAlign: 'center', cursor: 'pointer',
                          background: isDone ? 'rgba(34,197,94,0.1)' : isCurrent ? 'rgba(204,255,0,0.08)' : 'rgba(255,255,255,0.03)',
                          border: isDone ? '1px solid rgba(34,197,94,0.2)' : isCurrent ? '1px solid rgba(204,255,0,0.2)' : '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ fontSize: 14 }}>{isDone ? '✅' : stage.emoji}</div>
                          <div style={{ fontSize: 9, fontWeight: 600, color: isDone ? '#22C55E' : isCurrent ? '#CCFF00' : '#52525B', marginTop: 2 }}>{stage.label}</div>
                        </div>
                      );
                    })}
                  </div>
                  {actions.length > 0 && <>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#71717A', marginBottom: 8 }}>Следващи стъпки:</div>
                    <div style={{ display: 'grid', gap: 6 }}>
                      {actions.map((a, i) => (
                        <button key={i} onClick={() => nv(a.route)} style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                          background: '#161618', border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                          transition: 'all .15s',
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = '#CCFF00'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; }}>
                          <span style={{ fontSize: 18 }}>{a.icon}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{a.text}</div>
                            <div style={{ fontSize: 10, color: '#71717A' }}>{a.desc}</div>
                          </div>
                          <span style={{ marginLeft: 'auto', color: '#CCFF00', fontSize: 12 }}>→</span>
                        </button>
                      ))}
                    </div>
                  </>}
                </Card>
              ); })()}

              {/* Deadline Timeline */}
              {profile.applications.length > 0 && (
                <Card style={{ marginBottom: 20, padding: '18px 22px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>📅</span> Предстоящи дедлайни
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {profile.applications
                      .filter(a => a.deadline)
                      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                      .slice(0, 4)
                      .map((app, i) => {
                        const d = new Date(app.deadline);
                        const now = new Date();
                        const daysLeft = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
                        const urgent = daysLeft <= 14;
                        const past = daysLeft < 0;
                        return (
                          <div key={i} onClick={() => nv('tracker')} style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                            background: past ? 'rgba(239,68,68,0.06)' : urgent ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${past ? 'rgba(239,68,68,0.2)' : urgent ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)'}`,
                            borderRadius: 10, cursor: 'pointer',
                          }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: past ? 'rgba(239,68,68,0.1)' : urgent ? 'rgba(245,158,11,0.1)' : 'rgba(93,95,239,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                              {app.emoji || '🎓'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>{app.uni}</div>
                              <div style={{ fontSize: 10, color: '#71717A' }}>{app.program} · {d.toLocaleDateString('bg-BG')}</div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: past ? '#EF4444' : urgent ? '#F59E0B' : '#818CF8' }}>
                                {past ? 'Изтекъл' : `${daysLeft}д`}
                              </div>
                              <div style={{ fontSize: 9, color: '#71717A' }}>{past ? '' : urgent ? 'Скоро!' : 'остават'}</div>
                            </div>
                          </div>
                        );
                      })}
                    {profile.applications.filter(a => a.deadline).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '12px 0', color: '#71717A', fontSize: 12 }}>
                        Добави дедлайни в Tracker-а за да видиш timeline тук
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14, marginBottom: 28 }}>
                <Card><div style={{ fontSize: 13, fontWeight: 600, color: "#71717A", marginBottom: 8 }}>🧬 RIASEC Профил</div><RadarChart data={getR().dims.map(([k, v]) => ({ label: k, value: v }))} /></Card>
                <Card><div style={{ fontSize: 13, fontWeight: 600, color: "#71717A", marginBottom: 14 }}>📊 Резултати</div>
                  {getR().dims.map(([k, v], i) => <AnimBar key={k} value={v} max={Math.max(...getR().dims.map(d => d[1]))} color={cls[i]} label={`${dimEmoji[k]} ${RIASEC_MAP[k].name}`} />)}</Card>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 24 }}>
                {[[gU().length, "Препоръчани", "🎯", "#CCFF00"], [cm.length, "Сравнение", "📊", "#5D5FEF"], [fav.length, "Любими", "❤️", "#EF4444"], [profile.applications.length, "Кандидатури", "📝", "#F59E0B"]].map(([v, l, icon, cl], i) =>
                  <Card key={i} style={{ textAlign: "center", padding: 16, cursor: 'pointer' }} onClick={() => nv(l === 'Любими' ? 'browse' : l === 'Сравнение' ? 'compare' : l === 'Кандидатури' ? 'tracker' : 'browse')}>
                    <div style={{ fontSize: 18 }}>{icon}</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, color: cl, marginTop: 4 }}>{v}</div>
                    <div style={{ fontSize: 11, color: "#71717A", marginTop: 2 }}>{l}</div>
                  </Card>)}
              </div>
              {(() => { const arch = getArchetype(getR().top3.slice(0, 2)); return (
                <Card style={{ marginBottom: 20, background: "rgba(204,255,0,0.04)", border: "1px solid rgba(204,255,0,0.12)", display: "flex", gap: 14, alignItems: "center", padding: "16px 20px" }}>
                  <div style={{ fontSize: 38 }}>{arch.emoji}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>Архетип: <span className="grad-text">{arch.name}</span></div>
                    <div style={{ fontSize: 12, color: "#A1A1AA" }}>{arch.desc}</div>
                    <div style={{ fontSize: 11, color: "#71717A", marginTop: 3 }}>💼 {arch.careers} · ⭐ {arch.famous}</div>
                  </div>
                </Card>
              ); })()}
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, marginBottom: 12 }}>🏆 Топ препоръки</h3>
              {gU().slice(0, 5).map(u => <UniRow key={u.id} u={u} />)}
              {(() => { const topC = [...new Set(gU().map(u => u.country))].slice(0, 3); return topC.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, marginBottom: 12 }}>👔 Кариера</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
                    {topC.map((c) => { const co = careerOutcomes[c]; if (!co) return null; return (
                      <Card key={c} style={{ padding: 12, textAlign: "center" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{c}</div>
                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "#22C55E" }}>€{(co.salary1y / 1000).toFixed(0)}K → €{(co.salary5y / 1000).toFixed(0)}K</div>
                        <div style={{ fontSize: 10, color: "#71717A" }}>1г → 5г</div>
                      </Card>
                    ); })}
                  </div>
                </div>
              ); })()}
              {fav.length > 0 && <><h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, marginBottom: 12, marginTop: 20 }}>❤️ Любими</h3>
                {universities.filter(u => fav.includes(u.id)).map(u => <UniRow key={u.id} u={u} />)}</>}
            </div>}
        </div>}
      </div>

      {/* Floating compare */}
      {cm.length > 0 && pg !== "compare" && <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", background: "#161618", color: "white", padding: "10px 24px", borderRadius: 100, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 99, border: "1px solid rgba(255,255,255,0.1)" }}>
        <span style={{ background: "#5D5FEF", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{cm.length}</span>
        <span style={{ fontSize: 12, color: "#A1A1AA" }}>за сравнение</span>
        <Btn primary sm onClick={() => nv("compare")}>Сравни →</Btn>
      </div>}

      {!chat && <div onClick={() => setChat(true)} style={{ position: "fixed", bottom: cm.length > 0 ? 70 : 18, right: 18, width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg,#5D5FEF,#818CF8)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 20px rgba(93,95,239,0.4)", zIndex: 98, animation: "pulse 2s ease-in-out infinite", fontSize: 24 }}>🤖</div>}

      <AIChatbot isOpen={chat} onClose={() => setChat(false)} />

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px", textAlign: "center", color: "#71717A", fontSize: 11 }}>
        🎓 FindTheUni v7 © 2026 · <span style={{ color: "#CCFF00" }}>Glass & Neon Grid</span> · AI Matching
        {!profile.onboarded && <span style={{ marginLeft: 10 }}><button onClick={() => setShowOnboarding(true)} style={{ fontSize: 11, color: '#CCFF00', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Настрой профила →</button></span>}
      </div>
    </div>
  );
}
