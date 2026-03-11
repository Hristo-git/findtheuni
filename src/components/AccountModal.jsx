import { useState } from 'react';
import { signInWithMagicLink } from '../lib/authClient.js';
import { track, Events } from '../lib/analytics.js';

export default function AccountModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      await signInWithMagicLink(email.trim());
      setSent(true);
      track(Events.ACCOUNT_CREATED, { method: 'magic_link' });
    } catch (err) {
      setError(err.message || 'Грешка при изпращане на линка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)'
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#161618', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, padding: 32, maxWidth: 400, width: '90%',
        fontFamily: 'inherit', color: '#fff'
      }}>
        {!sent ? (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, margin: 0 }}>
              🔐 Влез в акаунта си
            </h2>
            <p style={{ fontSize: 13, color: '#A1A1AA', marginBottom: 20, marginTop: 8 }}>
              Ще получиш магически линк на имейла си. Без парола.
            </p>

            <div style={{
              background: 'rgba(204,255,0,0.05)', border: '1px solid rgba(204,255,0,0.15)',
              borderRadius: 12, padding: 14, marginBottom: 20
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#CCFF00', marginBottom: 6 }}>
                Защо да създадеш акаунт?
              </div>
              <ul style={{ fontSize: 12, color: '#A1A1AA', margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
                <li>💾 Запази прогреса си</li>
                <li>📱 Синхронизирай между устройства</li>
                <li>⏰ Получи напомняния за срокове</li>
                <li>🎯 Продължи от телефона или лаптопа си</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="твоят@имейл.com"
                required
                style={{
                  width: '100%', padding: '12px 14px',
                  background: '#0A0A0B', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 12, color: '#fff', fontSize: 14,
                  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                  marginBottom: 12
                }}
              />
              {error && (
                <div style={{ fontSize: 12, color: '#EF4444', marginBottom: 10 }}>{error}</div>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '12px',
                  background: loading ? 'rgba(204,255,0,0.3)' : '#CCFF00',
                  color: '#000', border: 'none', borderRadius: 12,
                  fontSize: 14, fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                {loading ? 'Изпращане...' : '✉️ Изпрати магически линк'}
              </button>
            </form>

            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '10px', marginTop: 8,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, color: '#71717A', fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              Продължи без акаунт
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, margin: '0 0 8px' }}>
              Провери имейла си!
            </h2>
            <p style={{ fontSize: 14, color: '#A1A1AA', marginBottom: 6 }}>
              Изпратихме магически линк на:
            </p>
            <p style={{ fontSize: 14, color: '#CCFF00', fontWeight: 600, marginBottom: 20 }}>
              {email}
            </p>
            <p style={{ fontSize: 12, color: '#71717A', marginBottom: 20 }}>
              Кликни линка в имейла, за да влезеш. Линкът е валиден 1 час.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, color: '#A1A1AA', fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              Затвори
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
