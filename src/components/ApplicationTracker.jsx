import React, { useState, useMemo } from 'react';
import { universities } from '../data/universities.js';
import { scholarships } from '../data/testData.js';
import { Btn, Card } from './UI.jsx';
import { useUser } from '../UserContext.jsx';

// ─── Predefined deadline data ─────────────────
const uniDeadlines = [
  { country: 'UK', label: 'UCAS дедлайн', date: '2026-01-15', note: 'За всички UK университети. Oxbridge: 15 октомври.' },
  { country: 'Германия', label: 'Зимен семестър', date: '2026-07-15', note: 'Повечето програми. Летен: 15 януари.' },
  { country: 'Нидерландия', label: 'Numerus fixus', date: '2026-01-15', note: 'Програми с лимит. Останали: 1 май.' },
  { country: 'Нидерландия', label: 'Общ дедлайн', date: '2026-05-01', note: 'Non-numerus fixus програми.' },
  { country: 'Швеция', label: 'Есенен прием', date: '2026-01-15', note: 'Universityadmissions.se' },
  { country: 'Дания', label: 'Kvote 1 & 2', date: '2026-03-15', note: 'Optagelse.dk' },
  { country: 'Норвегия', label: 'Общ дедлайн', date: '2026-04-15', note: 'Samordnaopptak.no' },
  { country: 'Швейцария', label: 'ETH/EPFL/UZH', date: '2026-04-30', note: 'Входен изпит за чужденци при нужда.' },
  { country: 'Франция', label: 'Campus France', date: '2026-03-15', note: 'DAP процедура: януари–март.' },
  { country: 'Ирландия', label: 'CAO дедлайн', date: '2026-02-01', note: 'Central Applications Office' },
  { country: 'Италия', label: 'Предварителна рег.', date: '2026-07-15', note: 'Universitaly портал. Варира.' },
  { country: 'Испания', label: 'Preinscripción', date: '2026-06-15', note: 'След credential evaluation.' },
  { country: 'Полша', label: 'Рекрутация', date: '2026-07-01', note: 'Англ. програми може по-рано.' },
  { country: 'Чехия', label: 'Přihláška', date: '2026-04-30', note: 'Февруари–април. Англ. медицина по-рано.' },
  { country: 'Австрия', label: 'Uni Wien/TU Wien', date: '2026-09-05', note: '1 февруари–5 септември.' },
  { country: 'България', label: 'Кандидатстудентски', date: '2026-07-15', note: 'Юли–Септември, зависи от уни.' },
  { country: 'Финландия', label: 'Joint application', date: '2026-01-20', note: 'Studyinfo.fi' },
];

// ─── Status colors/labels ─────────────────────
const statusMap = {
  idea:     { label: '💡 Идея', color: '#71717A', bg: 'rgba(161,161,170,0.15)' },
  research: { label: '🔍 Проучване', color: '#5D5FEF', bg: 'rgba(93,95,239,0.15)' },
  docs:     { label: '📄 Документи', color: '#F59E0B', bg: 'rgba(234,88,12,0.15)' },
  applied:  { label: '📤 Кандидатствах', color: '#5D5FEF', bg: 'rgba(124,58,237,0.15)' },
  accepted: { label: '✅ Приет', color: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
  rejected: { label: '❌ Отказ', color: '#EF4444', bg: 'rgba(225,29,72,0.15)' },
};

const docChecklist = [
  { id: 'diploma', label: '📜 Диплома за средно образование', note: 'Заверено копие + превод' },
  { id: 'grades', label: '📊 Академична справка (транскрипт)', note: 'С оценки и часове' },
  { id: 'lang', label: '🗣️ Езиков сертификат', note: 'IELTS/TOEFL/TestDaF/DELF...' },
  { id: 'cv', label: '📋 CV / Резюме', note: 'Europass или свободен формат' },
  { id: 'motivation', label: '✍️ Мотивационно писмо', note: 'Personal Statement / Lettre de motivation' },
  { id: 'recommendation', label: '📩 Препоръки', note: '1–2 от учители/преподаватели' },
  { id: 'passport', label: '🛂 Паспорт / Лична карта', note: 'Копие на страницата с данни' },
  { id: 'photo', label: '📷 Снимка', note: 'Паспортен формат' },
  { id: 'portfolio', label: '🎨 Портфолио', note: 'За изкуства/архитектура/дизайн' },
  { id: 'finance', label: '💰 Финансови доказателства', note: 'Банково извлечение / спонсорско писмо' },
];

export default function ApplicationTracker() {
  const user = useUser();
  const apps = user.profile.applications;
  const docs = user.profile.docs;
  const [adding, setAdding] = useState(false);
  const [selUni, setSelUni] = useState('');
  const [selProg, setSelProg] = useState('');
  const [view, setView] = useState('tracker'); // tracker | calendar | checklist | roadmap
  const [expanded, setExpanded] = useState(null);

  // Add application — now persisted via UserContext
  const addApp = () => {
    if (!selUni) return;
    const uni = universities.find(u => u.id === parseInt(selUni));
    if (!uni) return;
    user.addApplication({
      uniId: uni.id, uni: uni.nameEn, country: uni.country,
      program: selProg || uni.programs[0] || 'General', emoji: uni.emoji,
      deadline: '', notes: ''
    });
    setSelUni(''); setSelProg(''); setAdding(false);
  };

  const updateApp = (id, field, value) => {
    user.updateApplication(id, { [field]: value });
  };

  const removeApp = (id) => user.removeApplication(id);

  const toggleDoc = (docId) => user.toggleDoc(docId);

  // Calendar: merge uni deadlines + scholarship deadlines + personal deadlines
  const calendarItems = useMemo(() => {
    const items = [];
    // Uni deadlines
    uniDeadlines.forEach(d => items.push({ ...d, type: 'deadline', icon: '🎓' }));
    // Scholarship deadlines
    scholarships.forEach(s => {
      const monthMap = { 'Януари': '01', 'Февруари': '02', 'Март': '03', 'Април': '04', 'Май': '05', 'Юни': '06', 'Юли': '07', 'Август': '08', 'Септември': '09', 'Октомври': '10', 'Ноември': '11', 'Декември': '12', 'Целогодишно': null, 'Юни/Ноември': '06' };
      const month = monthMap[s.deadline];
      if (month) items.push({ country: s.country, label: s.name, date: `2026-${month}-15`, note: `${s.amount} — ${s.desc.slice(0, 60)}`, type: 'scholarship', icon: '🎯' });
    });
    // Personal app deadlines
    apps.forEach(a => {
      if (a.deadline) items.push({ country: a.country, label: `${a.emoji} ${a.uni} — ${a.program}`, date: a.deadline, note: `Статус: ${statusMap[a.status].label}`, type: 'personal', icon: '📌' });
    });
    return items.sort((a, b) => a.date.localeCompare(b.date));
  }, [apps]);

  const months = useMemo(() => {
    const m = {};
    calendarItems.forEach(item => {
      const key = item.date.slice(0, 7); // YYYY-MM
      if (!m[key]) m[key] = [];
      m[key].push(item);
    });
    return Object.entries(m).sort((a, b) => a[0].localeCompare(b[0]));
  }, [calendarItems]);

  const monthNames = ['Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'];

  return (
    <div style={{ padding: '32px 0' }} className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 600, color: '#FFFFFF' }}>📝 Application Tracker</h2>
          <p style={{ color: '#71717A', fontSize: 13 }}>Следи кандидатурите, дедлайни и документи</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8, overflowX: 'auto' }}>
        {[['tracker', '📋 Кандидатури'], ['roadmap', '🗺️ Roadmap'], ['calendar', '📅 Календар'], ['checklist', '✅ Документи']].map(([k, l]) =>
          <button key={k} onClick={() => setView(k)} style={{
            padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: view === k ? 600 : 500,
            color: view === k ? '#CCFF00' : '#71717A', background: view === k ? 'rgba(204,255,0,0.1)' : 'transparent',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s ease'
          }}>{l}</button>
        )}
      </div>

      {/* ═══ TRACKER TAB ═══ */}
      {view === 'tracker' && <>
        {apps.length === 0 && !adding ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 10, animation: 'float 3s ease-in-out infinite' }}>📝</div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, marginBottom: 6, color: '#FFFFFF' }}>Започни да следиш кандидатурите си</h3>
            <p style={{ color: '#71717A', fontSize: 12, marginBottom: 14, maxWidth: 360, margin: '0 auto 14px' }}>
              {user.profile.favorites.length > 0
                ? `Имаш ${user.profile.favorites.length} любими университета. Добави ги като кандидатури!`
                : 'Първо разгледай университетите и добави любими, после ги добави тук.'}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Btn accent onClick={() => setAdding(true)}>➕ Добави кандидатура</Btn>
              {user.profile.favorites.length === 0 && <Btn ghost onClick={() => {/* parent navigation handled via props if needed */}}>🎓 Разгледай университети</Btn>}
            </div>
          </div>
        ) : (
          <>
            <Btn accent onClick={() => setAdding(true)} sm style={{ marginBottom: 12 }}>➕ Добави</Btn>

            {/* Add form */}
            {adding && (
              <Card style={{ marginBottom: 14, animation: 'scaleIn .2s ease-out' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#FFFFFF' }}>Нова кандидатура</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  <select value={selUni} onChange={e => setSelUni(e.target.value)}
                    style={{ padding: '8px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', background: '#0A0A0B', color: '#A1A1AA' }}>
                    <option value="">Избери университет...</option>
                    {universities.sort((a, b) => a.rank - b.rank).map(u =>
                      <option key={u.id} value={u.id}>{u.emoji} {u.nameEn} — {u.city}, {u.country}</option>
                    )}
                  </select>
                  {selUni && <input value={selProg} onChange={e => setSelProg(e.target.value)} placeholder="Програма (незадължително)"
                    style={{ padding: '8px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', background: '#0A0A0B', color: '#A1A1AA' }} />}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn accent onClick={addApp} sm>✓ Добави</Btn>
                    <Btn onClick={() => { setAdding(false); setSelUni(''); }} sm>Отказ</Btn>
                  </div>
                </div>
              </Card>
            )}

            {/* App list */}
            {apps.map((app, i) => {
              const st = statusMap[app.status];
              const isExp = expanded === app.id;
              return (
                <Card key={app.id} style={{ marginBottom: 8, padding: '12px 16px', animation: `slideIn .3s ease-out ${i * 0.04}s both` }}>
                  <div onClick={() => setExpanded(isExp ? null : app.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{app.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{app.uni}</div>
                      <div style={{ fontSize: 11, color: '#71717A' }}>{app.program} · {app.country}</div>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 600, color: st.color, background: st.bg }}>{st.label}</span>
                    <span style={{ color: '#71717A', fontSize: 12, transform: isExp ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▼</span>
                  </div>
                  {isExp && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', animation: 'fadeIn .2s ease-out' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 600, color: '#71717A', textTransform: 'uppercase', marginBottom: 3 }}>Статус</div>
                          <select value={app.status} onChange={e => updateApp(app.id, 'status', e.target.value)}
                            style={{ width: '100%', padding: '6px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, fontSize: 11, fontFamily: 'inherit', background: '#0A0A0B', color: '#A1A1AA' }}>
                            {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 600, color: '#71717A', textTransform: 'uppercase', marginBottom: 3 }}>Дедлайн</div>
                          <input type="date" value={app.deadline} onChange={e => updateApp(app.id, 'deadline', e.target.value)}
                            style={{ width: '100%', padding: '6px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, fontSize: 11, fontFamily: 'inherit', background: '#0A0A0B', color: '#A1A1AA' }} />
                        </div>
                      </div>
                      <textarea value={app.notes || ''} onChange={e => updateApp(app.id, 'notes', e.target.value)}
                        placeholder="Бележки..." rows={2}
                        style={{ width: '100%', padding: '6px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, fontSize: 11, fontFamily: 'inherit', resize: 'vertical', marginBottom: 6, background: '#0A0A0B', color: '#A1A1AA' }} />

                      {/* Per-app document checklist */}
                      <div style={{ marginBottom: 8, paddingTop: 6 }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: '#71717A', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.05em' }}>Документи за тази кандидатура</div>
                        {(() => {
                          const appDocs = app.documents || {};
                          const required = docChecklist.filter(d => d.id !== 'portfolio' || ['Дизайн', 'Архитектура', 'Изкуства'].some(f => (app.program || '').includes(f)));
                          const ready = required.filter(d => appDocs[d.id]).length;
                          return <>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                              <span style={{ fontSize: 10, color: ready === required.length ? '#22C55E' : '#F59E0B', fontWeight: 600 }}>{ready}/{required.length}</span>
                              <div style={{ flex: 1, height: 4, background: '#1E1E21', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: ready === required.length ? '#22C55E' : '#F59E0B', borderRadius: 2, width: `${(ready / required.length) * 100}%`, transition: 'width .3s' }} />
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {required.map(d => {
                                const done = appDocs[d.id];
                                return (
                                  <button key={d.id} onClick={(e) => {
                                    e.stopPropagation();
                                    const newDocs = { ...appDocs, [d.id]: !done };
                                    updateApp(app.id, 'documents', newDocs);
                                  }} style={{
                                    padding: '4px 10px', borderRadius: 100, fontSize: 10, fontWeight: 500,
                                    background: done ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${done ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
                                    color: done ? '#22C55E' : '#71717A', cursor: 'pointer', fontFamily: 'inherit',
                                  }}>{done ? '✓' : '○'} {d.label.replace(/^.+\s/, '')}</button>
                                );
                              })}
                            </div>
                          </>;
                        })()}
                      </div>

                      <button onClick={() => removeApp(app.id)} style={{ fontSize: 10, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>🗑️ Премахни</button>
                    </div>
                  )}
                </Card>
              );
            })}

            {/* Status summary */}
            {apps.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                {Object.entries(statusMap).map(([k, v]) => {
                  const count = apps.filter(a => a.status === k).length;
                  if (!count) return null;
                  return <span key={k} style={{ padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 600, color: v.color, background: v.bg }}>{v.label} × {count}</span>;
                })}
              </div>
            )}
          </>
        )}
      </>}

      {/* ═══ ROADMAP TAB ═══ */}
      {view === 'roadmap' && (
        <div>
          {apps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>🗺️</div>
              <p style={{ color: '#71717A', fontSize: 13 }}>Добави кандидатури, за да генерираш персонализиран roadmap.</p>
              <Btn accent onClick={() => setView('tracker')} sm style={{ marginTop: 10 }}>📋 Към кандидатури</Btn>
            </div>
          ) : (
            <div>
              <p style={{ color: '#71717A', fontSize: 12, marginBottom: 16 }}>
                Автоматичен план базиран на {apps.length} кандидатур{apps.length > 1 ? 'и' : 'а'}
              </p>
              {(() => {
                // Generate milestones from apps
                const now = new Date();
                const milestones = [];

                // Phase 1: Research (for idea/research status apps)
                const researchApps = apps.filter(a => a.status === 'idea' || a.status === 'research');
                if (researchApps.length > 0) {
                  milestones.push({
                    phase: 'Проучване',
                    icon: '🔍',
                    color: '#5D5FEF',
                    done: researchApps.length === 0,
                    items: researchApps.map(a => ({
                      text: `Проучи ${a.uni} — ${a.program}`,
                      done: a.status !== 'idea',
                      app: a,
                    })),
                  });
                }

                // Phase 2: Documents
                const docsNeeded = apps.filter(a => ['idea', 'research', 'docs'].includes(a.status));
                const globalDocsReady = Object.values(docs).filter(Boolean).length;
                if (docsNeeded.length > 0 || globalDocsReady < 6) {
                  milestones.push({
                    phase: 'Документи',
                    icon: '📄',
                    color: '#F59E0B',
                    done: globalDocsReady >= 6 && docsNeeded.length === 0,
                    items: [
                      { text: `Основни документи: ${globalDocsReady}/10 готови`, done: globalDocsReady >= 6 },
                      ...docChecklist.filter(d => !docs[d.id]).slice(0, 4).map(d => ({
                        text: d.label.replace(/^.+\s/, ''),
                        done: false,
                      })),
                    ],
                  });
                }

                // Phase 3: Apply (per app with deadline)
                const toApply = apps.filter(a => ['idea', 'research', 'docs'].includes(a.status));
                if (toApply.length > 0) {
                  milestones.push({
                    phase: 'Кандидатстване',
                    icon: '📤',
                    color: '#818CF8',
                    done: toApply.length === 0,
                    items: toApply
                      .sort((a, b) => (a.deadline || '9999').localeCompare(b.deadline || '9999'))
                      .map(a => {
                        const dl = a.deadline ? new Date(a.deadline) : null;
                        const days = dl ? Math.ceil((dl - now) / (1000*60*60*24)) : null;
                        return {
                          text: `${a.emoji} ${a.uni}${dl ? ` — до ${dl.toLocaleDateString('bg-BG')}` : ''}`,
                          done: false,
                          urgent: days !== null && days <= 14,
                          daysLeft: days,
                          app: a,
                        };
                      }),
                  });
                }

                // Phase 4: Waiting
                const waiting = apps.filter(a => a.status === 'applied');
                if (waiting.length > 0) {
                  milestones.push({
                    phase: 'Изчакване на отговор',
                    icon: '⏳',
                    color: '#14B8A6',
                    done: false,
                    items: waiting.map(a => ({ text: `${a.emoji} ${a.uni} — ${a.program}`, done: false })),
                  });
                }

                // Phase 5: Decision
                const accepted = apps.filter(a => a.status === 'accepted');
                if (accepted.length > 0) {
                  milestones.push({
                    phase: 'Избор на оферта',
                    icon: '🎓',
                    color: '#22C55E',
                    done: false,
                    items: accepted.map(a => ({ text: `${a.emoji} ${a.uni} — ПРИЕТ!`, done: true })),
                  });
                }

                return milestones.map((m, mi) => (
                  <div key={mi} style={{ marginBottom: 20, position: 'relative', paddingLeft: 28 }}>
                    {/* Timeline line */}
                    {mi < milestones.length - 1 && (
                      <div style={{ position: 'absolute', left: 13, top: 28, bottom: -12, width: 2, background: m.done ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)' }} />
                    )}
                    {/* Phase dot */}
                    <div style={{
                      position: 'absolute', left: 4, top: 2, width: 20, height: 20, borderRadius: '50%',
                      background: m.done ? '#22C55E' : m.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, boxShadow: m.done ? '0 0 8px rgba(34,197,94,0.4)' : `0 0 8px ${m.color}33`,
                    }}>{m.done ? '✓' : m.icon}</div>
                    {/* Phase content */}
                    <div style={{ fontSize: 14, fontWeight: 600, color: m.done ? '#22C55E' : '#FFFFFF', marginBottom: 8 }}>
                      {m.phase}
                    </div>
                    <div style={{ display: 'grid', gap: 4 }}>
                      {m.items.map((item, ii) => (
                        <div key={ii} style={{
                          display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
                          background: item.done ? 'rgba(34,197,94,0.08)' : item.urgent ? 'rgba(245,158,11,0.08)' : '#161618',
                          border: `1px solid ${item.done ? 'rgba(34,197,94,0.2)' : item.urgent ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)'}`,
                          borderRadius: 8, fontSize: 11,
                        }}>
                          <span style={{ color: item.done ? '#22C55E' : '#71717A', fontSize: 12, flexShrink: 0 }}>
                            {item.done ? '✅' : '○'}
                          </span>
                          <span style={{ color: item.done ? '#22C55E' : '#A1A1AA', flex: 1, textDecoration: item.done ? 'line-through' : 'none' }}>
                            {item.text}
                          </span>
                          {item.daysLeft != null && (
                            <span style={{
                              fontSize: 10, fontWeight: 700, flexShrink: 0,
                              color: item.daysLeft < 0 ? '#EF4444' : item.urgent ? '#F59E0B' : '#71717A',
                            }}>
                              {item.daysLeft < 0 ? 'Изтекъл!' : `${item.daysLeft}д`}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      )}

      {/* ═══ CALENDAR TAB ═══ */}
      {view === 'calendar' && (
        <div>
          {months.map(([ym, items]) => {
            const [y, m] = ym.split('-');
            return (
              <div key={ym} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, color: '#FFFFFF' }}>
                  <span style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(204,255,0,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#CCFF00' }}>{monthNames[parseInt(m) - 1]}</span>
                  {monthNames[parseInt(m) - 1]} {y}
                </div>
                {items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', marginBottom: 4, borderLeft: `3px solid ${item.type === 'personal' ? '#EF4444' : item.type === 'scholarship' ? '#22C55E' : '#5D5FEF'}`, background: '#161618', borderRadius: '0 8px 8px 0', animation: `slideIn .3s ease-out ${i * 0.03}s both` }}>
                    <div style={{ fontSize: 16 }}>{item.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>{item.label}</div>
                      <div style={{ fontSize: 10, color: '#71717A' }}>{item.country} · {item.date.split('-').reverse().join('.')} · {item.note}</div>
                    </div>
                    <div style={{ fontSize: 9, color: '#71717A', flexShrink: 0 }}>
                      {item.type === 'scholarship' ? '🎯' : item.type === 'personal' ? '📌' : '🎓'}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
          <div style={{ padding: '10px', background: '#1E1E21', borderRadius: 8, fontSize: 10, color: '#A1A1AA', display: 'flex', gap: 12 }}>
            <span>🎓 Университетски дедлайни</span>
            <span>🎯 Стипендии</span>
            <span>📌 Твоите кандидатури</span>
          </div>
        </div>
      )}

      {/* ═══ CHECKLIST TAB ═══ */}
      {view === 'checklist' && (
        <div>
          <div style={{ fontSize: 13, color: '#71717A', marginBottom: 12 }}>
            Стандартни документи за кандидатстване. Отбележи готовите.
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, color: '#22C55E', background: 'rgba(34,197,94,0.1)' }}>
              ✅ {Object.values(docs).filter(Boolean).length} / {docChecklist.length} готови
            </span>
            <div style={{ flex: 1, height: 6, background: '#1E1E21', borderRadius: 3, alignSelf: 'center', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#22C55E', borderRadius: 3, width: `${(Object.values(docs).filter(Boolean).length / docChecklist.length) * 100}%`, transition: 'width .4s' }} />
            </div>
          </div>
          {docChecklist.map((doc, i) => (
            <div key={doc.id} onClick={() => toggleDoc(doc.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: docs[doc.id] ? 'rgba(34,197,94,0.15)' : '#161618', border: '1px solid ' + (docs[doc.id] ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'), borderRadius: 10, marginBottom: 6, cursor: 'pointer', transition: 'all .15s ease', animation: `slideIn .3s ease-out ${i * 0.03}s both` }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, border: docs[doc.id] ? 'none' : '2px solid #71717A',
                background: docs[doc.id] ? '#22C55E' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0, transition: 'all .15s ease'
              }}>{docs[doc.id] ? '✓' : ''}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, textDecoration: docs[doc.id] ? 'line-through' : 'none', color: docs[doc.id] ? '#22C55E' : '#FFFFFF' }}>{doc.label}</div>
                <div style={{ fontSize: 10, color: '#71717A' }}>{doc.note}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
