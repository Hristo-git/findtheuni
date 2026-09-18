import React, { useState, useMemo } from 'react';
import { scholarships } from '../data/testData';
import { Btn, Card } from './UI';

export default function ScholarshipFinder() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [country, setCountry] = useState('');
  const [onlyEligible, setOnlyEligible] = useState(true);

  const filtered = useMemo(() => {
    let list = [...scholarships];
    if (search) { const s = search.toLowerCase(); list = list.filter(sc => sc.name.toLowerCase().includes(s) || sc.desc.toLowerCase().includes(s) || sc.country.toLowerCase().includes(s)); }
    if (level) list = list.filter(sc => sc.level.includes(level));
    if (country) list = list.filter(sc => sc.country === country);
    if (onlyEligible) list = list.filter(sc => sc.eu !== 'no');
    return list;
  }, [search, level, country, onlyEligible]);

  const countries = [...new Set(scholarships.map(s => s.country))].sort();
  const excluded = filtered.filter(sc => sc.eu === 'no').length;

  // Значка за допустимост от гледна точка на български (EU) гражданин.
  const badge = {
    yes:   { text: '✅ Важи за теб',    bg: 'rgba(34,197,94,0.12)',  cl: '#22C55E' },
    no:    { text: '⛔ Не важи за EU',  bg: 'rgba(239,68,68,0.12)',  cl: '#EF4444' },
    check: { text: '❓ Провери',        bg: 'rgba(245,158,11,0.12)', cl: '#F59E0B' },
  };

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 600, color: '#FFFFFF' }}>🎯 Стипендии</h2>
        <span style={{ fontSize: 12, color: '#71717A' }}>{filtered.length} от {scholarships.length}</span>
      </div>
      <p style={{ color: '#71717A', fontSize: 13, marginBottom: 16 }}>Намери стипендия за обучение в Европа и света</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Търси стипендия..."
            style={{ width: '100%', padding: '9px 10px 9px 32px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#0A0A0B', color: '#A1A1AA', outline: 'none' }} />
        </div>
        <select value={level} onChange={e => setLevel(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', background: '#0A0A0B', color: '#A1A1AA' }}>
          <option value="">Всички нива</option>
          <option>Бакалавър</option><option>Магистър</option><option>Докторат</option>
        </select>
        <select value={country} onChange={e => setCountry(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', background: '#0A0A0B', color: '#A1A1AA' }}>
          <option value="">Всички държави</option>
          {countries.map(c => <option key={c}>{c}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#A1A1AA', cursor: 'pointer', padding: '0 4px' }}>
          <input type="checkbox" checked={onlyEligible} onChange={e => setOnlyEligible(e.target.checked)} style={{ accentColor: '#CCFF00' }} />
          Само за които отговарям
        </label>
      </div>

      {!onlyEligible && excluded > 0 && (
        <div style={{ fontSize: 11, color: '#F59E0B', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, padding: '8px 12px', marginBottom: 12 }}>
          ⚠️ {excluded} от показаните са само за граждани извън EU — българските граждани не отговарят на условията.
        </div>
      )}

      {/* Scholarship Cards */}
      <div style={{ display: 'grid', gap: 10 }}>
        {filtered.map((sc, i) => (
          <Card key={sc.id} style={{ padding: '16px 18px', animation: `slideIn .4s ease-out ${i * 0.04}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{sc.flag}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>{sc.name}</div>
                  <div style={{ fontSize: 11, color: '#71717A' }}>{sc.country}</div>
                  {sc.eu && <span title={sc.euNote} style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 600, background: badge[sc.eu].bg, color: badge[sc.eu].cl }}>{badge[sc.eu].text}</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#22C55E', fontFamily: "'Space Grotesk',sans-serif" }}>{sc.amount}</div>
                <div style={{ fontSize: 10, color: '#71717A' }}>Дедлайн: {sc.deadline}</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#71717A', lineHeight: 1.5, marginBottom: 8 }}>{sc.desc}</p>
            {sc.euNote && sc.eu !== 'yes' && <p style={{ fontSize: 11, color: badge[sc.eu].cl, lineHeight: 1.5, marginBottom: 8 }}>{sc.euNote}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {sc.level.map(l => <span key={l} style={{ padding: '2px 8px', borderRadius: 100, fontSize: 10, background: 'rgba(204,255,0,0.1)', color: '#CCFF00', fontWeight: 500 }}>{l}</span>)}
                {sc.fields[0] !== 'Всички' && sc.fields.map(f => <span key={f} style={{ padding: '2px 8px', borderRadius: 100, fontSize: 10, background: 'rgba(93,95,239,0.1)', color: '#818CF8', fontWeight: 500 }}>{f}</span>)}
              </div>
              <a href={`https://${sc.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#CCFF00', fontWeight: 500, textDecoration: 'none' }}>Сайт →</a>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#71717A' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
          <p style={{ marginBottom: 6 }}>Няма стипендии по тези критерии.</p>
          <p style={{ fontSize: 12, maxWidth: 420, margin: '0 auto', lineHeight: 1.6 }}>
            В част от държавите няма национална стипендия за EU граждани — там предимството е самото обучение,
            което е безплатно или почти безплатно на местния език. Виж гайда за държавата.
          </p>
        </div>
      )}
    </div>
  );
}
