import React, { useState } from 'react';
import { useUser } from '../UserContext.jsx';
import { allFields, fieldEmoji } from '../data/universities.js';
import { Btn, Card } from './UI.jsx';

const steps = [
  { key: 'level', title: 'Какво ниво на образование търсиш?', emoji: '🎓',
    opts: [
      { label: '📚 Бакалавър', value: 'bachelor', desc: '3-4 години, след средно' },
      { label: '🎓 Магистър', value: 'master', desc: '1-2 години, след бакалавър' },
      { label: '🔬 Докторат', value: 'phd', desc: '3-5 години, изследвания' },
      { label: '🤔 Не съм сигурен', value: '', desc: 'Ще ти помогнем да решиш' },
    ]},
  { key: 'langPref', title: 'На какъв език искаш да учиш?', emoji: '🗣️',
    opts: [
      { label: '🇬🇧 Английски', value: 'en', desc: 'Най-много програми' },
      { label: '🇩🇪 Немски', value: 'de', desc: 'Безплатно в Германия/Австрия' },
      { label: '🇫🇷 Френски', value: 'fr', desc: 'Франция, Швейцария, Белгия' },
      { label: '🌐 На местен език (по-евтино)', value: 'local', desc: 'Често безплатно' },
    ]},
  { key: 'budget', title: 'Какъв месечен бюджет имаш (без такси)?', emoji: '💰' },
  { key: 'fields', title: 'Кои области те интересуват?', emoji: '🎯', multi: true },
  { key: 'langCert', title: 'Имаш ли езиков сертификат?', emoji: '📜',
    opts: [
      { label: '🟢 IELTS (6.0+)', value: 'ielts', desc: 'Английски — UK, NL, IE' },
      { label: '🟢 TOEFL (80+)', value: 'toefl', desc: 'Английски — универсален' },
      { label: '🟢 TestDaF / Goethe B2+', value: 'german', desc: 'Немски — DE, AT, CH' },
      { label: '🟢 DELF B2+', value: 'french', desc: 'Френски — FR, CH, BE' },
      { label: '🔴 Нямам (все още)', value: 'none', desc: 'Не е проблем!' },
    ]},
];

const budgetMarks = [
  { v: 400, label: '€400', desc: 'България, Полша' },
  { v: 600, label: '€600', desc: '+ Чехия, Унгария' },
  { v: 800, label: '€800', desc: '+ Италия, Испания, Австрия' },
  { v: 1000, label: '€1000', desc: '+ Германия, Франция, Швеция' },
  { v: 1200, label: '€1200', desc: '+ Нидерландия, UK, Ирландия' },
  { v: 1500, label: '€1500+', desc: '+ Швейцария, Норвегия, Дания' },
];

const topFields = ["IT", "Медицина", "Инженерство", "Бизнес", "Право", "Природни науки", "Хуманитарни", "Изкуства", "Архитектура", "Дизайн", "Финанси", "Икономика", "Фармация", "Педагогика", "Маркетинг", "Електроника"];

export default function OnboardingWizard({ onFinish }) {
  const { update } = useUser();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ level: '', langPref: '', budget: 800, fields: [], langCert: '' });

  const s = steps[step];

  const pick = (key, value) => {
    const next = { ...data, [key]: value };
    setData(next);
    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 180);
    } else {
      finish(next);
    }
  };

  const toggleField = (f) => {
    setData(d => ({
      ...d,
      fields: d.fields.includes(f) ? d.fields.filter(x => x !== f) : [...d.fields, f]
    }));
  };

  const finish = (d) => {
    const langCerts = {};
    if (d.langCert && d.langCert !== 'none') langCerts[d.langCert] = true;
    update({
      onboarded: true,
      level: d.level,
      langPref: d.langPref,
      budget: d.budget,
      fields: d.fields,
      langCerts,
      createdAt: new Date().toISOString(),
    });
    onFinish();
  };

  const progress = (step + 1) / steps.length * 100;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'linear-gradient(180deg,#0A0A0B 0%,#111114 100%)' }}>
      <div style={{ maxWidth: 520, width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 600, marginBottom: 4, color: '#FFFFFF' }}>
            📖 <span className="grad-text">Find The Uni</span>
          </div>
          <p style={{ fontSize: 12, color: '#71717A' }}>Персонални препоръки за 60 секунди</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#CCFF00,#5D5FEF)', borderRadius: 3, width: `${progress}%`, transition: 'width .4s ease' }} />
          </div>
          <span style={{ fontSize: 10, color: '#71717A', flexShrink: 0 }}>{step + 1}/{steps.length}</span>
        </div>

        {/* Question */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 6, animation: 'float 3s ease-in-out infinite' }}>{s.emoji}</div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 600, lineHeight: 1.3, color: '#FFFFFF' }}>{s.title}</h2>
        </div>

        {/* BUDGET STEP — slider */}
        {s.key === 'budget' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 36, fontWeight: 700, color: '#CCFF00' }}>€{data.budget}</div>
              <div style={{ fontSize: 12, color: '#71717A' }}>на месец (без такси за обучение)</div>
            </div>
            <input type="range" min="300" max="1600" step="50" value={data.budget}
              onChange={e => setData({ ...data, budget: parseInt(e.target.value) })}
              style={{ width: '100%', marginBottom: 12, accentColor: '#CCFF00' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
              {budgetMarks.map(m => (
                <button key={m.v} onClick={() => setData({ ...data, budget: m.v })}
                  style={{ padding: '5px 12px', borderRadius: 100, fontSize: 11, border: data.budget >= m.v ? '2px solid #CCFF00' : '1px solid rgba(255,255,255,0.08)', background: data.budget >= m.v ? 'rgba(204,255,0,0.1)' : '#161618', color: data.budget >= m.v ? '#CCFF00' : '#A1A1AA', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                  {m.label} <span style={{ fontSize: 9, color: '#71717A' }}>{m.desc}</span>
                </button>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Btn primary onClick={() => step < steps.length - 1 ? setStep(step + 1) : finish(data)}>Продължи →</Btn>
            </div>
          </div>
        )}

        {/* FIELDS STEP — multi-select */}
        {s.key === 'fields' && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
              {topFields.map(f => (
                <button key={f} onClick={() => toggleField(f)}
                  style={{ padding: '8px 14px', borderRadius: 100, fontSize: 12, border: data.fields.includes(f) ? '2px solid #CCFF00' : '1px solid rgba(255,255,255,0.08)', background: data.fields.includes(f) ? 'rgba(204,255,0,0.1)' : '#161618', color: data.fields.includes(f) ? '#CCFF00' : '#A1A1AA', fontWeight: data.fields.includes(f) ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s ease', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                  {fieldEmoji[f] || '📌'} {f}
                </button>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 11, color: '#71717A', marginBottom: 10 }}>
              Избрани: {data.fields.length || 'нищо все още'} {data.fields.length > 0 && `(${data.fields.join(', ')})`}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Btn primary onClick={() => step < steps.length - 1 ? setStep(step + 1) : finish(data)}>
                {data.fields.length > 0 ? 'Продължи →' : 'Пропусни →'}
              </Btn>
            </div>
          </div>
        )}

        {/* OPTION STEPS */}
        {s.opts && s.key !== 'fields' && (
          <div style={{ display: 'grid', gap: 8 }}>
            {s.opts.map((opt, i) => (
              <button key={i} onClick={() => pick(s.key, opt.value)}
                style={{ padding: '16px 18px', background: 'rgba(22,22,24,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s ease', animation: `slideIn .3s ease-out ${i * 0.06}s both`, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#CCFF00'; e.currentTarget.style.background = 'rgba(204,255,0,0.06)'; e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(204,255,0,0.08)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(22,22,24,0.7)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2, color: '#FFFFFF' }}>{opt.label}</div>
                <div style={{ fontSize: 11, color: '#71717A' }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Back button */}
        {step > 0 && (
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <button onClick={() => setStep(step - 1)}
              style={{ padding: '6px 14px', borderRadius: 100, fontSize: 11, background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#71717A', cursor: 'pointer', fontFamily: 'inherit' }}>← Назад</button>
          </div>
        )}

        {/* Skip all */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={() => { update({ onboarded: true, createdAt: new Date().toISOString() }); onFinish(); }}
            style={{ fontSize: 11, color: '#71717A', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
            Пропусни и разгледай директно
          </button>
        </div>
      </div>
    </div>
  );
}
