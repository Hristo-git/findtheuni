import React, { useState, useMemo } from 'react';
import { universities, allCountries } from '../data/universities';

export default function EuropeMap({ onSelectUni, filters }) {
  const [hover, setHover] = useState(null);
  const [zoom, setZoom] = useState(1);

  // Map SVG viewBox covers Europe approx: lat 35-70, lng -12 to 35
  const toX = lng => ((lng + 12) / 47) * 800;
  const toY = lat => ((70 - lat) / 35) * 600;

  const filtered = useMemo(() => {
    let list = [...universities];
    if (filters?.country) list = list.filter(u => u.country === filters.country);
    if (filters?.field) list = list.filter(u => u.fields.includes(filters.field));
    return list;
  }, [filters]);

  const sizeByRank = (rank) => {
    if (rank <= 50) return 8;
    if (rank <= 200) return 6;
    if (rank <= 500) return 5;
    return 4;
  };

  const colorByRank = (rank) => {
    if (rank <= 50) return '#CCFF00';
    if (rank <= 200) return '#5D5FEF';
    if (rank <= 500) return '#22C55E';
    return '#F59E0B';
  };

  return (
    <div style={{ position: 'relative', background: 'linear-gradient(180deg, #0A0A0B 0%, #0D1117 100%)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Legend */}
      <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(22,22,24,0.9)', borderRadius: 8, padding: '8px 12px', fontSize: 10, zIndex: 2, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontWeight: 600, marginBottom: 4, color: '#FFFFFF' }}>🗺️ Карта на университети</div>
        {[['Топ 50', '#CCFF00'], ['51-200', '#5D5FEF'], ['201-500', '#22C55E'], ['500+', '#F59E0B']].map(([l, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
            <span style={{ color: '#A1A1AA' }}>{l}</span>
          </div>
        ))}
        <div style={{ marginTop: 4, color: '#71717A', fontSize: 9 }}>{filtered.length} университета</div>
      </div>

      <svg viewBox="0 0 800 600" style={{ width: '100%', height: 400, display: 'block' }}>
        {/* Water/background */}
        <rect width="800" height="600" fill="#0D1117" rx="0" />

        {/* Simplified Europe landmass */}
        <path d="M150,180 L200,150 L280,120 L350,100 L420,95 L480,100 L550,110 L600,130 L650,100 L700,120 L720,160 L700,200 L680,240 L700,280 L680,320 L650,350 L600,380 L550,400 L500,420 L450,440 L400,450 L350,440 L300,420 L280,390 L260,350 L240,380 L200,400 L160,380 L140,340 L130,300 L140,260 L160,230 L150,200Z" fill="#161618" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Iberian */}
        <path d="M100,350 L140,320 L180,310 L200,340 L240,350 L260,380 L240,420 L200,440 L160,450 L120,430 L90,400 L80,370Z" fill="#161618" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Italy */}
        <path d="M380,320 L400,350 L420,380 L430,420 L420,450 L400,460 L390,440 L380,400 L370,370 L360,340Z" fill="#161618" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Scandinavia */}
        <path d="M380,30 L400,20 L420,40 L410,80 L400,120 L380,100 L370,60Z" fill="#161618" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <path d="M340,50 L360,30 L370,60 L380,100 L370,130 L350,120 L340,90 L330,70Z" fill="#161618" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* UK/Ireland */}
        <path d="M200,140 L230,120 L250,140 L240,170 L220,190 L200,180 L190,160Z" fill="#161618" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <path d="M170,150 L190,140 L195,165 L180,180 L165,170Z" fill="#161618" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* University dots */}
        {filtered.map(u => {
          const x = toX(u.coords[1]);
          const y = toY(u.coords[0]);
          const r = sizeByRank(u.rank);
          const color = colorByRank(u.rank);
          const isHovered = hover === u.id;

          return (
            <g key={u.id} onClick={() => onSelectUni(u)} onMouseEnter={() => setHover(u.id)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer' }}>
              <circle cx={x} cy={y} r={isHovered ? r + 3 : r} fill={isHovered ? color : `${color}90`} stroke="#161618" strokeWidth={isHovered ? 2 : 1} style={{ transition: 'all .2s ease' }} />
              {isHovered && (
                <g style={{ animation: 'fadeIn .2s ease-out' }}>
                  <rect x={x - 60} y={y - 42} width={120} height={34} rx={6} fill="#161618" stroke="rgba(255,255,255,0.1)" />
                  <text x={x} y={y - 28} textAnchor="middle" fontSize={9} fontWeight={600} fill="#FFFFFF" style={{ fontFamily: "'Space Grotesk'" }}>{u.emoji} {u.nameEn}</text>
                  <text x={x} y={y - 16} textAnchor="middle" fontSize={8} fill="#A1A1AA" style={{ fontFamily: "'Space Grotesk'" }}>#{u.rank} · ⭐{u.rating} · {u.city}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
