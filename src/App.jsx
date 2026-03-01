import React, { useState, useMemo } from 'react';
import { universities, allFields, allCountries, fieldEmoji } from './data/universities';
import { questions, RIASEC_MAP, dimEmoji } from './data/testData';
import { Btn, Card, RadarChart, AnimBar } from './components/UI';
import AIChatbot from './components/AIChatbot';
import EuropeMap from './components/EuropeMap';
import ScholarshipFinder from './components/ScholarshipFinder';
import CountryGuidesPage from './components/CountryGuides';
import ApplicationTracker from './components/ApplicationTracker';

const cls = ["#2563EB", "#7C3AED", "#059669", "#EA580C", "#E11D48", "#0891B2"];

export default function App() {
  const [pg, sP] = useState("home");
  const [sr, sR] = useState("");
  const [ft, sF] = useState({ c: "", f: "", s: "ranking", type: "", free: false });
  const [sf, sSf] = useState(false);
  const [cm, sC] = useState([]);
  const [sl, sL] = useState(null);
  const [st, sSt] = useState(0);
  const [ans, sA] = useState({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [dn, sD] = useState(false);
  const [cp, sCp] = useState(1);
  const [fav, sFav] = useState([]);
  const [tab, sTab] = useState("info");
  const [chat, setChat] = useState(false);
  const [mapMode, setMap] = useState(false);

  const ls = useMemo(() => {
    let l = [...universities];
    if (sr) { const s = sr.toLowerCase(); l = l.filter(u => u.name.toLowerCase().includes(s) || u.nameEn.toLowerCase().includes(s) || u.city.toLowerCase().includes(s) || u.country.toLowerCase().includes(s) || u.programs.some(p => p.toLowerCase().includes(s))); }
    if (ft.c) l = l.filter(u => u.country === ft.c);
    if (ft.f) l = l.filter(u => u.fields.includes(ft.f));
    if (ft.type) l = l.filter(u => u.type === ft.type);
    if (ft.free) l = l.filter(u => u.tuition[0] === 0);
    if (ft.s === "ranking") l.sort((a, b) => a.rank - b.rank);
    else if (ft.s === "rating") l.sort((a, b) => b.rating - a.rating);
    else if (ft.s === "tuition") l.sort((a, b) => a.tuition[0] - b.tuition[0]);
    else if (ft.s === "emp") l.sort((a, b) => b.employability - a.employability);
    else if (ft.s === "col") l.sort((a, b) => a.costOfLiving - b.costOfLiving);
    return l;
  }, [sr, ft]);

  const tp = Math.ceil(ls.length / 10);
  const sh = ls.slice((cp - 1) * 10, cp * 10);
  const tc = id => sC(p => p.includes(id) ? p.filter(x => x !== id) : p.length < 4 ? [...p, id] : p);
  const tf = id => sFav(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

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
    sA(p => ({ ...p, [dim]: p[dim] + val }));
    if (st < questions.length - 1) sSt(st + 1); else sD(true);
  };

  const nv = p => { sP(p); sL(null); sTab("info"); };

  const UniRow = ({ u }) => (
    <Card style={{ padding: "14px 16px", marginBottom: 8, cursor: "pointer", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center" }}
      onClick={() => { sL(u); if (pg !== "browse") nv("browse"); sTab("info"); }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: "#F5F5F4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{u.emoji}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
        <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#78716C", flexWrap: "wrap" }}>
          <span>📍{u.city}, {u.country}</span><span>🏆#{u.rank}</span>
          <span>💰{u.tuition[0] === 0 && u.tuition[1] === 0 ? "Безпл." : `€${u.tuition[0]}–${u.tuition[1]}`}</span>
          {u.employability && <span>👔{u.employability}%</span>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#EA580C" }}>⭐{u.rating}</span>
        <div onClick={e => { e.stopPropagation(); tf(u.id) }} style={{ fontSize: 16, cursor: "pointer" }}>{fav.includes(u.id) ? "❤️" : "🤍"}</div>
        <div onClick={e => { e.stopPropagation(); tc(u.id) }} style={{ width: 20, height: 20, border: cm.includes(u.id) ? "none" : "2px solid #D6D3D1", borderRadius: 5, background: cm.includes(u.id) ? "#2563EB" : "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{cm.includes(u.id) ? "✓" : ""}</div>
      </div>
    </Card>
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,250,249,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid #E7E5E4", padding: "0 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div onClick={() => nv("home")} style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>📖 <span className="grad-text">Read More</span></div>
          <div style={{ display: "flex", gap: 2 }}>
            {[["home", "🏠"], ["test", "🧠"], ["browse", "🎓"], ["guides", "🌍"], ["scholarships", "🎯"], ["tracker", "📝"], ["compare", "📊"], ["dash", "📋"]].map(([k, icon]) =>
              <button key={k} onClick={() => nv(k)} style={{ padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: pg === k ? 600 : 500, color: pg === k ? "#2563EB" : "#78716C", background: pg === k ? "#EFF6FF" : "transparent", border: "none" }}>{icon}</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", paddingBottom: 80 }}>

        {/* ═══ HOME ═══ */}
        {pg === "home" && <div className="page-enter">
          <div style={{ textAlign: "center", padding: "56px 0 40px" }}>
            <div style={{ display: "inline-flex", padding: "4px 12px", background: "#EFF6FF", color: "#2563EB", borderRadius: 14, fontSize: 11, fontWeight: 600, marginBottom: 16 }}>✨ v4 — Country Guides + Destination Quiz + Application Tracker</div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 12 }}>Открий <span className="grad-text">перфектния университет</span></h1>
            <p style={{ fontSize: 15, color: "#78716C", maxWidth: 480, margin: "0 auto 22px", lineHeight: 1.6 }}>70 университета от 20+ държави. RIASEC AI тест. Стипендии. Интерактивна карта. AI съветник.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn primary onClick={() => nv("test")}>🧠 RIASEC тест</Btn>
              <Btn onClick={() => nv("browse")}>🎓 Университети</Btn>
              <Btn accent onClick={() => setChat(true)}>🤖 AI Съветник</Btn>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 36, flexWrap: "wrap" }}>
              {[["70", "Университета"], ["15", "Държави гайдове"], ["15", "Стипендии"], ["📝", "Tracker"]].map(([n, l]) => <div key={l}><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700 }}>{n}</div><div style={{ fontSize: 11, color: "#A8A29E" }}>{l}</div></div>)}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginBottom: 32 }}>
            {[
              { i: "🤖", bg: "#EFF6FF", t: "AI Съветник", d: "Питай за университети, стипендии, програми на български.", click: () => setChat(true) },
              { i: "🧬", bg: "#F5F3FF", t: "RIASEC тест", d: "18 въпроса, Holland Code, radar chart, AI препоръки.", click: () => nv("test") },
              { i: "🗺️", bg: "#ECFDF5", t: "Карта на Европа", d: "Интерактивна карта с всички 70 университета.", click: () => nv("browse") },
              { i: "🌍", bg: "#F0FDF9", t: "Гайдове по държави", d: "15 държави — виза, жилище, работа, култура. + Destination Quiz!", click: () => nv("guides") },
              { i: "🎯", bg: "#FFF7ED", t: "Стипендии", d: "15 стипендии — Erasmus+, DAAD, Chevening и други.", click: () => nv("scholarships") },
              { i: "📝", bg: "#FFFBEB", t: "Application Tracker", d: "Следи кандидатури, дедлайни, документи. Календар.", click: () => nv("tracker") },
              { i: "📊", bg: "#FFF1F2", t: "Сравнение", d: "Side-by-side по 15 критерия. До 4 университета.", click: () => nv("compare") },
              { i: "📋", bg: "#ECFEFF", t: "Табло", d: "Radar chart, препоръки, любими — всичко на едно място.", click: () => nv("dash") },
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

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
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
                  <option value="ranking">Класиране</option><option value="rating">Рейтинг</option><option value="tuition">Такса ↑</option><option value="emp">Заетост ↓</option><option value="col">Разходи ↑</option></select></div>
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

              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, marginBottom: 10 }}>🏆 Топ препоръки</h3>
              {gU().slice(0, 5).map(u => <UniRow key={u.id} u={u} />)}
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

      <AIChatbot
        isOpen={chat}
        onClose={() => setChat(false)}
        currentPage={pg}
        selectedUni={sl}
        activeFilters={ft}
        testResults={dn ? { code: getR().code, fields: getR().fields } : null}
      />

      <div style={{ borderTop: "1px solid #E7E5E4", padding: "20px", textAlign: "center", color: "#A8A29E", fontSize: 10 }}>
        📖 Find The Uni v4 © 2026 · Country Guides + Tracker + AI + RIASEC
      </div>
    </div>
  );
}
