import React, { useState, useMemo, useEffect } from 'react';
import { universities, allFields, allCountries, fieldEmoji } from './data/universities';
import { questions, RIASEC_MAP, dimEmoji, getArchetype, careerOutcomes } from './data/testData';
import { Btn, Card, RadarChart, AnimBar } from './components/UI';
import AIChatbot from './components/AIChatbot';
import EuropeMap from './components/EuropeMap';
import ScholarshipFinder from './components/ScholarshipFinder';
import CountryGuidesPage from './components/CountryGuides';
import ApplicationTracker from './components/ApplicationTracker';
import StudentReviews from './components/StudentReviews';
import PeerChat from './components/PeerChat';
import OnboardingWizard from './components/OnboardingWizard';
import B2BPage from './components/B2BPage';
import { useUser } from './UserContext';

const cls = ["#2563EB", "#7C3AED", "#059669", "#EA580C", "#E11D48", "#0891B2"];

// ─── Match Score Calculator ───────────────────
function calcMatch(u, profile) {
  if (!profile.onboarded) return null;
  let score = 0, max = 0;
  // Field overlap (30%)
  if (profile.fields.length > 0) {
    const overlap = u.fields.filter(f => profile.fields.includes(f)).length;
    score += (overlap / Math.max(profile.fields.length, 1)) * 30;
  } else score += 15;
  max += 30;
  // Budget fit (25%)
  if (profile.budget > 0) {
    const monthlyTotal = u.costOfLiving + (u.tuition[0] / 12);
    score += monthlyTotal <= profile.budget ? 25 : monthlyTotal <= profile.budget * 1.3 ? 15 : 5;
  } else score += 12;
  max += 25;
  // Language match (20%)
  if (profile.langPref === 'en') score += u.international > 15 ? 20 : 10;
  else if (profile.langPref === 'de') score += ['Германия','Австрия','Швейцария'].includes(u.country) ? 20 : 5;
  else if (profile.langPref === 'fr') score += ['Франция','Швейцария','Белгия'].includes(u.country) ? 20 : 5;
  else if (profile.langPref === 'local') score += u.tuition[0] === 0 ? 20 : 10;
  else score += 10;
  max += 20;
  // Rank quality (15%)
  score += u.rank <= 100 ? 15 : u.rank <= 300 ? 12 : u.rank <= 600 ? 8 : 4;
  max += 15;
  // Employability (10%)
  score += (u.employability / 100) * 10;
  max += 10;
  return Math.round((score / max) * 100);
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

  // Sync favorites/compare from UserContext
  const cm = profile.compared;
  const fav = profile.favorites;
  const tc = id => user.toggleCompare(id);
  const tf = id => user.toggleFav(id);

  // Show onboarding on first visit
  useEffect(() => {
    if (!profile.onboarded) setShowOnboarding(true);
  }, []);

  // Restore RIASEC state from profile
  useEffect(() => {
    if (profile.riasecDone && profile.riasecScores) {
      sA(profile.riasecScores);
      sD(true);
    }
  }, []);

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
      // Save to persistent profile
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
    <Card style={{ padding: "14px 16px", marginBottom: 8, cursor: "pointer", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center" }}
      onClick={() => { sL(u); if (pg !== "browse") nv("browse"); sTab("info"); }}>
      <div style={{ position: "relative" }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: "#F5F5F4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{u.emoji}</div>
        {matchScore !== null && <div style={{ position: "absolute", bottom: -4, right: -4, width: 22, height: 22, borderRadius: "50%", background: matchScore >= 75 ? "#059669" : matchScore >= 50 ? "#F59E0B" : "#A8A29E", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, border: "2px solid white" }}>{matchScore}</div>}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
        <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#78716C", flexWrap: "wrap" }}>
          <span>📍{u.city}, {u.country}</span><span>🏆#{u.rank}</span>
          <span>💰{u.tuition[0] === 0 && u.tuition[1] === 0 ? "Безпл." : `€${u.tuition[0]}–${u.tuition[1]}`}</span>
          {u.employability && <span>👔{u.employability}%</span>}
        </div>
        {matchedProgs.length > 0 && <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 4 }}>
          {matchedProgs.slice(0, 3).map((p, i) => <span key={i} style={{ padding: "1px 7px", borderRadius: 6, fontSize: 9, background: "#ECFDF5", color: "#059669", fontWeight: 500 }}>🎓 {p}</span>)}
          {matchedProgs.length > 3 && <span style={{ fontSize: 9, color: "#A8A29E" }}>+{matchedProgs.length - 3}</span>}
        </div>}
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#EA580C" }}>⭐{u.rating}</span>
        <div onClick={e => { e.stopPropagation(); tf(u.id) }} style={{ fontSize: 16, cursor: "pointer" }}>{fav.includes(u.id) ? "❤️" : "🤍"}</div>
        <div onClick={e => { e.stopPropagation(); tc(u.id) }} style={{ width: 20, height: 20, border: cm.includes(u.id) ? "none" : "2px solid #D6D3D1", borderRadius: 5, background: cm.includes(u.id) ? "#2563EB" : "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{cm.includes(u.id) ? "✓" : ""}</div>
      </div>
    </Card>
  ); };

  // Onboarding gate
  if (showOnboarding && !profile.onboarded) {
    return <OnboardingWizard onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,250,249,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid #E7E5E4", padding: "0 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div onClick={() => nv("home")} style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>📖 <span className="grad-text">Find The Uni</span></div>
          <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
            {[["home", "🏠"], ["test", "🧠"], ["browse", "🎓"], ["guides", "🌍"], ["scholarships", "🎯"], ["tracker", "📝"], ["reviews", "🌟"], ["peers", "💬"], ["compare", "📊"], ["dash", "📋"], ["b2b", "🏫"]].map(([k, icon]) =>
              <button key={k} onClick={() => nv(k)} style={{ padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: pg === k ? 600 : 500, color: pg === k ? "#2563EB" : "#78716C", background: pg === k ? "#EFF6FF" : "transparent", border: "none", flexShrink: 0 }}>{icon}</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", paddingBottom: 80 }}>

        {/* ═══ HOME ═══ */}
        {pg === "home" && <div className="page-enter">
          <div style={{ textAlign: "center", padding: "56px 0 40px" }}>
            <div style={{ display: "inline-flex", padding: "4px 12px", background: "#EFF6FF", color: "#2563EB", borderRadius: 14, fontSize: 11, fontWeight: 600, marginBottom: 16 }}>✨ v6 — Onboarding + Match Score + Profiles + B2B</div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 12 }}>Открий <span className="grad-text">перфектния университет</span></h1>
            <p style={{ fontSize: 15, color: "#78716C", maxWidth: 480, margin: "0 auto 22px", lineHeight: 1.6 }}>
              {profile.onboarded && profile.riasecDone
                ? `${profile.archetype ? `🏆 ${profile.archetype}` : ''} · ${profile.fields.slice(0,2).join(', ') || 'Всички области'} · €${profile.budget}/мес — твоите match-ове те чакат!`
                : '70 университета от 20+ държави. AI тест, стипендии, карта, съветник. Всичко на български.'}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {!profile.riasecDone
                ? <Btn primary onClick={() => nv("test")}>🚀 Започни за 60 секунди</Btn>
                : <Btn primary onClick={() => nv("dash")}>📋 Моето табло</Btn>}
              <Btn onClick={() => nv("browse")}>🎓 Университети</Btn>
              <Btn accent onClick={() => setChat(true)}>🤖 AI Съветник</Btn>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 36, flexWrap: "wrap" }}>
              {[["70", "Университета"], ["15", "Държави гайдове"], ["15", "Стипендии"], ["📝", "Tracker"]].map(([n, l]) => <div key={l}><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700 }}>{n}</div><div style={{ fontSize: 11, color: "#A8A29E" }}>{l}</div></div>)}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginBottom: 32 }}>
            {[
              { i: "🤖", bg: "#EFF6FF", t: "AI Съветник", d: "Питай Claude за университети, стипендии, програми.", click: () => setChat(true) },
              { i: "🧬", bg: "#F5F3FF", t: "RIASEC тест", d: "18 въпроса → Holland Code + Архетип + AI препоръки.", click: () => nv("test") },
              { i: "🗺️", bg: "#ECFDF5", t: "Карта на Европа", d: "Интерактивна карта с всички 70 университета.", click: () => nv("browse") },
              { i: "🌍", bg: "#F0FDF9", t: "Гайдове по държави", d: "15 държави — виза, жилище, работа, култура. + Quiz!", click: () => nv("guides") },
              { i: "🎯", bg: "#FFF7ED", t: "Стипендии", d: "15 стипендии — Erasmus+, DAAD, Chevening и други.", click: () => nv("scholarships") },
              { i: "📝", bg: "#FFFBEB", t: "Application Tracker", d: "Следи кандидатури, дедлайни, документи.", click: () => nv("tracker") },
              { i: "🌟", bg: "#FEF9C3", t: "Отзиви", d: "Реални мнения от български студенти в чужбина.", click: () => nv("reviews") },
              { i: "💬", bg: "#FCE7F3", t: "Чат със студенти", d: "Питай студенти-амбасадори за живота в чужбина.", click: () => nv("peers") },
              { i: "📊", bg: "#FFF1F2", t: "Сравнение", d: "Side-by-side по 15 критерия. До 4 университета.", click: () => nv("compare") },
              { i: "📋", bg: "#ECFEFF", t: "Табло", d: "Radar chart, кариерни данни, любими — всичко на едно място.", click: () => nv("dash") },
            ].map((f, i) => <Card key={i} style={{ cursor: "pointer" }} onClick={f.click}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, marginBottom: 8 }}>{f.i}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{f.t}</div>
              <div style={{ fontSize: 11, color: "#78716C", lineHeight: 1.4 }}>{f.d}</div>
            </Card>)}
          </div>

        </div>}

        {/* ═══ TEST ═══ */}
        {pg === "test" && <div style={{ padding: "32px 0" }} className="page-enter">
          {!dn ? <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <div style={{ textAlign: "center", fontSize: 11, color: "#A8A29E", marginBottom: 6 }}>Въпрос {st + 1} / {questions.length}</div>
            <div style={{ height: 4, background: "#E7E5E4", borderRadius: 2, marginBottom: 24, overflow: "hidden" }}><div style={{ height: "100%", background: "linear-gradient(90deg,#2563EB,#7C3AED)", borderRadius: 2, width: `${(st + 1) / questions.length * 100}%`, transition: "width .4s" }} /></div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8, animation: "float 3s ease-in-out infinite" }}>{questions[st].e}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", marginBottom: 4 }}>RIASEC · {RIASEC_MAP[questions[st].dim].name}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, marginBottom: 24, lineHeight: 1.3 }}>{questions[st].q}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                {[[1, "😐 Не особено"], [2, "🤔 Донякъде"], [3, "😊 Да!"], [4, "🤩 Много!"]].map(([v, l]) =>
                  <button key={v} onClick={() => answer(v)} style={{ padding: "14px 18px", background: "white", border: "2px solid #E7E5E4", borderRadius: 12, fontSize: 13, fontWeight: 500, minWidth: 100 }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.background = "#EFF6FF" }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "#E7E5E4"; e.currentTarget.style.background = "white" }}>{l}</button>
                )}
              </div>
            </div>
            {st > 0 && <div style={{ textAlign: "center", marginTop: 12 }}><button onClick={() => sSt(st - 1)} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, background: "white", border: "1px solid #E7E5E4", color: "#78716C" }}>← Назад</button></div>}
          </div>

          /* RESULTS */
          : <div className="page-enter">
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>🎉</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Holland Code: <span className="grad-text" style={{ fontSize: 28, letterSpacing: 2 }}>{getR().code}</span></h2>
              <p style={{ color: "#78716C", fontSize: 13 }}>Базирано на RIASEC теория</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12, marginBottom: 20 }}>
              <Card style={{ animation: "scaleIn .5s ease-out" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#78716C", marginBottom: 8 }}>🧬 RIASEC радар</div>
                <RadarChart data={getR().dims.map(([k, v]) => ({ label: k, value: v }))} />
              </Card>
              <Card style={{ animation: "scaleIn .5s ease-out .15s both" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#78716C", marginBottom: 12 }}>📊 Резултати</div>
                {getR().dims.map(([k, v], i) => <AnimBar key={k} value={v} max={Math.max(...getR().dims.map(d => d[1]))} color={cls[i]} label={`${dimEmoji[k]} ${RIASEC_MAP[k].name}`} delay={i * 0.1} />)}
                <div style={{ marginTop: 12, padding: "10px 12px", background: "#F5F3FF", borderRadius: 8, fontSize: 11, color: "#7C3AED", lineHeight: 1.5 }}>
                  <strong>Топ тип:</strong> {RIASEC_MAP[getR().top3[0]].desc}
                </div>
              </Card>
            </div>

            {/* ── PERSONALITY ARCHETYPE ── */}
            {(() => { const arch = getArchetype(getR().top3.slice(0, 2)); return (
              <Card style={{ marginBottom: 20, background: "linear-gradient(135deg,#EFF6FF,#F5F3FF)", border: "none", textAlign: "center", padding: "20px", animation: "scaleIn .5s ease-out .3s both" }}>
                <div style={{ fontSize: 44, marginBottom: 6 }}>{arch.emoji}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Ти си <span className="grad-text">{arch.name}</span></div>
                <p style={{ fontSize: 12, color: "#57534E", lineHeight: 1.5, maxWidth: 400, margin: "0 auto 10px" }}>{arch.desc}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{ padding: "4px 12px", borderRadius: 8, fontSize: 10, background: "#ECFDF5", color: "#059669" }}>💼 {arch.careers}</span>
                  <span style={{ padding: "4px 12px", borderRadius: 8, fontSize: 10, background: "#FFF7ED", color: "#EA580C" }}>⭐ {arch.famous}</span>
                </div>
                <div style={{ fontSize: 10, color: "#A8A29E" }}>Holland Code: {getR().code} → Архетип базиран на топ 2 типа</div>
              </Card>
            ); })()}

            {/* ── CAREER OUTCOMES FOR TOP RECOMMENDED COUNTRIES ── */}
            {(() => { const topCountries = [...new Set(gU().map(u => u.country))].slice(0, 4); return topCountries.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>👔 Кариерни перспективи по държава</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 8 }}>
                  {topCountries.map((c, i) => { const co = careerOutcomes[c]; if (!co) return null; return (
                    <Card key={c} style={{ padding: 10, textAlign: "center", animation: `scaleIn .3s ease-out ${i * 0.06}s both` }}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{c}</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#059669" }}>€{(co.salary1y / 1000).toFixed(0)}K</div>
                      <div style={{ fontSize: 9, color: "#A8A29E", marginBottom: 4 }}>1-ва год след дипломата</div>
                      <div style={{ fontSize: 10, color: "#78716C" }}>→ €{(co.salary3y / 1000).toFixed(0)}K (3г) → €{(co.salary5y / 1000).toFixed(0)}K (5г)</div>
                      <div style={{ height: 3, background: "#E7E5E4", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: "#059669", width: `${Math.min(co.salary5y / 950, 100)}%`, borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: 9, color: "#A8A29E", marginTop: 4 }}>🏢 {co.topIndustries.slice(0, 2).join(", ")} · 📉 {co.unemployment}% безр.</div>
                    </Card>
                  ); })}
                </div>
              </div>
            ); })()}

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>🎯 Препоръчани области</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {getR().fields.map((f, i) => <span key={i} style={{ padding: "5px 14px", borderRadius: 12, fontSize: 12, fontWeight: 500, background: "#EFF6FF", color: "#2563EB", border: "1px solid #DBEAFE" }}>{fieldEmoji[f] || "📌"} {f}</span>)}
              </div>
            </div>

            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginBottom: 10 }}>🎓 Топ за теб</h3>
            {gU().map(u => <UniRow key={u.id} u={u} />)}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
              <Btn onClick={() => { sSt(0); sA({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }); sD(false) }} sm>🔄 Повтори</Btn>
              <Btn accent onClick={() => nv("dash")} sm>📋 Табло</Btn>
              <Btn primary onClick={() => nv("browse")} sm>Всички →</Btn>
            </div>
          </div>}
        </div>}

        {/* ═══ BROWSE ═══ */}
        {pg === "browse" && <div style={{ padding: "32px 0" }} className="page-enter">
          {sl ? <div>
            <Btn onClick={() => sL(null)} sm style={{ marginBottom: 16 }}>← Назад</Btn>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#F5F5F4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{sl.emoji}</div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 3 }}>{sl.name}</h1>
                <div style={{ color: "#78716C", fontSize: 12 }}>📍 {sl.city}, {sl.country} · {sl.type === "public" ? "🏛️ Държавен" : "🏢 Частен"} · 📅 {sl.founded} · 🌐 {sl.languages.join(", ")}</div>
              </div>
              <div onClick={() => tf(sl.id)} style={{ fontSize: 22, cursor: "pointer" }}>{fav.includes(sl.id) ? "❤️" : "🤍"}</div>
            </div>

            {/* Match score banner */}
            {(() => { const ms = calcMatch(sl, profile); return ms !== null && (
              <Card style={{ marginBottom: 14, background: ms >= 75 ? '#ECFDF5' : ms >= 50 ? '#FFFBEB' : '#F5F5F4', border: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: ms >= 75 ? '#059669' : ms >= 50 ? '#F59E0B' : '#A8A29E', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{ms}%</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: ms >= 75 ? '#059669' : ms >= 50 ? '#92400E' : '#78716C' }}>{ms >= 75 ? '🎯 Отлично съвпадение!' : ms >= 50 ? '👍 Добро съвпадение' : '🔍 Частично съвпадение'}</div>
                  <div style={{ fontSize: 10, color: '#A8A29E' }}>Базирано на твоя профил: {profile.fields.slice(0, 2).join(', ') || '—'} · €{profile.budget}/мес</div>
                </div>
              </Card>
            ); })()}

            <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: "1px solid #E7E5E4", paddingBottom: 8 }}>
              {[["info", "📋 Инфо"], ["prg", "🎓 Програми"], ["cost", "💰 Разходи"]].map(([k, l]) =>
                <button key={k} onClick={() => sTab(k)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: tab === k ? 600 : 500, color: tab === k ? "#2563EB" : "#78716C", background: tab === k ? "#EFF6FF" : "transparent", border: "none" }}>{l}</button>
              )}
            </div>

            {tab === "info" && <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 8, marginBottom: 14 }}>
                {[{ v: `#${sl.rank}`, l: "Ранг", cl: "#2563EB" }, { v: `⭐${sl.rating}`, l: "Рейтинг", cl: "#EA580C" }, { v: sl.tuition[0] === 0 && sl.tuition[1] === 0 ? "Безпл." : `€${sl.tuition[0]}–${sl.tuition[1]}`, l: "Такса", cl: "#059669" }, { v: sl.students.toLocaleString(), l: "Студенти", cl: "#7C3AED" }, { v: `${sl.acceptance}%`, l: "Приемане", cl: "#E11D48" }, { v: `${sl.employability}%`, l: "Заетост", cl: "#059669" }].map((s, i) => <Card key={i} style={{ textAlign: "center", padding: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display',serif", color: s.cl }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: "#A8A29E" }}>{s.l}</div>
                </Card>)}
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{sl.fields.map((f, i) => <span key={i} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, background: "#F5F5F4", color: "#78716C", border: "1px solid #E7E5E4" }}>{f}</span>)}</div>
            </div>}

            {tab === "prg" && <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Програми ({sl.programs.length})</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {sl.programs.map((p, i) => <span key={i} style={{ padding: "6px 14px", borderRadius: 10, fontSize: 12, background: "#EFF6FF", color: "#2563EB", border: "1px solid #DBEAFE" }}>{p}</span>)}
              </div>
            </div>}

            {tab === "cost" && <Card>
              {[["🏠 Наем:", `€${Math.round(sl.costOfLiving * 0.55)}/мес`], ["🍕 Храна:", `€${Math.round(sl.costOfLiving * 0.25)}/мес`], ["🚌 Транспорт:", `€${Math.round(sl.costOfLiving * 0.1)}/мес`], ["📱 Други:", `€${Math.round(sl.costOfLiving * 0.1)}/мес`], ["📊 Общо:", `≈ €${sl.costOfLiving}/мес`]].map(([l, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid #F5F5F4" : "none", fontSize: 13 }}>
                <span style={{ color: "#78716C" }}>{l}</span><span style={{ fontWeight: i === 4 ? 700 : 500 }}>{v}</span>
              </div>)}
            </Card>}

            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <Btn primary onClick={() => { user.addApplication({ uniId: sl.id, uni: sl.nameEn, country: sl.country, program: sl.programs[0] || 'General', emoji: sl.emoji }); nv("tracker"); }}>📤 Кандидатствай</Btn>
              <Btn accent onClick={() => tc(sl.id)} sm>{cm.includes(sl.id) ? "✓ В сравнението" : "📊 Сравни"}</Btn>
              <Btn onClick={() => tf(sl.id)} sm>{fav.includes(sl.id) ? "❤️ В любими" : "🤍 Запази"}</Btn>
            </div>
          </div>

          : <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600 }}>Университети</h2>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn sm onClick={() => setMap(!mapMode)} style={{ color: mapMode ? "#2563EB" : "#78716C", background: mapMode ? "#EFF6FF" : "white" }}>🗺️ Карта</Btn>
                {fav.length > 0 && <Btn sm>❤️ {fav.length}</Btn>}
              </div>
            </div>
            <p style={{ color: "#78716C", fontSize: 13, marginBottom: 14 }}>{ls.length} резултата</p>

            {mapMode && <div style={{ marginBottom: 16 }}>
              <EuropeMap onSelectUni={u => { sL(u); sTab("info"); setMap(false); }} filters={{ c: ft.c, field: ft.f }} />
            </div>}

            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
                <input value={sr} onChange={e => { sR(e.target.value); sCp(1) }} placeholder="Търси университет, програма, град..."
                  style={{ width: "100%", padding: "9px 10px 9px 32px", border: "1px solid #E7E5E4", borderRadius: 8, fontSize: 13, fontFamily: "inherit", background: "white", outline: "none" }} />
              </div>
              <Btn sm onClick={() => sSf(!sf)} style={{ color: sf ? "#2563EB" : "#78716C", background: sf ? "#EFF6FF" : "white" }}>⚙️ Филтри</Btn>
            </div>

            {sf && <Card style={{ marginBottom: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 8 }}>
              {[["Държава", "c", allCountries], ["Област", "f", allFields]].map(([l, k, ops]) => <div key={k}><div style={{ fontSize: 9, fontWeight: 600, color: "#78716C", textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                <select value={ft[k]} onChange={e => { sF({ ...ft, [k]: e.target.value }); sCp(1) }} style={{ width: "100%", padding: "6px", border: "1px solid #E7E5E4", borderRadius: 5, fontFamily: "inherit", fontSize: 11, background: "#FAFAF9" }}><option value="">Всички</option>{ops.map(o => <option key={o}>{o}</option>)}</select></div>)}
              <div><div style={{ fontSize: 9, fontWeight: 600, color: "#78716C", textTransform: "uppercase", marginBottom: 3 }}>Сортиране</div>
                <select value={ft.s} onChange={e => sF({ ...ft, s: e.target.value })} style={{ width: "100%", padding: "6px", border: "1px solid #E7E5E4", borderRadius: 5, fontFamily: "inherit", fontSize: 11, background: "#FAFAF9" }}>
                  <option value="ranking">Класиране</option>{profile.onboarded && <option value="match">🎯 Match %</option>}<option value="rating">Рейтинг</option><option value="tuition">Такса ↑</option><option value="emp">Заетост ↓</option><option value="col">Разходи ↑</option></select></div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 14 }}>
                <input type="checkbox" checked={ft.free} onChange={e => { sF({ ...ft, free: e.target.checked }); sCp(1) }} />
                <span style={{ fontSize: 11, fontWeight: 500 }}>Безплатно</span></div>
            </Card>}

            {sh.map(u => <UniRow key={u.id} u={u} />)}
            {tp > 1 && <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 16 }}>
              {Array.from({ length: tp }, (_, i) => <button key={i} onClick={() => sCp(i + 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid " + (cp === i + 1 ? "#1C1917" : "#E7E5E4"), background: cp === i + 1 ? "#1C1917" : "white", color: cp === i + 1 ? "white" : "#78716C", fontSize: 11 }}>{i + 1}</button>)}</div>}
          </div>}
        </div>}

        {/* ═══ SCHOLARSHIPS ═══ */}
        {pg === "scholarships" && <div style={{ padding: "32px 0" }}><ScholarshipFinder /></div>}

        {/* ═══ COUNTRY GUIDES ═══ */}
        {pg === "guides" && <CountryGuidesPage onBrowseUni={(u) => { sL(u); nv("browse"); sTab("info"); }} />}

        {/* ═══ APPLICATION TRACKER ═══ */}
        {pg === "tracker" && <ApplicationTracker />}

        {/* ═══ STUDENT REVIEWS ═══ */}
        {pg === "reviews" && <div style={{ padding: "32px 0" }}><StudentReviews /></div>}

        {/* ═══ PEER CHAT ═══ */}
        {pg === "peers" && <PeerChat />}

        {/* ═══ B2B ═══ */}
        {pg === "b2b" && <B2BPage />}

        {/* ═══ COMPARE ═══ */}
        {pg === "compare" && <div style={{ padding: "32px 0" }} className="page-enter">
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Сравнение</h2>
          {cm.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0" }}><div style={{ fontSize: 44, marginBottom: 8 }}>📊</div><p style={{ color: "#78716C", fontSize: 13 }}>Избери до 4 университета</p><Btn primary onClick={() => nv("browse")} style={{ marginTop: 12 }}>Университети →</Btn></div>
            : <div style={{ overflow: "auto" }}><Card style={{ overflow: "hidden", padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ borderBottom: "2px solid #E7E5E4" }}><th style={{ padding: 10, textAlign: "left", fontWeight: 600, color: "#78716C", fontSize: 10, background: "#FAFAF9", minWidth: 90 }}></th>
                  {cm.map(id => { const u = universities.find(x => x.id === id); return u ? <th key={id} style={{ padding: 10, textAlign: "center", minWidth: 130 }}>
                    <div style={{ fontSize: 20 }}>{u.emoji}</div><div style={{ fontWeight: 600, fontSize: 11 }}>{u.nameEn}</div>
                    <div onClick={() => sC(p => p.filter(x => x !== id))} style={{ fontSize: 9, color: "#A8A29E", cursor: "pointer", marginTop: 2 }}>✕ Премахни</div>
                  </th> : null })}</tr></thead>
                <tbody>{[["Място", u => `${u.city}, ${u.country}`], ["Ранг", u => `#${u.rank}`], ["Рейтинг", u => `⭐${u.rating}`], ["Такса", u => u.tuition[0] === 0 && u.tuition[1] === 0 ? "Безпл.!" : `€${u.tuition[0]}–${u.tuition[1]}`], ["Студенти", u => u.students.toLocaleString()], ["Осн.", u => u.founded], ["Приемане", u => `${u.acceptance}%`], ["Заетост", u => `${u.employability}%`], ["€/мес", u => `€${u.costOfLiving}`], ["Тип", u => u.type === "public" ? "Държавен" : "Частен"], ["Стипендии", u => u.scholarships ? "✅" : "❌"], ["Езици", u => u.languages.join(", ")], ["Програми", u => u.programs.slice(0, 4).join(", ")]].map(([l, fn], i) => <tr key={i} style={{ borderBottom: "1px solid #E7E5E4" }}>
                  <td style={{ padding: "8px 10px", fontWeight: 600, color: "#78716C", fontSize: 10, background: "#FAFAF9" }}>{l}</td>
                  {cm.map(id => { const u = universities.find(x => x.id === id); return u ? <td key={id} style={{ padding: "8px 10px", textAlign: "center", fontSize: 11 }}>{fn(u)}</td> : null })}
                </tr>)}</tbody></table>
            </Card></div>}
        </div>}

        {/* ═══ DASHBOARD ═══ */}
        {pg === "dash" && <div style={{ padding: "32px 0" }}>
          {!dn ? <div style={{ textAlign: "center", padding: "48px 0" }} className="page-enter">
            <div style={{ fontSize: 52, marginBottom: 10, animation: "float 3s ease-in-out infinite" }}>📋</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Твоето табло</h2>
            <p style={{ color: "#78716C", fontSize: 14, marginBottom: 18, maxWidth: 380, margin: "0 auto 18px" }}>Направи RIASEC теста за персонализирано табло.</p>
            <Btn primary onClick={() => nv("test")}>🧠 Започни теста</Btn></div>
            : <div className="page-enter">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600 }}>Табло</h2>
                  <p style={{ color: "#78716C", fontSize: 12 }}>Holland Code: <span style={{ color: "#2563EB", fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>{getR().code}</span></p></div>
                <Btn sm onClick={() => { sSt(0); sA({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }); sD(false); nv("test") }}>🔄 Повтори</Btn>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12, marginBottom: 24 }}>
                <Card style={{ animation: "scaleIn .5s ease-out" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#78716C", marginBottom: 6 }}>🧬 RIASEC Профил</div>
                  <RadarChart data={getR().dims.map(([k, v]) => ({ label: k, value: v }))} />
                </Card>
                <Card style={{ animation: "scaleIn .5s ease-out .1s both" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#78716C", marginBottom: 12 }}>📊 Резултати</div>
                  {getR().dims.map(([k, v], i) => <AnimBar key={k} value={v} max={Math.max(...getR().dims.map(d => d[1]))} color={cls[i]} label={`${dimEmoji[k]} ${RIASEC_MAP[k].name}`} delay={i * 0.08} />)}
                </Card>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 8, marginBottom: 20 }}>
                {[[gU().length, "Препоръчани", "🎯", "#2563EB", "#EFF6FF"], [cm.length, "Сравнение", "📊", "#7C3AED", "#F5F3FF"], [fav.length, "Любими", "❤️", "#E11D48", "#FFF1F2"], [new Set(gU().map(u => u.country)).size, "Държави", "🌍", "#059669", "#ECFDF5"]].map(([v, l, icon, cl, bg], i) =>
                  <Card key={i} style={{ textAlign: "center", background: bg, border: "none", animation: `scaleIn .3s ease-out ${i * 0.05}s both` }}>
                    <div style={{ fontSize: 16 }}>{icon}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display',serif", color: cl }}>{v}</div>
                    <div style={{ fontSize: 9, color: cl, fontWeight: 500 }}>{l}</div>
                  </Card>)}
              </div>

              {/* Archetype on dashboard */}
              {(() => { const arch = getArchetype(getR().top3.slice(0, 2)); return (
                <Card style={{ marginBottom: 16, background: "linear-gradient(135deg,#EFF6FF,#F5F3FF)", border: "none", display: "flex", gap: 12, alignItems: "center", padding: "14px 18px", animation: "scaleIn .4s ease-out .2s both" }}>
                  <div style={{ fontSize: 34 }}>{arch.emoji}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Архетип: <span className="grad-text">{arch.name}</span></div>
                    <div style={{ fontSize: 11, color: "#57534E" }}>{arch.desc}</div>
                    <div style={{ fontSize: 10, color: "#A8A29E", marginTop: 2 }}>💼 {arch.careers} · ⭐ {arch.famous}</div>
                  </div>
                </Card>
              ); })()}

              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, marginBottom: 10 }}>🏆 Топ препоръки</h3>
              {gU().slice(0, 5).map(u => <UniRow key={u.id} u={u} />)}

              {/* Career outcomes on dashboard */}
              {(() => { const topC = [...new Set(gU().map(u => u.country))].slice(0, 3); return topC.length > 0 && (
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, marginBottom: 10 }}>👔 Кариера след дипломата</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 8 }}>
                    {topC.map((c, i) => { const co = careerOutcomes[c]; if (!co) return null; return (
                      <Card key={c} style={{ padding: 10, textAlign: "center" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 3 }}>{c}</div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#059669" }}>€{(co.salary1y / 1000).toFixed(0)}K → €{(co.salary5y / 1000).toFixed(0)}K</div>
                        <div style={{ fontSize: 9, color: "#A8A29E" }}>1г → 5г · 🏢 {co.topIndustries[0]}</div>
                      </Card>
                    ); })}
                  </div>
                </div>
              ); })()}

              {fav.length > 0 && <><h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, marginBottom: 10, marginTop: 16 }}>❤️ Любими</h3>
                {universities.filter(u => fav.includes(u.id)).map(u => <UniRow key={u.id} u={u} />)}</>}
            </div>}
        </div>}
      </div>

      {/* FLOATING COMPARE */}
      {cm.length > 0 && pg !== "compare" && <div style={{ position: "fixed", bottom: 14, left: "50%", transform: "translateX(-50%)", background: "#1C1917", color: "white", padding: "9px 20px", borderRadius: 28, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 6px 20px rgba(0,0,0,0.15)", zIndex: 99 }}>
        <span style={{ background: "#2563EB", padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 600 }}>{cm.length}</span>
        <span style={{ fontSize: 11 }}>за сравнение</span>
        <Btn accent sm onClick={() => nv("compare")}>Сравни →</Btn>
      </div>}

      {/* AI CHATBOT BUTTON */}
      {!chat && <div onClick={() => setChat(true)} style={{ position: "fixed", bottom: cm.length > 0 ? 64 : 16, right: 16, width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#2563EB,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(37,99,235,0.3)", zIndex: 98, animation: "pulse 2s ease-in-out infinite", fontSize: 22 }}>🤖</div>}

      <AIChatbot isOpen={chat} onClose={() => setChat(false)} />

      <div style={{ borderTop: "1px solid #E7E5E4", padding: "20px", textAlign: "center", color: "#A8A29E", fontSize: 10 }}>
        📖 Find The Uni v6 © 2026 · AI Matching + Profiles + Onboarding + B2B
        {!profile.onboarded && <span style={{ marginLeft: 8 }}><button onClick={() => setShowOnboarding(true)} style={{ fontSize: 10, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Настрой профила си →</button></span>}
      </div>
    </div>
  );
}
