import React from 'react';

export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, style, type = 'button',
  primary, accent, sm, lg, ghost }) {
  const resolvedVariant = primary ? 'primary' : accent ? 'accent' : ghost ? 'ghost' : variant;
  const resolvedSize = sm ? 'sm' : lg ? 'lg' : size;
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    border: 'none', borderRadius: '100px', fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', fontFamily: 'inherit',
    opacity: disabled ? 0.5 : 1,
    fontSize: resolvedSize === 'sm' ? '0.8rem' : resolvedSize === 'lg' ? '1.05rem' : '0.9rem',
    padding: resolvedSize === 'sm' ? '7px 16px' : resolvedSize === 'lg' ? '14px 32px' : '10px 24px',
    letterSpacing: '0.01em',
  };
  const variants = {
    primary: { background: '#CCFF00', color: '#0A0A0B', fontWeight: 700 },
    accent: { background: '#5D5FEF', color: '#fff' },
    secondary: { background: 'rgba(255,255,255,0.08)', color: '#A1A1AA', border: '1px solid rgba(255,255,255,0.08)' },
    ghost: { background: 'transparent', color: '#A1A1AA', border: '1px solid rgba(255,255,255,0.12)' },
    danger: { background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' },
    success: { background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...(variants[resolvedVariant] || variants.primary), ...style }}
      onMouseEnter={e => {
        if (disabled) return;
        if (resolvedVariant === 'primary') {
          e.currentTarget.style.boxShadow = '0 0 20px rgba(204,255,0,0.3), 0 0 60px rgba(204,255,0,0.1)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        } else {
          e.currentTarget.style.background = resolvedVariant === 'accent' ? '#6E70FF' :
            resolvedVariant === 'ghost' ? 'rgba(255,255,255,0.06)' : undefined;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.transform = '';
        if (resolvedVariant !== 'primary') {
          e.currentTarget.style.background = (variants[resolvedVariant] || variants.primary).background;
        }
      }}>
      {children}
    </button>
  );
}

export function Card({ children, style, onClick, glow, className = '' }) {
  return (
    <div onClick={onClick} className={className} style={{
      background: '#161618', borderRadius: '24px',
      border: '1px solid rgba(255,255,255,0.08)', padding: '24px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      ...style,
    }}
      onMouseEnter={e => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.boxShadow = glow
            ? '0 0 30px rgba(204,255,0,0.15), 0 20px 60px rgba(0,0,0,0.3)'
            : '0 20px 60px rgba(0,0,0,0.3)';
        } else {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.boxShadow = '';
      }}>
      {children}
    </div>
  );
}

export function AnimBar({ value, max = 100, color = '#CCFF00', label }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: '10px' }}>
      {label && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px', color: '#A1A1AA' }}>
        <span>{label}</span><span style={{ fontWeight: 600, color }}>{value}{max === 100 ? '%' : ''}</span>
      </div>}
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 8px ${color}40` }} />
      </div>
    </div>
  );
}

export function RadarChart({ scores: scoresProp, data, size = 220 }) {
  const scores = scoresProp || (data ? Object.fromEntries(data.map(d => [d.label, d.value])) : {});
  const types = ['R', 'I', 'A', 'S', 'E', 'C'];
  const colors = { R: '#EF4444', I: '#5D5FEF', A: '#A855F7', S: '#22C55E', E: '#F59E0B', C: '#14B8A6' };
  const labels = { R: 'Реалист', I: 'Изследовател', A: 'Артист', S: 'Социален', E: 'Предприемач', C: 'Конвенц.' };
  const pad = 60;
  const cx = size / 2 + pad, cy = size / 2 + pad, r = size * 0.38;
  const totalW = size + pad * 2, totalH = size + pad * 2;
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
    <svg width={totalW} height={totalH} viewBox={`0 0 ${totalW} ${totalH}`} style={{ maxWidth: '100%' }}>
      {gridLevels.map(lvl => {
        const pts = types.map((_, i) => toXY(i, lvl));
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={lvl} d={path} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
      })}
      {types.map((_, i) => {
        const end = toXY(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}
      <defs>
        <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#5D5FEF" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path d={dataPath} fill="url(#radarGrad)" stroke="#CCFF00" strokeWidth="2" />
      {types.map((t, i) => {
        const lp = toXY(i, 1.28);
        const dp = toXY(i, (scores[t] || 0) / maxScore);
        return (
          <g key={t}>
            <circle cx={dp.x} cy={dp.y} r="5" fill={colors[t]} style={{ filter: `drop-shadow(0 0 4px ${colors[t]}60)` }} />
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
              fontSize={size * 0.065} fontWeight="600" fill={colors[t]}
              style={{ fontFamily: "'Space Grotesk'" }}>{labels[t]}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function Badge({ children, color = '#CCFF00' }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 12px', borderRadius: '100px',
      fontSize: '0.75rem', fontWeight: 600,
      background: color + '18', color,
      border: `1px solid ${color}25`,
    }}>{children}</span>
  );
}

export function StarRating({ value, max = 5 }) {
  return (
    <span style={{ color: '#F59E0B', fontSize: '1rem' }}>
      {'★'.repeat(value)}{'☆'.repeat(max - value)}
    </span>
  );
}

// Match score ring component
export function MatchRing({ score, size = 48 }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#71717A';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 4px ${color}40)` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.28, fontWeight: 700, color }}>{score}</div>
    </div>
  );
}
