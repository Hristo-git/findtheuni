import React from 'react';

export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, style, type = 'button',
  primary, accent, sm, lg }) {
  const resolvedVariant = primary ? 'primary' : accent ? 'accent' : variant;
  const resolvedSize = sm ? 'sm' : lg ? 'lg' : size;
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    border: 'none', borderRadius: '8px', fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s', fontFamily: 'inherit',
    opacity: disabled ? 0.5 : 1,
    fontSize: resolvedSize === 'sm' ? '0.85rem' : resolvedSize === 'lg' ? '1.05rem' : '0.95rem',
    padding: resolvedSize === 'sm' ? '6px 14px' : resolvedSize === 'lg' ? '14px 28px' : '10px 20px',
  };
  const variants = {
    primary: { background: '#2563eb', color: '#fff' },
    accent: { background: '#7c3aed', color: '#fff' },
    secondary: { background: '#f1f5f9', color: '#334155' },
    ghost: { background: 'transparent', color: '#2563eb', border: '1.5px solid #2563eb' },
    danger: { background: '#ef4444', color: '#fff' },
    success: { background: '#22c55e', color: '#fff' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...(variants[resolvedVariant] || variants.primary), ...style }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(0.92)'; }}
      onMouseLeave={e => { e.currentTarget.style.filter = ''; }}>
      {children}
    </button>
  );
}

export function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: '#fff', borderRadius: '12px',
      border: '1px solid #e2e8f0', padding: '24px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow 0.15s, transform 0.15s',
      ...style,
    }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = ''; }}>
      {children}
    </div>
  );
}

export function AnimBar({ value, max = 100, color = '#2563eb', label }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: '10px' }}>
      {label && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', color: '#64748b' }}>
        <span>{label}</span><span style={{ fontWeight: 600, color }}>{value}{max === 100 ? '%' : ''}</span>
      </div>}
      <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

export function RadarChart({ scores: scoresProp, data, size = 200 }) {
  // Accept either scores={R:5,I:3,...} or data=[{label:'R',value:5},...]
  const scores = scoresProp || (data ? Object.fromEntries(data.map(d => [d.label, d.value])) : {});
  const types = ['R', 'I', 'A', 'S', 'E', 'C'];
  const colors = { R: '#ef4444', I: '#3b82f6', A: '#a855f7', S: '#22c55e', E: '#f59e0b', C: '#14b8a6' };
  const labels = { R: 'Реалист', I: 'Изследовател', A: 'Артист', S: 'Социален', E: 'Предприемач', C: 'Конвенционален' };
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = types.length;

  const angleOf = i => (Math.PI * 2 * i) / n - Math.PI / 2;
  const maxScore = Math.max(...types.map(t => scores[t] || 0), 1);

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const toXY = (i, ratio) => ({
    x: cx + r * ratio * Math.cos(angleOf(i)),
    y: cy + r * ratio * Math.sin(angleOf(i)),
  });

  const dataPoints = types.map((t, i) => toXY(i, (scores[t] || 0) / maxScore));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map(lvl => {
        const pts = types.map((_, i) => toXY(i, lvl));
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={lvl} d={path} fill="none" stroke="#e2e8f0" strokeWidth="1" />;
      })}
      {types.map((_, i) => {
        const end = toXY(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      <path d={dataPath} fill="rgba(37,99,235,0.18)" stroke="#2563eb" strokeWidth="2" />
      {types.map((t, i) => {
        const lp = toXY(i, 1.22);
        const dp = toXY(i, (scores[t] || 0) / maxScore);
        return (
          <g key={t}>
            <circle cx={dp.x} cy={dp.y} r="4" fill={colors[t]} />
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
              fontSize={size * 0.065} fontWeight="600" fill={colors[t]}>{labels[t]}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function Badge({ children, color = '#2563eb' }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: '999px',
      fontSize: '0.78rem', fontWeight: 600,
      background: color + '18', color,
    }}>{children}</span>
  );
}

export function StarRating({ value, max = 5 }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: '1rem' }}>
      {'★'.repeat(value)}{'☆'.repeat(max - value)}
    </span>
  );
}
