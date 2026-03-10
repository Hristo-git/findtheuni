import React from 'react';
import { useUser } from '../UserContext.jsx';

export default function JourneyBar({ onNavigate }) {
  const { profile, completedStages, currentStage, journeyProgress, JOURNEY_STAGES } = useUser();

  if (!profile.onboarded) return null;

  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto', padding: '10px 20px 6px',
      borderBottom: '1px solid rgba(255,255,255,0.04)'
    }}>
      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2,
            background: 'linear-gradient(90deg, #CCFF00, #5D5FEF)',
            width: `${journeyProgress}%`, transition: 'width 0.6s ease',
            boxShadow: '0 0 8px rgba(204,255,0,0.2)'
          }} />
        </div>
        <span style={{ fontSize: 10, color: '#71717A', flexShrink: 0, fontWeight: 600 }}>{journeyProgress}%</span>
      </div>

      {/* Stage dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, justifyContent: 'space-between' }}>
        {JOURNEY_STAGES.map((stage, i) => {
          const isDone = completedStages.includes(stage.id);
          const isCurrent = currentStage === stage.id;
          const isLocked = !isDone && !isCurrent;

          return (
            <React.Fragment key={stage.id}>
              {i > 0 && (
                <div style={{
                  flex: 1, height: 1,
                  background: isDone ? 'rgba(204,255,0,0.3)' : 'rgba(255,255,255,0.06)',
                  margin: '0 -2px'
                }} />
              )}
              <button
                onClick={() => !isLocked && onNavigate(stage.route)}
                title={stage.label}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  background: 'none', border: 'none', cursor: isLocked ? 'default' : 'pointer',
                  padding: '2px 6px', opacity: isLocked ? 0.35 : 1,
                  transition: 'opacity 0.2s',
                  flexShrink: 0, minWidth: 48,
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                  background: isDone ? 'rgba(34,197,94,0.15)' : isCurrent ? 'rgba(204,255,0,0.12)' : 'rgba(255,255,255,0.04)',
                  border: isDone ? '1.5px solid rgba(34,197,94,0.4)' : isCurrent ? '1.5px solid rgba(204,255,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isCurrent ? '0 0 12px rgba(204,255,0,0.15)' : 'none',
                  animation: isCurrent ? 'pulse 2s ease-in-out infinite' : 'none',
                }}>
                  {isDone ? <span style={{ fontSize: 12, color: '#22C55E' }}>✓</span> : stage.emoji}
                </div>
                <span style={{
                  fontSize: 9, fontWeight: isDone || isCurrent ? 600 : 400,
                  color: isDone ? '#22C55E' : isCurrent ? '#CCFF00' : '#52525B',
                  whiteSpace: 'nowrap',
                }}>{stage.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
