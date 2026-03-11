import { useState, useEffect } from 'react';
import { track, Events } from '../lib/analytics.js';
import { canUseAdvancedReminders } from '../lib/entitlements.js';

const DEFAULT_SETTINGS = {
  remindersEnabled: false,
  reminderEmail: '',
  reminderOffsetsDays: [30, 14, 7, 1],
  weeklyDigestEnabled: false
};

export default function ReminderSettings({ email, plan, settings, onSave, onClose, onPremiumCTA }) {
  const [form, setForm] = useState({ ...DEFAULT_SETTINGS, ...settings, reminderEmail: settings?.reminderEmail || email || '' });
  const advanced = canUseAdvancedReminders(plan);

  const handleToggle = (key) => {
    const next = { ...form, [key]: !form[key] };
    setForm(next);
    if (key === 'remindersEnabled') {
      track(next.remindersEnabled ? Events.REMINDER_ENABLED : Events.REMINDER_DISABLED);
    }
  };

  const handleSave = () => {
    onSave(form);
    onClose?.();
  };

  const toggleOffset = (days) => {
    const current = form.reminderOffsetsDays;
    const next = current.includes(days)
      ? current.filter(d => d !== days)
      : [...current, days].sort((a, b) => b - a);
    setForm({ ...form, reminderOffsetsDays: next });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)'
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#161618', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, padding: 28, maxWidth: 440, width: '90%',
        fontFamily: 'inherit', color: '#fff'
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>⏰ Напомняния</h2>
        <p style={{ fontSize: 13, color: '#A1A1AA', marginTop: 4, marginBottom: 20 }}>
          Получавай известия за приближаващи срокове.
        </p>

        {/* Main toggle */}
        <ToggleRow
          label="Напомняния за срокове"
          description="Имейл известия преди крайни дати"
          checked={form.remindersEnabled}
          onChange={() => handleToggle('remindersEnabled')}
        />

        {form.remindersEnabled && (
          <>
            {/* Reminder email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Имейл за напомняния
              </label>
              <input
                type="email"
                value={form.reminderEmail}
                onChange={e => setForm({ ...form, reminderEmail: e.target.value })}
                style={{
                  width: '100%', padding: '10px 12px', marginTop: 4,
                  background: '#0A0A0B', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#fff', fontSize: 13,
                  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Offset days */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                Напомни ми преди
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[30, 14, 7, 3, 1].map(d => (
                  <button
                    key={d}
                    onClick={() => toggleOffset(d)}
                    style={{
                      padding: '6px 14px', borderRadius: 100, fontSize: 12,
                      fontFamily: 'inherit', cursor: 'pointer',
                      background: form.reminderOffsetsDays.includes(d) ? 'rgba(204,255,0,0.15)' : 'rgba(255,255,255,0.04)',
                      color: form.reminderOffsetsDays.includes(d) ? '#CCFF00' : '#71717A',
                      border: `1px solid ${form.reminderOffsetsDays.includes(d) ? 'rgba(204,255,0,0.3)' : 'rgba(255,255,255,0.08)'}`
                    }}
                  >
                    {d} {d === 1 ? 'ден' : 'дни'}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly digest — premium */}
            <ToggleRow
              label="Седмичен обзор"
              description="Обобщение на предстоящите срокове всеки понеделник"
              checked={form.weeklyDigestEnabled}
              onChange={() => {
                if (!advanced) {
                  track(Events.PREMIUM_CTA_CLICKED, { feature: 'weekly_digest' });
                  onPremiumCTA?.();
                  return;
                }
                handleToggle('weeklyDigestEnabled');
              }}
              premium={!advanced}
            />
          </>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: '11px', borderRadius: 12,
            background: '#CCFF00', color: '#000', border: 'none',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
          }}>
            Запази
          </button>
          <button onClick={onClose} style={{
            padding: '11px 20px', borderRadius: 12,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            color: '#71717A', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit'
          }}>
            Отказ
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange, premium }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
      marginBottom: 12
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>
          {label}
          {premium && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '1px 6px',
              borderRadius: 100, background: 'rgba(204,255,0,0.12)',
              color: '#CCFF00', marginLeft: 8, verticalAlign: 'middle'
            }}>PREMIUM</span>
          )}
        </div>
        <div style={{ fontSize: 12, color: '#71717A', marginTop: 2 }}>{description}</div>
      </div>
      <button
        onClick={onChange}
        style={{
          width: 44, height: 24, borderRadius: 12, border: 'none',
          background: checked ? '#CCFF00' : 'rgba(255,255,255,0.1)',
          cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s'
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: 9,
          background: checked ? '#000' : '#71717A',
          position: 'absolute', top: 3,
          left: checked ? 22 : 4,
          transition: 'left 0.2s'
        }} />
      </button>
    </div>
  );
}
