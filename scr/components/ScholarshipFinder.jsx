import React, { useState, useMemo } from 'react';
import { scholarships } from '../data/testData';
import { Btn, Card } from './UI';

export default function ScholarshipFinder() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [country, setCountry] = useState('');

  const filtered = useMemo(() => {
    let list = [...scholarships];
    if (search) { const s = search.toLowerCase(); list = list.filter(sc => sc.name.toLowerCase().includes(s) || sc.desc.toLowerCase().includes(s) || sc.country.toLowerCase().includes(s)); }
    if (level) list = list.filter(sc => sc.level.includes(level));
    if (country) list = list.filter(sc => sc.country === country);
    return list;
  }, [search, level, country]);

  const countries = [...new Set(scholarships.map(s => s.country))].sort();

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600 }}>🎯 Стипендии</h2>
        <span style={{ fontSize: 12, color: '#78716C' }}>{filtered.length} от {scholarships.length}</span>
      </div>
      <p style={{ color: '#78716C', fontSize: 13, marginBottom: 16 }}>Намери стипендия за обучение в Европа и света</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Търси стипендия..."
            style={{ width: '100%', padding: '9px 10px 9px 32px', border: '1px solid #E7E5E4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'white', outline: 'none' }} />
        </div>
        <select value={level} onChange={e => setLevel(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #E7E5E4', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', background: 'white' }}>
          <option value="">Всички нива</option>
          <option>Бакалавър</option><option>Магистър</option><option>Докторат</option>
        </select>
        <select value={country} onChange={e => setCountry(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #E7E5E4', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', background: 'white' }}>
          <option value="">Всички държави</option>
          {countries.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Scholarship Cards */}
      <div style={{ display: 'grid', gap: 10 }}>
        {filtered.map((sc, i) => (
          <Card key={sc.id} style={{ padding: '16px 18px', animation: `slideIn .4s ease-out ${i * 0.04}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{sc.flag}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{sc.name}</div>
                  <div style={{ fontSize: 11, color: '#78716C' }}>{sc.country}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#059669', fontFamily: "'Playfair Display',serif" }}>{sc.amount}</div>
                <div style={{ fontSize: 10, color: '#A8A29E' }}>Дедлайн: {sc.deadline}</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#78716C', lineHeight: 1.5, marginBottom: 8 }}>{sc.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {sc.level.map(l => <span key={l} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, background: '#EFF6FF', color: '#2563EB', fontWeight: 500 }}>{l}</span>)}
                {sc.fields[0] !== 'Всички' && sc.fields.map(f => <span key={f} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, background: '#F5F3FF', color: '#7C3AED', fontWeight: 500 }}>{f}</span>)}
              </div>
              <a href={`https://${sc.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#2563EB', fontWeight: 500, textDecoration: 'none' }}>Сайт →</a>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#A8A29E' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
          <p>Няма стипендии по тези критерии.</p>
        </div>
      )}
    </div>
  );
}
