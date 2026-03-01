import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { universities } from '../data/universities';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const colorByRank = r => r <= 50 ? '#CCFF00' : r <= 200 ? '#5D5FEF' : r <= 500 ? '#22C55E' : '#F59E0B';
const sizeByRank = r => r <= 50 ? 8 : r <= 200 ? 6 : r <= 500 ? 5 : 4;

export default function EuropeMap({ onSelectUni, filters }) {
  const [hoverUni, setHoverUni] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const filtered = useMemo(() => {
    let list = [...universities];
    if (filters?.country) list = list.filter(u => u.country === filters.country);
    if (filters?.field) list = list.filter(u => u.fields.includes(filters.field));
    return list;
  }, [filters]);

  return (
    <div
      style={{ position: 'relative', background: '#0D1117', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      {/* Legend */}
      <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(22,22,24,0.9)', borderRadius: 8, padding: '8px 12px', fontSize: 10, zIndex: 10, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontWeight: 600, marginBottom: 4, color: '#FFFFFF' }}>🗺️ Карта на университети</div>
        {[['Топ 50', '#CCFF00'], ['51–200', '#5D5FEF'], ['201–500', '#22C55E'], ['500+', '#F59E0B']].map(([l, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
            <span style={{ color: '#A1A1AA' }}>{l}</span>
          </div>
        ))}
        <div style={{ marginTop: 4, color: '#71717A', fontSize: 9 }}>{filtered.length} университета</div>
      </div>

      {/* Hover tooltip — positioned via mouse, no SVG overflow issues */}
      {hoverUni && (
        <div style={{
          position: 'absolute',
          left: Math.min(mousePos.x + 12, '80%'),
          top: Math.max(mousePos.y - 48, 4),
          background: '#1C1C1E',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8,
          padding: '7px 11px',
          zIndex: 20,
          pointerEvents: 'none',
          minWidth: 140,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>{hoverUni.emoji} {hoverUni.nameEn}</div>
          <div style={{ fontSize: 10, color: '#A1A1AA' }}>#{hoverUni.rank} · ⭐{hoverUni.rating} · {hoverUni.city}</div>
          <div style={{ fontSize: 9, color: '#71717A', marginTop: 2 }}>€{hoverUni.tuition[0]}–{hoverUni.tuition[1]}/год · €{hoverUni.costOfLiving}/мес</div>
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [15, 54], scale: 860 }}
        style={{ width: '100%', height: 440, display: 'block' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1C1C1E"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={0.5}
                style={{ outline: 'none', default: { outline: 'none' }, hover: { outline: 'none', fill: '#242428' }, pressed: { outline: 'none' } }}
              />
            ))
          }
        </Geographies>

        {filtered.map(u => {
          const color = colorByRank(u.rank);
          const r = sizeByRank(u.rank);
          const isHovered = hoverUni?.id === u.id;
          return (
            <Marker key={u.id} coordinates={[u.coords[1], u.coords[0]]}>
              <circle
                r={isHovered ? r + 3 : r}
                fill={isHovered ? color : `${color}90`}
                stroke="#0D1117"
                strokeWidth={1.5}
                onClick={() => onSelectUni(u)}
                onMouseEnter={() => setHoverUni(u)}
                onMouseLeave={() => setHoverUni(null)}
                style={{ cursor: 'pointer', transition: 'r .15s ease, fill .15s ease' }}
              />
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}
