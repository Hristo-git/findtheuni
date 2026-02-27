import React from 'react';

export const Btn = ({ children, primary, accent, sm, onClick, style }) => (
  <button onClick={onClick} style={{
    padding: sm ? "8px 14px" : "12px 22px", borderRadius: 10, fontSize: sm ? 12 : 14,
    fontWeight: 600, border: primary || accent ? "none" : "1px solid #E7E5E4",
    background: accent ? "#2563EB" : primary ? "#1C1917" : "white",
    color: primary || accent ? "white" : "#1C1917",
    display: "inline-flex", alignItems: "center", gap: 6, ...style
  }}>{children}</button>
);

export const Card = ({ children, style, className, ...props }) => (
  <div className={`card ${className || ''}`} style={{ padding: 16, ...style }} {...props}>
    {children}
  </div>
);

export const RadarChart = ({ data, size = 220 }) => {
  const cx = size / 2, cy = size / 2, R = size / 2 - 28;
  const n = data.length;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const getPoint = (i, r) => {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };
  const colors = ["#2563EB", "#7C3AED", "#059669", "#EA580C", "#E11D48", "#0891B2"];
  const levels = [0.25, 0.5, 0.75, 1];
  const dataPoints = data.map((d, i) => getPoint(i, (d.value / maxVal) * R));
  const pathD = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + 'Z';

  return (
    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      {levels.map((l, li) => {
        const pts = data.map((_, i) => getPoint(i, R * l));
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + 'Z';
        return <path key={li} d={d} fill="none" stroke="#E7E5E4" strokeWidth={li === 3 ? 1.5 : 0.7} strokeDasharray={li < 3 ? "3,3" : "none"} />;
      })}
      {data.map((_, i) => { const [ex, ey] = getPoint(i, R); return <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="#E7E5E4" strokeWidth={0.5} />; })}
      <path d={pathD} fill="rgba(37,99,235,0.12)" stroke="#2563EB" strokeWidth={2.5} strokeLinejoin="round" style={{ animation: 'fadeIn .8s ease-out' }} />
      {dataPoints.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={4.5} fill="white" stroke={colors[i % 6]} strokeWidth={2.5} style={{ animation: `scaleIn .4s ease-out ${i * 0.08}s both` }} />)}
      {data.map((d, i) => { const [lx, ly] = getPoint(i, R + 18); return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={600} fill={colors[i % 6]} style={{ fontFamily: "'DM Sans',sans-serif" }}>{d.label}</text>; })}
    </svg>
  );
};

export const AnimBar = ({ value, max, color, label, delay = 0 }) => {
  const pct = Math.round(value / max * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, animation: `slideIn .4s ease-out ${delay}s both` }}>
      <div style={{ width: 90, fontSize: 11, fontWeight: 500, textAlign: "right", flexShrink: 0, color: "#78716C" }}>{label}</div>
      <div style={{ flex: 1, height: 24, background: "#F5F5F4", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 12, background: `linear-gradient(90deg,${color},${color}dd)`, width: `${pct}%`, transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${delay}s`, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
          {pct > 15 && <span style={{ fontSize: 10, fontWeight: 700, color: "white" }}>{value}</span>}
        </div>
      </div>
      {pct <= 15 && <span style={{ fontSize: 10, fontWeight: 600, color }}>{value}</span>}
    </div>
  );
};
