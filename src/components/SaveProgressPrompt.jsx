import { track, Events } from '../lib/analytics.js';

const DISMISS_KEY = 'ftu_prompt_dismissed';

// Variants for different high-intent moments
const VARIANTS = {
  riasec: {
    icon: '🧬',
    title: 'Запази резултатите си!',
    body: 'Създай безплатен акаунт, за да не загубиш кариерния си профил.',
    cta: 'Запази прогреса'
  },
  quiz: {
    icon: '🌍',
    title: 'Запази препоръките си!',
    body: 'Влез в акаунта си, за да синхронизираш резултатите между устройства.',
    cta: 'Синхронизирай сега'
  },
  favorite: {
    icon: '⭐',
    title: 'Синхронизирай shortlist-а си',
    body: 'Създай акаунт, за да достъпваш любимите си университети отвсякъде.',
    cta: 'Запази shortlist'
  },
  program: {
    icon: '📚',
    title: 'Запази програмите си',
    body: 'Влез, за да не загубиш запазените програми при смяна на устройство.',
    cta: 'Запази програми'
  },
  application: {
    icon: '📋',
    title: 'Получи напомняния за срокове!',
    body: 'С акаунт можеш да получаваш напомняния и да следиш кандидатурите си.',
    cta: 'Включи напомняния'
  }
};

function isDismissed(variant) {
  try {
    const d = JSON.parse(localStorage.getItem(DISMISS_KEY) || '{}');
    return !!d[variant];
  } catch { return false; }
}

function dismissVariant(variant) {
  try {
    const d = JSON.parse(localStorage.getItem(DISMISS_KEY) || '{}');
    d[variant] = Date.now();
    localStorage.setItem(DISMISS_KEY, JSON.stringify(d));
  } catch {}
}

export default function SaveProgressPrompt({ variant, onSignIn, onDismiss }) {
  const v = VARIANTS[variant];
  if (!v || isDismissed(variant)) return null;

  track(Events.ACCOUNT_PROMPT_SHOWN, { variant });

  const handleDismiss = () => {
    dismissVariant(variant);
    onDismiss?.();
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(204,255,0,0.06), rgba(93,95,239,0.06))',
      border: '1px solid rgba(204,255,0,0.15)',
      borderRadius: 16, padding: 20, marginTop: 16, marginBottom: 16,
      fontFamily: 'inherit', position: 'relative'
    }}>
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute', top: 10, right: 12,
          background: 'none', border: 'none', color: '#71717A',
          fontSize: 16, cursor: 'pointer', padding: 4
        }}
        aria-label="Затвори"
      >×</button>

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>{v.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            {v.title}
          </div>
          <div style={{ fontSize: 13, color: '#A1A1AA', marginBottom: 12, lineHeight: 1.5 }}>
            {v.body}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onSignIn}
              style={{
                padding: '8px 18px', borderRadius: 10,
                background: '#CCFF00', color: '#000', border: 'none',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {v.cta}
            </button>
            <button
              onClick={handleDismiss}
              style={{
                padding: '8px 14px', borderRadius: 10,
                background: 'transparent', color: '#71717A',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 12, cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              По-късно
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { isDismissed, VARIANTS };
