import React, { useState, useRef, useEffect } from 'react';
import { chatPatterns } from '../data/chatData';
import { universities, fieldEmoji } from '../data/universities';

const tuitionStr = u => u.tuition[0] === 0 && u.tuition[1] === 0 ? '🎉 Безплатно' : `€${u.tuition[0]}–${u.tuition[1]}/год`;

// Short entrance requirement per country (used in context-based exam replies)
const countryExamShort = {
  'UK':          'A-Levels (BBB–A*AA) + Personal Statement + IELTS 6.5',
  'Германия':    'Abitur/Matura (~2.5) + DSH/TestDaF | Медицина: TMS тест',
  'Австрия':     'Matura + IELTS/DSH | Медицина: MedAT тест',
  'Швейцария':   'Matura + вход. изпит на ETH/EPFL за чужденци + IELTS C1',
  'Франция':     'Baccalauréat | Grandes Écoles: конкурс след 2г. подготовка',
  'Нидерландия': 'VWO диплома + IELTS 6.5 (повечето програми на английски)',
  'Швеция':      'Гимназиална диплома + мотивационно (без изпит!) + IELTS 6.5',
  'Дания':       'Гимназия + IELTS 6.5 (без входящ изпит)',
  'Норвегия':    'Гимназия (без изпит и без такси!) + IELTS 6.0',
  'Финландия':   'Гимназия + входен тест по специалността + IELTS 6.5',
  'Белгия':      'Гимназиална диплома + специф. изпит + IELTS',
  'Чехия':       'Гимназия + вътрешен изпит по предметите | на чешки = безплатно',
  'Полша':       'Гимназия + Matura / вътрешен тест + IELTS 5.5',
  'Испания':     'Bachillerato + EvAU (бивш Selectividad) + IELTS 6.0',
  'Италия':      'Maturità + IELTS C1 | Медицина: IMAT тест на английски',
  'Ирландия':    'Leaving Certificate (350–500т.) + IELTS 6.5',
  'Португалия':  'Ensino Secundário + национален изпит + IELTS 6.0',
  'Гърция':      'Απολυτήριο + Панелини (национален изпит)',
  'Румъния':     'Bacalaureat + вход. изпит на университета',
  'Хърватия':    'Matura + državna matura + IELTS',
  'Сърбия':      'Гимназия + приемен изпит по предметите',
  'Унгария':     'Érettségi + IELTS 5.5 (много програми на английски)',
  'България':    'ДЗИ + вход. изпит (зависи от специалността)',
};

// ECTS & curriculum info per field
const fieldCurriculum = {
  'Медицина':        '6 год. · 360 ECTS · ~35 дисциплини + 5 000+ часа клинична практика',
  'Право':           '4–5 год. · 240–300 ECTS · ~30 дисциплини + стаж в съд/кантора',
  'Инженерство':     '3–4 год. · 180–240 ECTS · ~40 дисциплини + производствена практика',
  'IT':              '3 год. · 180 ECTS · ~30 дисциплини (алгоритми, AI, бази, мрежи) + стаж',
  'Архитектура':     '5 год. · 300 ECTS · ~45 дисциплини + архитект. проекти + портфолио',
  'Бизнес':          '3–4 год. · 180–240 ECTS · ~25 дисциплини + стажуване',
  'Фармация':        '5 год. · 300 ECTS · ~40 дисциплини + аптечна практика',
  'Природни науки':  '3–4 год. · 180–240 ECTS · ~35 дисциплини + лабораторна работа',
  'Хуманитарни':     '3–4 год. · 180 ECTS · ~28 дисциплини + изследване + теза',
  'Финанси':         '3–4 год. · 180–240 ECTS · ~25 дисциплини + стаж',
  'Икономика':       '3–4 год. · 180–240 ECTS · ~28 дисциплини + стаж',
  'Дизайн':          '3–4 год. · 180–240 ECTS · ~30 дисциплини + проектно портфолио',
  'Изкуства':        '3–4 год. · 180 ECTS · ~25 дисциплини + творческо портфолио',
  'Маркетинг':       '3 год. · 180 ECTS · ~24 дисциплини + стаж в агенция/компания',
  'Педагогика':      '4 год. · 240 ECTS · ~32 дисциплини + учителска практика (300+ часа)',
  'Електроника':     '4 год. · 240 ECTS · ~38 дисциплини + лабораторна + проектна работа',
};

// Application deadlines per country
const countryDeadlines = {
  'UK':          '📅 UCAS: **15 окт** (Oxford/Cambridge) · **15 яну** (повечето) · **30 юни** (свободни места)\n   🌐 ucas.com',
  'Германия':    '📅 Зимен сем. (окт): **1–15 юли** · Летен сем. (апр): **1–15 дек**\n   🌐 uni-assist.de / директно в университета',
  'Австрия':     '📅 Зимен сем.: **до 5 септември** · Летен сем.: **до 5 февруари**\n   🌐 direktno в университета',
  'Швейцария':   '📅 ETH/EPFL: **30 април** (изпит юни/юли) · Останали: **30 юли**\n   🌐 ethadmissions.ethz.ch',
  'Франция':     '📅 Campus France: **януари–март** · Grandes Écoles: **февруари–юни** (конкурс)\n   🌐 campusfrance.org',
  'Нидерландия': '📅 EU: **1 май** · Non-EU: **1 апр** · Избрани програми: **15 яну**\n   🌐 studielink.nl',
  'Швеция':      '📅 **15 януари** (есенен семестър, чрез universityadmissions.se)\n   🌐 universityadmissions.se',
  'Дания':       '📅 EU: **15 март** · Non-EU: **1 март**\n   🌐 optagelse.dk',
  'Норвегия':    '📅 **15 април** (чрез samordnaopptak.no) · Резултати: юли\n   🌐 samordnaopptak.no',
  'Финландия':   '📅 **20 януари** за повечето програми\n   🌐 studyinfo.fi',
  'Белгия':      '📅 **1 март – 1 юни** в зависимост от университета',
  'Чехия':       '📅 **ноември – февруари** за следващата академична година',
  'Полша':       '📅 **май – юли** · Резултати: юли–август',
  'Испания':     '📅 **юни – юли** (след EvAU) · Запис: юли–септември',
  'Италия':      '📅 **април – юли** (varies) · Медицина IMAT: **август–септември**',
  'Ирландия':    '📅 CAO: **1 февруари** (нормален) · **1 юли** (с допълнителна такса)\n   🌐 cao.ie',
  'Португалия':  '📅 Национална кампания: **март – юни** · Резултати: юли',
  'Гърция':      '📅 Панелини: **юни** · Записване: **август–септември**',
  'Румъния':     '📅 **юли – август** след Bacalaureat · Частни: по-гъвкаво',
  'Хърватия':    '📅 **юни – юли** след državna matura',
  'Сърбия':      '📅 **юни – юли** · Приемен изпит: юли',
  'Унгария':     '📅 **15 февруари** (чрез felvi.hu) · Резултати: юли',
  'България':    '📅 **юли** (след ДЗИ) · Класиране: юли–август',
};

// Trigram similarity for fuzzy matching Bulgarian text (handles typos)
function trigramSim(a, b) {
  const tgs = s => {
    const set = new Set();
    for (let i = 0; i <= s.length - 3; i++) set.add(s.slice(i, i + 3));
    return set;
  };
  const ta = tgs(a), tb = tgs(b);
  let common = 0;
  ta.forEach(t => { if (tb.has(t)) common++; });
  return (ta.size + tb.size) === 0 ? 0 : (2 * common) / (ta.size + tb.size);
}

function fuzzyFieldMatch(text) {
  // Exact match first
  const exact = Object.keys(fieldEmoji).find(f => text.includes(f.toLowerCase()));
  if (exact) return exact;
  // Fuzzy: check each word against each field name (handles typos like "архотектура")
  const words = text.split(/[\s,]+/).filter(w => w.length >= 4);
  let bestField = null, bestScore = 0.45; // minimum similarity threshold
  for (const word of words) {
    for (const f of Object.keys(fieldEmoji)) {
      const sim = trigramSim(word, f.toLowerCase());
      if (sim > bestScore) { bestScore = sim; bestField = f; }
    }
  }
  return bestField;
}

function getReply(msg, history = []) {
  const lower = msg.toLowerCase();
  const lastAiMsg = [...history].reverse().find(m => m.from === 'ai')?.text || '';

  // Only use context if last AI message contains real university data (not welcome/generic messages)
  const hasRealContext = lastAiMsg.includes('€') || lastAiMsg.includes('#') || lastAiMsg.includes('/мес');
  const contextUnis = hasRealContext
    ? universities.filter(u => lastAiMsg.includes(u.nameEn) || lastAiMsg.includes(u.name))
    : [];
  const contextField = hasRealContext
    ? Object.keys(fieldEmoji).find(f => lastAiMsg.includes(f))
    : null;

  // Intent detection
  const isPriceQ = ['цена', 'цени', 'такса', 'такси', 'колко струва', 'колко коства', 'колко са', 'цените'].some(w => lower.includes(w));
  const isCostQ = ['издръжка', 'издръжката', 'разходи', 'живот', 'наем', 'скъпо', 'евтино', 'стойността'].some(w => lower.includes(w));
  const isShowMore = ['дай ми', 'покажи', 'повече', 'конкретно', 'поне', 'още', 'пълен', 'всички', 'списък'].some(w => lower.includes(w));
  const isExamQ = ['изпит', 'приемен', 'кандидатствам', 'кандидатстване', 'документи', 'изисквания', 'входящ', 'конкурс', 'прием за'].some(w => lower.includes(w));
  const isHoursQ = ['хорариум', 'кредити', 'ects', 'учебен план', 'дисциплини', 'семестри', 'учебна програма', 'часове', 'натоварване'].some(w => lower.includes(w));
  const isDeadlineQ = ['кога', 'дата', 'дедлайн', 'срок', 'до кога', 'период за кандидатстване', 'краен срок', 'прием кога', 'кандидатства кога'].some(w => lower.includes(w));

  // Context-based replies (only when previous answer had real data)
  if (isCostQ && contextUnis.length > 0) {
    const list = contextUnis.map(u =>
      `${u.emoji} **${u.nameEn}** (${u.city}) — 🏙️ €${u.costOfLiving}/мес · 💰 ${tuitionStr(u)}`
    ).join('\n');
    return `Разходи за живот (споменати университети):\n\n${list}\n\n💡 Включва наем, храна и транспорт.`;
  }

  if (isCostQ && contextField) {
    const unis = universities.filter(u => u.fields.includes(contextField)).sort((a, b) => a.costOfLiving - b.costOfLiving);
    const list = unis.slice(0, 8).map(u =>
      `${u.emoji} **${u.nameEn}** (${u.city}) — 🏙️ €${u.costOfLiving}/мес`
    ).join('\n');
    return `Разходи за живот при **${contextField}** (най-евтини първи):\n\n${list}`;
  }

  if (isPriceQ && contextUnis.length > 0) {
    const list = contextUnis.map(u =>
      `${u.emoji} **${u.nameEn}** (${u.country}) — ${tuitionStr(u)} · 🏙️ €${u.costOfLiving}/мес`
    ).join('\n');
    return `Цени за споменатите университети:\n\n${list}\n\n💡 Таксите са за EU граждани. За non-EU може да са 2–3x по-високи.`;
  }

  if (isPriceQ && contextField) {
    const unis = universities.filter(u => u.fields.includes(contextField)).sort((a, b) => a.rank - b.rank);
    const list = unis.slice(0, 10).map(u =>
      `${u.emoji} **${u.nameEn}** (${u.country}) — ${tuitionStr(u)} · 🏙️ €${u.costOfLiving}/мес`
    ).join('\n');
    return `Цени за **${contextField}** университети:\n\n${list}\n\n💡 Таксите са за EU граждани.`;
  }

  if (isShowMore && contextField) {
    const unis = universities.filter(u => u.fields.includes(contextField)).sort((a, b) => a.rank - b.rank);
    const list = unis.map(u =>
      `${u.emoji} **${u.nameEn}** (${u.city}, ${u.country}) — #${u.rank} | ${tuitionStr(u)}`
    ).join('\n');
    return `Всички университети за **${contextField}** (${unis.length}):\n\n${list}`;
  }

  // Application deadlines — context-based (priority over exam handler)
  if (isDeadlineQ && contextUnis.length > 0) {
    const list = contextUnis.slice(0, 8).map(u => {
      const dl = countryDeadlines[u.country] || '📅 Провери сайта на университета';
      return `${u.emoji} **${u.nameEn}** (${u.country})\n   ${dl}`;
    }).join('\n');
    return `Срокове за кандидатстване (споменати университети):\n\n${list}`;
  }
  if (isDeadlineQ && contextField) {
    const unis = universities.filter(u => u.fields.includes(contextField)).sort((a, b) => a.rank - b.rank);
    const byCountry = {};
    unis.forEach(u => { if (!byCountry[u.country]) byCountry[u.country] = []; byCountry[u.country].push(u); });
    const list = Object.entries(byCountry).slice(0, 8).map(([country, us]) => {
      const dl = countryDeadlines[country] || '📅 Провери сайта на университета';
      const names = us.map(u => `${u.emoji} ${u.nameEn}`).join(', ');
      return `**${country}** (${names})\n   ${dl}`;
    }).join('\n');
    return `Срокове за кандидатстване — **${contextField}**:\n\n${list}`;
  }

  // Exam requirements — context-based
  if (isExamQ && contextUnis.length > 0) {
    const list = contextUnis.slice(0, 8).map(u => {
      const req = countryExamShort[u.country] || 'Завършена гимназия + IELTS/TOEFL';
      return `${u.emoji} **${u.nameEn}** (${u.country}) — прием: ${u.acceptance}%\n   📋 ${req}`;
    }).join('\n');
    return `Приемни изисквания за споменатите университети:\n\n${list}\n\n💡 Питай "изпити за [страна]" за пълни детайли.`;
  }
  if (isExamQ && contextField) {
    const unis = universities.filter(u => u.fields.includes(contextField)).sort((a, b) => a.rank - b.rank);
    const list = unis.slice(0, 6).map(u => {
      const req = countryExamShort[u.country] || 'Гимназия + IELTS';
      return `${u.emoji} **${u.nameEn}** (${u.country}) — прием: ${u.acceptance}%\n   📋 ${req}`;
    }).join('\n');
    return `Приемни изисквания за **${contextField}** университети:\n\n${list}`;
  }

  // Curriculum / ECTS hours — context-based
  if (isHoursQ && contextField) {
    const info = fieldCurriculum[contextField] || '3–4 год. · 180–240 ECTS · ~30 дисциплини';
    return `Учебен план за **${contextField}**:\n📚 ${info}\n\n📊 1 ECTS ≈ 25–30 часа (лекции + самостоятелна работа)\n⏱️ 30 ECTS/семестър ≈ 750–900 часа учебна натовареност`;
  }
  if (isHoursQ && contextUnis.length > 0) {
    const list = contextUnis.slice(0, 6).map(u => {
      const mainField = u.fields[0];
      const info = fieldCurriculum[mainField] || '3–4 год. · 180–240 ECTS';
      return `${u.emoji} **${u.nameEn}** — ${info}`;
    }).join('\n');
    return `Учебен план (споменати университети):\n\n${list}\n\n📊 1 ECTS ≈ 25–30 часа · Питай за конкретна специалност за детайли.`;
  }

  // Keyword patterns
  for (const p of chatPatterns) {
    if (p.patterns.some(pat => lower.includes(pat.toLowerCase()))) return p.answer;
  }

  // Specific university name
  const uni = universities.find(u =>
    lower.includes(u.name.toLowerCase()) || lower.includes(u.nameEn.toLowerCase())
  );
  if (uni) {
    return `**${uni.name}** (${uni.nameEn})\n📍 ${uni.city}, ${uni.country} · 🏆 #${uni.rank}\n⭐ ${uni.rating}/5 · 💰 ${tuitionStr(uni)}\n🏙️ Живот: ~€${uni.costOfLiving}/мес · 👔 ${uni.employability}% заетост\n👥 ${uni.students.toLocaleString()} студенти · 📅 от ${uni.founded}\n📚 ${uni.programs.join(', ')}\n🌐 ${uni.languages.join(', ')} · ${uni.type === 'public' ? '🏛️ Държавен' : '🏢 Частен'}`;
  }

  // Country
  const countryMatch = universities.filter(u => lower.includes(u.country.toLowerCase()));
  if (countryMatch.length > 0) {
    const country = countryMatch[0].country;
    const unis = universities.filter(u => u.country === country).sort((a, b) => a.rank - b.rank);
    return `Университети в **${country}** (${unis.length}):\n${unis.slice(0, 6).map(u => `${u.emoji} **${u.nameEn}** — #${u.rank} | ${tuitionStr(u)}`).join('\n')}${unis.length > 6 ? `\n...и още ${unis.length - 6}. Виж всички в браузъра!` : ''}`;
  }

  // Field — with fuzzy matching to handle typos (e.g. "архотектура" → "Архитектура")
  const fieldMatch = fuzzyFieldMatch(lower);
  if (fieldMatch) {
    const unis = universities.filter(u => u.fields.includes(fieldMatch)).sort((a, b) => a.rank - b.rank);
    return `Топ университети за **${fieldMatch}** (${unis.length} общо):\n${unis.slice(0, 6).map(u => `${u.emoji} **${u.nameEn}** (${u.city}) — #${u.rank} | ${tuitionStr(u)}`).join('\n')}\n\nПитай "цените в тези университети" за пълния списък с такси.`;
  }

  return "Мога да помогна с:\n🎓 Университет — напр. \"Oxford\", \"ETH Zurich\"\n🌍 Държава — напр. \"Германия\", \"Нидерландия\"\n📚 Специалност — напр. \"IT\", \"Медицина\", \"Архитектура\"\n💰 \"Цените в тези университети\" след предишен отговор\n🎯 Стипендии, разходи, RIASEC тест";
}

function formatMsg(text) {
  return text.split('\n').map((line, i) => {
    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} style={{ marginBottom: 2 }} />;
  });
}

export default function AIChatbot({ isOpen, onClose }) {
  const [msgs, setMsgs] = useState([
    { from: 'ai', text: "Здравей! 👋 Аз съм AI съветникът на Read More. Питай ме за университети, стипендии, програми или страни. Как мога да помогна?" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const send = (overrideMsg) => {
    const userMsg = (overrideMsg || input).trim();
    if (!userMsg) return;
    setInput('');
    setMsgs(prev => {
      const next = [...prev, { from: 'user', text: userMsg }];
      setTyping(true);
      setTimeout(() => {
        const reply = getReply(userMsg, next);
        setMsgs(p => [...p, { from: 'ai', text: reply }]);
        setTyping(false);
      }, 600 + Math.random() * 400);
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, width: 360, maxHeight: '70vh', background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200, display: 'flex', flexDirection: 'column', animation: 'scaleIn .3s ease-out', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <div><div style={{ fontSize: 14, fontWeight: 600 }}>AI Съветник</div>
          <div style={{ fontSize: 10, opacity: 0.8 }}>Read More Assistant</div></div>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: '4px 8px', color: 'white', fontSize: 14 }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', minHeight: 200, maxHeight: 'calc(70vh - 120px)' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            <div style={{
              maxWidth: '85%', padding: '10px 14px', borderRadius: 14,
              background: m.from === 'user' ? '#2563EB' : '#F5F5F4',
              color: m.from === 'user' ? 'white' : '#1C1917',
              fontSize: 12, lineHeight: 1.5,
              borderBottomRightRadius: m.from === 'user' ? 4 : 14,
              borderBottomLeftRadius: m.from === 'ai' ? 4 : 14,
            }}>
              {formatMsg(m.text)}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: 4, padding: '8px 12px', background: '#F5F5F4', borderRadius: 14, width: 'fit-content', marginBottom: 10 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#A8A29E', animation: `float 1.2s ease-in-out ${i * 0.15}s infinite` }} />)}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick actions */}
      <div style={{ padding: '6px 14px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {['💰 Безплатно', '💻 IT', '🏥 Медицина', '🎓 Стипендии'].map(q => (
          <button key={q} onClick={() => send(q.slice(2).trim())} style={{ padding: '3px 8px', borderRadius: 8, fontSize: 10, border: '1px solid #E7E5E4', background: '#FAFAF9', color: '#78716C' }}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid #E7E5E4', display: 'flex', gap: 8 }}>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Попитай нещо..." style={{ flex: 1, padding: '8px 12px', border: '1px solid #E7E5E4', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
        <button onClick={send} style={{ padding: '8px 14px', borderRadius: 10, background: '#2563EB', color: 'white', border: 'none', fontSize: 13, fontWeight: 600 }}>→</button>
      </div>
    </div>
  );
}
