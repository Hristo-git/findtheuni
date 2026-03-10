import React, { useMemo } from 'react';
import { universities } from '../data/universities';
import { Card, Btn, MatchRing } from './UI';
import { useUser } from '../UserContext';
import { calcMatch } from '../utils/matching';
import { careerOutcomes } from '../data/testData';

const CRITERIA = [
  { key: 'match', label: 'Match %', icon: '🎯', weight: 0.25, mode: 'high' },
  { key: 'rank', label: 'Ранкинг', icon: '🏆', weight: 0.15, mode: 'low' },
  { key: 'employability', label: 'Заетост', icon: '👔', weight: 0.2, mode: 'high' },
  { key: 'cost', label: 'Достъпност', icon: '💰', weight: 0.2, mode: 'low' },
  { key: 'scholarships', label: 'Стипендии', icon: '🎯', weight: 0.1, mode: 'high' },
  { key: 'international', label: 'Интернац.', icon: '🌍', weight: 0.1, mode: 'high' },
];

function normalize(val, min, max, mode) {
  if (max === min) return 50;
  const norm = ((val - min) / (max - min)) * 100;
  return mode === 'low' ? 100 - norm : norm;
}

export default function DecisionHelper({ onNavigate }) {
  const { profile } = useUser();

  // Get accepted applications or all applications as candidates
  const candidates = useMemo(() => {
    const accepted = profile.applications.filter(a => a.status === 'accepted');
    const pool = accepted.length >= 2 ? accepted : profile.applications.filter(a => ['accepted', 'applied', 'docs'].includes(a.status));

    return pool.map(app => {
      const uni = universities.find(u => u.id === app.uniId);
      if (!uni) return null;
      const matchScore = profile.onboarded ? (calcMatch(uni, profile) || 0) : 50;
      const totalMonthlyCost = uni.costOfLiving + (uni.tuition[0] / 12);
      const career = careerOutcomes[uni.country];

      return {
        app,
        uni,
        matchScore,
        totalMonthlyCost,
        career,
        metrics: {
          match: matchScore,
          rank: uni.rank,
          employability: uni.employability,
          cost: totalMonthlyCost,
          scholarships: uni.scholarships ? 1 : 0,
          international: uni.international,
        }
      };
    }).filter(Boolean);
  }, [profile]);

  // Calculate weighted scores
  const scored = useMemo(() => {
    if (candidates.length < 2) return candidates;

    const ranges = {};
    CRITERIA.forEach(c => {
      const vals = candidates.map(x => x.metrics[c.key]);
      ranges[c.key] = { min: Math.min(...vals), max: Math.max(...vals) };
    });

    return candidates.map(c => {
      let totalScore = 0;
      const details = {};
      CRITERIA.forEach(cr => {
        const norm = normalize(c.metrics[cr.key], ranges[cr.key].min, ranges[cr.key].max, cr.mode);
        details[cr.key] = Math.round(norm);
        totalScore += norm * cr.weight;
      });
      return { ...c, totalScore: Math.round(totalScore), details };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }, [candidates]);

  const best = scored.length > 0 ? scored[0] : null;

  if (candidates.length < 2) {
    return (
      <div style={{ padding: '32px 0' }} className="page-enter">
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>
          🎓 Помощник за решение
        </h2>
        <p style={{ color: '#71717A', fontSize: 13, marginBottom: 32 }}>
          Сравни приетите оферти и избери най-доброто за теб
        </p>
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🤔</div>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, marginBottom: 8, color: '#fff' }}>
            Нужни са поне 2 кандидатури
          </h3>
          <p style={{ color: '#71717A', fontSize: 13, maxWidth: 380, margin: '0 auto 16px' }}>
            {profile.applications.length === 0
              ? 'Добави кандидатури в Tracker-а, за да можеш да сравниш офертите.'
              : `Имаш ${profile.applications.length} кандидатур${profile.applications.length === 1 ? 'а' : 'и'}, но нужни са поне 2 с напреднал статус (документи/кандидатствах/приет).`}
          </p>
          <Btn primary onClick={() => onNavigate('tracker')}>📝 Към Tracker</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0' }} className="page-enter">
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>
        🎓 Помощник за решение
      </h2>
      <p style={{ color: '#71717A', fontSize: 13, marginBottom: 20 }}>
        Сравни {scored.length} оферти по {CRITERIA.length} критерия
      </p>

      {/* Winner banner */}
      {best && (
        <Card glow style={{ marginBottom: 20, padding: '20px 24px', background: 'rgba(204,255,0,0.04)', border: '1px solid rgba(204,255,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 40 }}>{best.uni.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#CCFF00', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
                🏆 Най-добър избор
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{best.uni.nameEn}</div>
              <div style={{ fontSize: 12, color: '#A1A1AA' }}>{best.app.program} · {best.uni.city}, {best.uni.country}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 700, color: '#CCFF00' }}>{best.totalScore}</div>
              <div style={{ fontSize: 10, color: '#71717A' }}>точки</div>
            </div>
          </div>
        </Card>
      )}

      {/* Side-by-side cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(scored.length, 3)}, 1fr)`, gap: 12, marginBottom: 20 }}>
        {scored.map((c, i) => (
          <Card key={c.app.id} style={{
            padding: '18px',
            background: i === 0 ? 'rgba(204,255,0,0.03)' : undefined,
            border: i === 0 ? '1px solid rgba(204,255,0,0.15)' : undefined,
          }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 30, marginBottom: 4 }}>{c.uni.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{c.uni.nameEn}</div>
              <div style={{ fontSize: 10, color: '#71717A' }}>{c.uni.city}, {c.uni.country}</div>
              <div style={{ fontSize: 10, color: '#A1A1AA', marginTop: 2 }}>{c.app.program}</div>
            </div>

            {/* Score ring */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <MatchRing score={c.totalScore} size={64} />
            </div>

            {/* Criteria bars */}
            {CRITERIA.map(cr => {
              const val = c.details[cr.key];
              const isWinner = scored.every(other => c.details[cr.key] >= other.details[cr.key]);
              return (
                <div key={cr.key} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 3 }}>
                    <span style={{ color: '#71717A' }}>{cr.icon} {cr.label}</span>
                    <span style={{ color: isWinner ? '#CCFF00' : '#A1A1AA', fontWeight: isWinner ? 700 : 400 }}>{val}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    <div style={{
                      height: '100%', borderRadius: 2, width: `${val}%`, transition: 'width .4s',
                      background: isWinner ? '#CCFF00' : val >= 60 ? '#22C55E' : val >= 30 ? '#F59E0B' : '#EF4444',
                    }} />
                  </div>
                </div>
              );
            })}

            {/* Key stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#818CF8', fontFamily: "'Space Grotesk',sans-serif" }}>#{c.uni.rank}</div>
                <div style={{ fontSize: 9, color: '#71717A' }}>Ранг</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#22C55E', fontFamily: "'Space Grotesk',sans-serif" }}>€{Math.round(c.totalMonthlyCost)}</div>
                <div style={{ fontSize: 9, color: '#71717A' }}>€/мес общо</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#F59E0B', fontFamily: "'Space Grotesk',sans-serif" }}>{c.uni.employability}%</div>
                <div style={{ fontSize: 9, color: '#71717A' }}>Заетост</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#14B8A6', fontFamily: "'Space Grotesk',sans-serif" }}>
                  {c.career ? `€${(c.career.salary1y/1000).toFixed(0)}K` : 'N/A'}
                </div>
                <div style={{ fontSize: 9, color: '#71717A' }}>Заплата 1г.</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Comparison table */}
      <Card style={{ marginBottom: 20, overflow: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#71717A', fontSize: 11, background: '#161618' }}>Критерий</th>
              {scored.map((c, i) => (
                <th key={c.app.id} style={{
                  padding: '12px 14px', textAlign: 'center', fontSize: 11, fontWeight: 600,
                  color: i === 0 ? '#CCFF00' : '#A1A1AA',
                  background: i === 0 ? 'rgba(204,255,0,0.04)' : undefined,
                }}>
                  {c.uni.emoji} {c.uni.nameEn}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Програма', c => c.app.program],
              ['Ранг', c => `#${c.uni.rank}`],
              ['Такса/год.', c => c.uni.tuition[0] === 0 ? 'Безпл.' : `€${c.uni.tuition[0]}`],
              ['€/мес живот', c => `€${c.uni.costOfLiving}`],
              ['€/мес общо', c => `€${Math.round(c.totalMonthlyCost)}`],
              ['Заетост', c => `${c.uni.employability}%`],
              ['Межд. %', c => `${c.uni.international}%`],
              ['Match', c => `${c.matchScore}%`],
              ['Стипендии', c => c.uni.scholarships ? '✅ Да' : '❌ Не'],
              ['Езици', c => c.uni.languages.join(', ')],
              ['Заплата 1г.', c => c.career ? `€${(c.career.salary1y/1000).toFixed(0)}K` : 'N/A'],
              ['Заплата 5г.', c => c.career ? `€${(c.career.salary5y/1000).toFixed(0)}K` : 'N/A'],
            ].map(([label, fn], i) => (
              <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#71717A', fontSize: 11, background: 'rgba(255,255,255,0.02)' }}>{label}</td>
                {scored.map((c, j) => (
                  <td key={c.app.id} style={{
                    padding: '10px 14px', textAlign: 'center',
                    color: j === 0 ? '#CCFF00' : '#A1A1AA',
                    fontWeight: j === 0 ? 600 : 400,
                    background: j === 0 ? 'rgba(204,255,0,0.02)' : undefined,
                  }}>{fn(c)}</td>
                ))}
              </tr>
            ))}
            {/* Weighted total */}
            <tr style={{ borderTop: '2px solid rgba(255,255,255,0.08)' }}>
              <td style={{ padding: '12px 14px', fontWeight: 700, color: '#fff', fontSize: 12, background: 'rgba(255,255,255,0.02)' }}>Обща оценка</td>
              {scored.map((c, j) => (
                <td key={c.app.id} style={{
                  padding: '12px 14px', textAlign: 'center', fontWeight: 700, fontSize: 16,
                  fontFamily: "'Space Grotesk',sans-serif",
                  color: j === 0 ? '#CCFF00' : '#A1A1AA',
                  background: j === 0 ? 'rgba(204,255,0,0.04)' : undefined,
                }}>{c.totalScore}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </Card>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Btn primary onClick={() => onNavigate('tracker')}>📝 Към Tracker</Btn>
        <Btn accent onClick={() => onNavigate('cost')}>💰 Калкулатор</Btn>
        <Btn ghost onClick={() => onNavigate('compare')}>📊 Пълно сравнение</Btn>
      </div>
    </div>
  );
}
