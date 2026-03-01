import React, { useState, useMemo, useEffect } from 'react';
import { universities, allFields, allCountries, fieldEmoji } from './data/universities';
import { questions, RIASEC_MAP, dimEmoji, getArchetype, careerOutcomes } from './data/testData';
import { Btn, Card, RadarChart, AnimBar, MatchRing } from './components/UI';
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

const cls = ["#CCFF00", "#5D5FEF", "#22C55E", "#F59E0B", "#EF4444", "#14B8A6"];

function calcMatch(u, profile) {
  if (!profile.onboarded) return null;
  let score = 0, max = 0;
  if (profile.fields.length > 0) {
    const overlap = u.fields.filter(f => profile.fields.includes(f)).length;
    score += (overlap / Math.max(profile.fields.length, 1)) * 30;
  } else score += 15;
  max += 30;
  if (profile.budget > 0) {
    const monthlyTotal = u.costOfLiving + (u.tuition[0] / 12);
    score += monthlyTotal <= profile.budget ? 25 : monthlyTotal <= profile.budget * 1.3 ? 15 : 5;
  } else score += 12;
  max += 25;
  if (profile.langPref === 'en' || (Array.isArray(profile.langPref) && profile.langPref.includes('en')))
    score += u.international > 15 ? 20 : 10;
  if (profile.langPref === 'de' || (Array.isArray(profile.langPref) && profile.langPref.includes('de')))
    score += ['Германия','Австрия','Швейцария'].includes(u.country) ? 20 : 5;
  if (profile.langPref === 'fr' || (Array.isArray(profile.langPref) && profile.langPref.includes('fr')))
    score += ['Франция','Швейцария','Белгия'].includes(u.country) ? 20 : 5;
  if (profile.langPref === 'local' || (Array.isArray(profile.langPref) && profile.langPref.includes('local')))
    score += u.tuition[0] === 0 ? 20 : 10;
  if (!profile.langPref || (Array.isArray(profile.langPref) && profile.langPref.length === 0))
    score += 10;
  max += 20;
  score += u.rank <= 100 ? 15 : u.rank <= 300 ? 12 : u.rank <= 600 ? 8 : 4;
  max += 15;
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
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
    const handleClick = () => { sL(u); if (pg !== "browse") nv("browse"); sTab("info"); };
    if (isMobile) return (
      <Card style={{ padding: "10px 12px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }} onClick={handleClick}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{u.emoji}</div>
          {matchScore !== null && <div style={{ position: "absolute", bottom: -3, right: -3, width: 18, height: 18, borderRadius: "50%", background: matchScore >= 75 ? "#22C55E" : matchScore >= 50 ? "#F59E0B" : "#71717A", color: "#0A0A0B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 700, border: "2px solid #0A0A0B" }}>{matchScore}</div>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
          <div style={{ display: "flex", gap: 5, fontSize: 11, color: "#71717A", marginTop: 2, alignItems: "center" }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>📍{u.city}</span>
            <span style={{ flexShrink: 0 }}>· 🏆#{u.rank}</span>
            <span style={{ flexShrink: 0, color: u.tuition[0] === 0 ? "#22C55E" : "#A1A1AA" }}>· {u.tuition[0] === 0 ? "🎉 Безпл." : `€${u.tuition[0]}`}</span>
            <span style={{ flexShrink: 0, color: "#F59E0B" }}>· ⭐{u.rating}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
          <div onClick={e => { e.stopPropagation(); tf(u.id) }} style={{ fontSize: 16, cursor: "pointer" }}>{fav.includes(u.id) ? "❤️" : "🤍"}</div>
          <div onClick={e => { e.stopPropagation(); tc(u.id) }} style={{ width: 22, height: 22, border: cm.includes(u.id) ? "none" : "2px solid rgba(255,255,255,0.15)", borderRadius: 7, background: cm.includes(u.id) ? "#5D5FEF" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{cm.includes(u.id) ? "✓" : ""}</div>
        </div>
      </Card>
    );
    return (
    <Card style={{ padding: "16px 18px", marginBottom: 10, cursor: "pointer", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center" }}
      onClick={handleClick}>
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
      {/* TOP NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,11,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <div onClick={() => nv("home")} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: 10, background: "#CCFF00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎓</span>
            <span className="grad-text">FindTheUni</span>
          </div>
          {/* Desktop nav — hidden on mobile */}
          {!isMobile && (
            <div style={{ display: "flex", gap: 1 }}>
              {[["home", "🏠", "Начало"], ["test", "🧠", "Тест"], ["browse", "🎓", "Универс."], ["guides", "🌍", "Гайдове"], ["scholarships", "🎯", "Стипенд."], ["tracker", "📝", "Tracker"], ["reviews", "🌟", "Отзиви"], ["peers", "💬", "Peers"], ["compare", "📊", "Сравни"], ["dash", "📋", "Табло"]].map(([k, icon, label]) =>
                <button key={k} onClick={() => nv(k)} style={{ padding: "5px 9px", borderRadius: 9, border: "none", background: pg === k ? "rgba(204,255,0,0.1)" : "transparent", color: pg === k ? "#CCFF00" : "#71717A", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, cursor: "pointer" }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span style={{ fontSize: 9, fontWeight: pg === k ? 700 : 400 }}>{label}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM TAB BAR */}
      {isMobile && (
        <>
          {/* Backdrop for More drawer */}
          {showMore && <div onClick={() => setShowMore(false)} style={{ position: "fixed", inset: 0, zIndex: 149, background: "rgba(0,0,0,0.5)" }} />}

          {/* More drawer */}
          {showMore && (
            <div style={{ position: "fixed", bottom: 60, left: 0, right: 0, zIndex: 150, background: "#161618", borderTop: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px 20px 0 0", padding: "16px 12px 8px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[["guides", "🌍", "Гайдове"], ["tracker", "📝", "Tracker"], ["reviews", "🌟", "Отзиви"], ["peers", "💬", "Peers"], ["compare", "📊", "Сравни"]].map(([k, icon, label]) =>
                <button key={k} onClick={() => { nv(k); setShowMore(false); }} style={{ padding: "10px 4px", borderRadius: 12, border: "none", background: pg === k ? "rgba(204,255,0,0.1)" : "rgba(255,255,255,0.05)", color: pg === k ? "#CCFF00" : "#A1A1AA", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <span style={{ fontSize: 10, fontWeight: pg === k ? 700 : 400 }}>{label}</span>
                </button>
              )}
            </div>
          )}

          {/* Bottom tab bar */}
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 150, background: "rgba(10,10,11,0.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", height: 60, paddingBottom: "env(safe-area-inset-bottom)" }}>
            {[["home", "🏠", "Начало"], ["test", "🧠", "Тест"], ["browse", "🎓", "Преглед"], ["scholarships", "🎯", "Стипенд."], ["dash", "📋", "Табло"]].map(([k, icon, label]) =>
              <button key={k} onClick={() => { nv(k); setShowMore(false); }} style={{ flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, color: pg === k ? "#CCFF00" : "#71717A", cursor: "pointer", position: "relative" }}>
                {pg === k && <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 2, background: "#CCFF00", borderRadius: "0 0 4px 4px" }} />}
                <span style={{ fontSize: 22 }}>{icon}</span>
                <span style={{ fontSize: 9, fontWeight: pg === k ? 700 : 400 }}>{label}</span>
              </button>
            )}
            <button onClick={() => setShowMore(v => !v)} style={{ flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, color: showMore ? "#CCFF00" : "#71717A", cursor: "pointer" }}>
              <span style={{ fontSize: 22 }}>≡</span>
              <span style={{ fontSize: 9 }}>Още</span>
            </button>
          </div>
        </>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", paddingBottom: isMobile ? 90 : 80 }}>

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
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {!profile.riasecDone
                ? <Btn primary onClick={() => nv("test")}>🚀 Започни за 60 секунди</Btn>
                : <Btn primary onClick={() => nv("dash")}>📋 Моето табло</Btn>}
              <Btn ghost onClick={() => nv("browse")}>🎓 Университети</Btn>
              <Btn accent onClick={() => setChat(true)}>🤖 AI Съветник</Btn>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 48, flexWrap: "wrap" }}>
              {[["70", "Университета"], ["20+", "Държави"], ["15", "Стипендии"], ["AI", "Matching"]].map(([n, l]) =>
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 700, color: "#CCFF00" }}>{n}</div>
                  <div style={{ fontSize: 12, color: "#71717A", marginTop: 2 }}>{l}</div>
                </div>)}
            </div>
          </div>

          {/* Bento Grid */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(${isMobile ? 150 : 220}px,1fr))`, gap: isMobile ? 8 : 12, marginBottom: 40 }}>
            {[
              { i: "🤖", t: "AI Съветник", d: "Питай Claude за университети, стипендии, програми.", click: () => setChat(true), accent: true },
              { i: "🧬", t: "RIASEC Тест", d: "18 въпроса → Holland Code + Архетип.", click: () => nv("test") },
              { i: "🗺️", t: "Карта на Европа", d: "Интерактивна карта с всички университети.", click: () => nv("browse") },
              { i: "🌍", t: "Гайдове", d: "15 държави — виза, жилище, работа.", click: () => nv("guides") },
              { i: "🎯", t: "Стипендии", d: "Erasmus+, DAAD, Chevening и други.", click: () => nv("scholarships") },
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
                {getR().fields.map((f, i) => <span key={i} style={{ padding: "6px 16px", borderRadius: 100, fontSize: 13, fontWeight: 500, background: "rgba(204,255,0,0.1)", color: "#CCFF00", border: "1px solid rgba(204,255,0,0.2)" }}>{fieldEmoji[f] || "📌"} {f}</span>)}
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
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 3},1fr)`, gap: 8, marginBottom: 16 }}>
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
            {tab === "cost" && <Card>
              {[["🏠 Наем:", `€${Math.round(sl.costOfLiving * 0.55)}/мес`], ["🍕 Храна:", `€${Math.round(sl.costOfLiving * 0.25)}/мес`], ["🚌 Транспорт:", `€${Math.round(sl.costOfLiving * 0.1)}/мес`], ["📱 Други:", `€${Math.round(sl.costOfLiving * 0.1)}/мес`], ["📊 Общо:", `≈ €${sl.costOfLiving}/мес`]].map(([l, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none", fontSize: 14 }}>
                <span style={{ color: "#71717A" }}>{l}</span><span style={{ fontWeight: i === 4 ? 700 : 500, color: i === 4 ? "#CCFF00" : "#fff" }}>{v}</span>
              </div>)}
            </Card>}
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              <Btn primary onClick={() => { user.addApplication({ uniId: sl.id, uni: sl.nameEn, country: sl.country, program: sl.programs[0] || 'General', emoji: sl.emoji }); nv("tracker"); }}>📤 Кандидатствай</Btn>
              <Btn accent onClick={() => tc(sl.id)} sm>{cm.includes(sl.id) ? "✓ В сравнението" : "📊 Сравни"}</Btn>
              <Btn ghost onClick={() => tf(sl.id)} sm>{fav.includes(sl.id) ? "❤️ В любими" : "🤍 Запази"}</Btn>
            </div>
          </div>
          : <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: isMobile ? 22 : 28, fontWeight: 700 }}>Университети</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn ghost sm onClick={() => setMap(!mapMode)} style={{ color: mapMode ? "#CCFF00" : undefined }}>🗺️ Карта</Btn>
                {fav.length > 0 && <Btn ghost sm>❤️ {fav.length}</Btn>}
              </div>
            </div>
            <p style={{ color: "#71717A", fontSize: 14, marginBottom: 16 }}>{ls.length} резултата</p>
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

        {pg === "scholarships" && <div style={{ padding: "32px 0" }}><ScholarshipFinder /></div>}
        {pg === "guides" && <CountryGuidesPage onBrowseUni={(u) => { sL(u); nv("browse"); sTab("info"); }} />}
        {pg === "tracker" && <ApplicationTracker />}
        {pg === "reviews" && <div style={{ padding: "32px 0" }}><StudentReviews /></div>}
        {pg === "peers" && <PeerChat />}
        {pg === "b2b" && <B2BPage />}

        {/* COMPARE */}
        {pg === "compare" && <div style={{ padding: "32px 0" }} className="page-enter">
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Сравнение</h2>
          {cm.length === 0 ? <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ fontSize: 48, marginBottom: 10 }}>📊</div><p style={{ color: "#71717A", fontSize: 14 }}>Избери до 4 университета</p><Btn primary onClick={() => nv("browse")} style={{ marginTop: 14 }}>Университети →</Btn></div>
            : <Card style={{ overflowX: "auto", padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}><th style={{ padding: 12, textAlign: "left", fontWeight: 600, color: "#71717A", fontSize: 11, background: "#161618", minWidth: 100 }}></th>
                  {cm.map(id => { const u = universities.find(x => x.id === id); return u ? <th key={id} style={{ padding: 12, textAlign: "center", minWidth: 140 }}>
                    <div style={{ fontSize: 22 }}>{u.emoji}</div><div style={{ fontWeight: 600, fontSize: 12, color: "#fff", marginTop: 4 }}>{u.nameEn}</div>
                    <div onClick={() => user.toggleCompare(id)} style={{ fontSize: 10, color: "#71717A", cursor: "pointer", marginTop: 4 }}>✕ Премахни</div>
                  </th> : null })}</tr></thead>
                <tbody>{[["Място", u => `${u.city}, ${u.country}`], ["Ранг", u => `#${u.rank}`], ["Рейтинг", u => `⭐${u.rating}`], ["Такса", u => u.tuition[0] === 0 && u.tuition[1] === 0 ? "Безпл.!" : `€${u.tuition[0]}–${u.tuition[1]}`], ["Студенти", u => u.students.toLocaleString()], ["Осн.", u => u.founded], ["Приемане", u => `${u.acceptance}%`], ["Заетост", u => `${u.employability}%`], ["€/мес", u => `€${u.costOfLiving}`], ["Тип", u => u.type === "public" ? "Държавен" : "Частен"], ["Стипендии", u => u.scholarships ? "✅" : "❌"], ["Езици", u => u.languages.join(", ")], ["Програми", u => u.programs.slice(0, 4).join(", ")]].map(([l, fn], i) => <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "#71717A", fontSize: 11, background: "rgba(255,255,255,0.02)" }}>{l}</td>
                  {cm.map(id => { const u = universities.find(x => x.id === id); return u ? <td key={id} style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#A1A1AA" }}>{fn(u)}</td> : null })}
                </tr>)}</tbody></table>
            </Card>}
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
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 14, marginBottom: 28 }}>
                <Card><div style={{ fontSize: 13, fontWeight: 600, color: "#71717A", marginBottom: 8 }}>🧬 RIASEC Профил</div><RadarChart data={getR().dims.map(([k, v]) => ({ label: k, value: v }))} /></Card>
                <Card><div style={{ fontSize: 13, fontWeight: 600, color: "#71717A", marginBottom: 14 }}>📊 Резултати</div>
                  {getR().dims.map(([k, v], i) => <AnimBar key={k} value={v} max={Math.max(...getR().dims.map(d => d[1]))} color={cls[i]} label={`${dimEmoji[k]} ${RIASEC_MAP[k].name}`} />)}</Card>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: isMobile ? 6 : 10, marginBottom: 24 }}>
                {[[gU().length, "Препоръчани", "🎯", "#CCFF00"], [cm.length, "Сравнение", "📊", "#5D5FEF"], [fav.length, "Любими", "❤️", "#EF4444"], [new Set(gU().map(u => u.country)).size, "Държави", "🌍", "#22C55E"]].map(([v, l, icon, cl], i) =>
                  <Card key={i} style={{ textAlign: "center", padding: isMobile ? 10 : 16 }}>
                    <div style={{ fontSize: isMobile ? 16 : 18 }}>{icon}</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: isMobile ? 22 : 28, fontWeight: 700, color: cl, marginTop: 4 }}>{v}</div>
                    <div style={{ fontSize: isMobile ? 9 : 11, color: "#71717A", marginTop: 2 }}>{l}</div>
                  </Card>)}
              </div>
              {(() => { const arch = getArchetype(getR().top3.slice(0, 2)); return (
                <Card style={{ marginBottom: 20, background: "rgba(204,255,0,0.04)", border: "1px solid rgba(204,255,0,0.12)", display: "flex", gap: 14, alignItems: isMobile ? "flex-start" : "center", padding: "16px 20px", flexWrap: "nowrap" }}>
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
      {cm.length > 0 && pg !== "compare" && <div style={{ position: "fixed", bottom: isMobile ? 74 : 16, left: "50%", transform: "translateX(-50%)", background: "#161618", color: "white", padding: "10px 24px", borderRadius: 100, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 120, border: "1px solid rgba(255,255,255,0.1)" }}>
        <span style={{ background: "#5D5FEF", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{cm.length}</span>
        <span style={{ fontSize: 12, color: "#A1A1AA" }}>за сравнение</span>
        <Btn primary sm onClick={() => nv("compare")}>Сравни →</Btn>
      </div>}

      {!chat && <div onClick={() => setChat(true)} style={{ position: "fixed", bottom: isMobile ? (cm.length > 0 ? 130 : 74) : (cm.length > 0 ? 70 : 18), right: 18, width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#5D5FEF,#818CF8)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 20px rgba(93,95,239,0.4)", zIndex: 119, animation: "pulse 2s ease-in-out infinite", fontSize: 22 }}>🤖</div>}

      <AIChatbot
        isOpen={chat}
        onClose={() => setChat(false)}
        currentPage={pg}
        selectedUni={sl}
        activeFilters={ft}
        testResults={dn ? { code: getR().code, fields: getR().fields } : null}
      />

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px", textAlign: "center", color: "#71717A", fontSize: 11 }}>
        🎓 FindTheUni v7 © 2026 · <span style={{ color: "#CCFF00" }}>Glass & Neon Grid</span> · AI Matching
        {!profile.onboarded && <span style={{ marginLeft: 10 }}><button onClick={() => setShowOnboarding(true)} style={{ fontSize: 11, color: '#CCFF00', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Настрой профила →</button></span>}
      </div>
    </div>
  );
}
