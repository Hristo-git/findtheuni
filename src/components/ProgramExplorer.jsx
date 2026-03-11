import React, { useState, useMemo } from 'react';
import { universities, fieldEmoji } from '../data/universities';
import { Btn, Card } from './UI';
import { useUser } from '../UserContext';
import { calcMatch } from '../utils/matching';

// Keywords → field mapping (program name → detected field)
const FIELD_KEYWORDS = {
  'IT': ['Информатика', 'Computer Science', 'Computer Eng', 'Software', 'Informatics', 'Data Science', 'AI', 'Artificial Intelligence', 'ICT', 'Computing', 'Information Technology', 'Informatik', 'Informatique'],
  'Инженерство': ['Електроинж', 'Машиностроене', 'Мехатроника', 'Engineering', 'Maschinenbau', 'Mechanical', 'Civil', 'Chemical Eng', 'Aerospace', 'Sustainable Energy', 'Robotics', 'Electronics', 'Electrical'],
  'Бизнес': ['Бизнес адм', 'Business', 'Management', 'MBA', 'Int. Business', 'BWL'],
  'Финанси': ['Финанси', 'Finance', 'Accounting', 'Banking'],
  'Маркетинг': ['Маркетинг', 'Marketing'],
  'Икономика': ['Икономика', 'Economics', 'МИО'],
  'Медицина': ['Обща медицина', 'Дентална', 'Medicine', 'Medical', 'MBBS', 'Biomedical', 'Невронаука'],
  'Фармация': ['Фармация', 'Pharmacy', 'Pharmaceutical'],
  'Право': ['Право', 'Law', 'Rechtswissenschaft', 'LLB', 'LLM', 'Juris'],
  'Дизайн': ['Графичен дизайн', 'Дизайн', 'Design', 'Fine Arts'],
  'Архитектура': ['Архитектура', 'Architecture'],
  'Природни науки': ['Биология', 'Химия', 'Физика', 'Natural Sciences', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Biotechnology', 'Math'],
  'Хуманитарни': ['Философия', 'История', 'Литература', 'PPE', 'Психология', 'Полит. науки', 'МО', 'Int. Studies', 'Education', 'Педагогика', 'Humanities', 'Psychology', 'Political', 'Philosophy', 'History'],
  'Педагогика': ['Педагогика', 'Pedagogy', 'Teacher Education', 'Education'],
};

function detectField(programName, uniFields) {
  const pLower = programName.toLowerCase();
  for (const [field, keywords] of Object.entries(FIELD_KEYWORDS)) {
    if (uniFields.includes(field) && keywords.some(kw => pLower.includes(kw.toLowerCase()))) {
      return field;
    }
  }
  // Second pass: match without requiring uni to have the field
  for (const [field, keywords] of Object.entries(FIELD_KEYWORDS)) {
    if (keywords.some(kw => pLower.includes(kw.toLowerCase()))) {
      return field;
    }
  }
  return uniFields[0];
}

// Build flat program list from all universities
const allPrograms = universities.flatMap(u =>
  u.programs.map(p => ({
    program: p,
    uni: u,
    field: detectField(p, u.fields),
  }))
);

const allFields = [...new Set(universities.flatMap(u => u.fields))].sort();
const allCountries = [...new Set(universities.map(u => u.country))].sort();
const allLanguages = [...new Set(universities.flatMap(u => u.languages))].sort();

export default function ProgramExplorer({ onSelectUni, onNavigate }) {
  const { profile, saveProgram, removeSavedProgram, isProgramSaved, addApplication } = useUser();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ field: '', country: '', lang: '', free: false });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = allPrograms;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p =>
        p.program.toLowerCase().includes(s) ||
        p.uni.nameEn.toLowerCase().includes(s) ||
        p.uni.city.toLowerCase().includes(s)
      );
    }
    if (filters.field) list = list.filter(p => p.field === filters.field);
    if (filters.country) list = list.filter(p => p.uni.country === filters.country);
    if (filters.lang) list = list.filter(p => p.uni.languages.includes(filters.lang));
    if (filters.free) list = list.filter(p => p.uni.tuition[0] === 0);

    // Sort: match score desc, then rank asc
    if (profile.onboarded) {
      list = list.map(p => ({ ...p, matchScore: calcMatch(p.uni, profile) || 0 }));
      list.sort((a, b) => b.matchScore - a.matchScore || a.uni.rank - b.uni.rank);
    } else {
      list.sort((a, b) => a.uni.rank - b.uni.rank);
    }
    return list;
  }, [search, filters, profile]);

  const totalPages = Math.ceil(filtered.length / 12);
  const shown = filtered.slice((page - 1) * 12, page * 12);

  // Group by field for stats
  const fieldStats = useMemo(() => {
    const map = {};
    allPrograms.forEach(p => {
      const f = p.field;
      if (!map[f]) map[f] = { count: 0, minTuition: Infinity, avgRank: 0 };
      map[f].count++;
      map[f].minTuition = Math.min(map[f].minTuition, p.uni.tuition[0]);
      map[f].avgRank += p.uni.rank;
    });
    Object.keys(map).forEach(f => { map[f].avgRank = Math.round(map[f].avgRank / map[f].count); });
    return map;
  }, []);

  return (
    <div style={{ padding: '32px 0' }} className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 600, color: '#FFFFFF' }}>
            📚 Програми
          </h2>
          <p style={{ color: '#71717A', fontSize: 13, marginBottom: 14 }}>
            {allPrograms.length} програми в {universities.length} университета
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Търси програма, университет, град..."
            style={{ width: '100%', padding: '11px 14px 11px 36px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, fontSize: 14, fontFamily: 'inherit', background: '#161618', color: '#fff', outline: 'none' }} />
        </div>
        <Btn ghost sm onClick={() => setShowFilters(!showFilters)} style={{ color: showFilters ? '#CCFF00' : undefined }}>
          ⚙️ Филтри
        </Btn>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card style={{ marginBottom: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10 }}>
          {[
            ['Област', 'field', allFields],
            ['Държава', 'country', allCountries],
            ['Език', 'lang', allLanguages],
          ].map(([label, key, options]) => (
            <div key={key}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#71717A', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.05em' }}>{label}</div>
              <select value={filters[key]} onChange={e => { setFilters({ ...filters, [key]: e.target.value }); setPage(1); }}
                style={{ width: '100%', padding: 8, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontFamily: 'inherit', fontSize: 12, background: '#0A0A0B', color: '#A1A1AA' }}>
                <option value="">Всички</option>
                {options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 16 }}>
            <input type="checkbox" checked={filters.free} onChange={e => { setFilters({ ...filters, free: e.target.checked }); setPage(1); }}
              style={{ accentColor: '#CCFF00' }} />
            <span style={{ fontSize: 12, color: '#A1A1AA' }}>Безплатно</span>
          </div>
        </Card>
      )}

      {/* Quick field chips */}
      {!search && !filters.field && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {allFields.slice(0, 8).map(f => (
            <button key={f} onClick={() => { setFilters({ ...filters, field: f }); setPage(1); setShowFilters(true); }}
              style={{
                padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#A1A1AA', cursor: 'pointer', fontFamily: 'inherit',
              }}>
              {fieldEmoji[f] || '📌'} {f}
              <span style={{ marginLeft: 4, fontSize: 10, color: '#71717A' }}>({fieldStats[f]?.count || 0})</span>
            </button>
          ))}
        </div>
      )}

      <p style={{ color: '#71717A', fontSize: 13, marginBottom: 12 }}>{filtered.length} резултата</p>

      {/* Program cards */}
      <div style={{ display: 'grid', gap: 8 }}>
        {shown.map((p, i) => {
          const ms = p.matchScore;
          const saved = isProgramSaved(p.uni.id, p.program);
          const programPayload = {
            uniId: p.uni.id, uniName: p.uni.nameEn, country: p.uni.country,
            city: p.uni.city, program: p.program, field: p.field,
            emoji: p.uni.emoji, languages: p.uni.languages,
            tuition: p.uni.tuition,
          };
          return (
            <Card key={`${p.uni.id}-${p.program}-${i}`}
              style={{
                padding: '14px 18px',
                animation: `slideIn .3s ease-out ${i * 0.03}s both`,
              }}>
              <div onClick={() => onSelectUni(p.uni)} style={{
                cursor: 'pointer',
                display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, alignItems: 'center',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(93,95,239,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {fieldEmoji[p.field] || p.uni.emoji}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 2 }}>{p.program}</div>
                  <div style={{ fontSize: 11, color: '#71717A' }}>
                    {p.uni.emoji} {p.uni.nameEn} · 📍{p.uni.city}, {p.uni.country}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, color: '#A1A1AA' }}>🏆 #{p.uni.rank}</span>
                    <span style={{ fontSize: 10, color: '#A1A1AA' }}>💰 {p.uni.tuition[0] === 0 ? 'Безпл.' : `€${p.uni.tuition[0]}`}</span>
                    <span style={{ fontSize: 10, color: '#A1A1AA' }}>🌐 {p.uni.languages[0]}</span>
                    <span style={{ fontSize: 10, color: '#A1A1AA' }}>👔 {p.uni.employability}%</span>
                  </div>
                </div>
                {ms != null && ms > 0 && (
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: ms >= 75 ? 'rgba(34,197,94,0.12)' : ms >= 50 ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700,
                    color: ms >= 75 ? '#22C55E' : ms >= 50 ? '#F59E0B' : '#71717A',
                    flexShrink: 0,
                  }}>
                    {ms}%
                  </div>
                )}
              </div>
              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 6, marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={(e) => {
                  e.stopPropagation();
                  if (saved) removeSavedProgram(p.uni.id, p.program);
                  else saveProgram(programPayload);
                }} style={{
                  flex: 1, padding: '7px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                  background: saved ? 'rgba(204,255,0,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${saved ? 'rgba(204,255,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: saved ? '#CCFF00' : '#A1A1AA', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {saved ? '★ Запазена' : '☆ Запази'}
                </button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  if (!saved) saveProgram(programPayload);
                  addApplication({
                    uniId: p.uni.id, uni: p.uni.nameEn, country: p.uni.country,
                    program: p.program, emoji: p.uni.emoji,
                    deadline: '', notes: '',
                  });
                  if (onNavigate) onNavigate('tracker');
                }} style={{
                  flex: 1, padding: '7px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                  background: 'rgba(93,95,239,0.12)', border: '1px solid rgba(93,95,239,0.3)',
                  color: '#818CF8', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  📤 Кандидатствай
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 20 }}>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{
              width: 32, height: 32, borderRadius: 10,
              border: page === i + 1 ? '1px solid #CCFF00' : '1px solid rgba(255,255,255,0.1)',
              background: page === i + 1 ? 'rgba(204,255,0,0.15)' : 'transparent',
              color: page === i + 1 ? '#CCFF00' : '#71717A',
              fontSize: 12, fontFamily: 'inherit',
            }}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
