import { useState } from 'react';
import { getEntitlements } from '../lib/entitlements.js';

export default function AccountMenu({ email, plan, onSignOut, onReminders, onClose }) {
  const ent = getEntitlements(plan);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', top: 60, right: 16,
        background: '#161618', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: 20, minWidth: 260,
        fontFamily: 'inherit', color: '#fff',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          Акаунт
        </div>
        <div style={{ fontSize: 14, color: '#fff', fontWeight: 500, marginBottom: 4 }}>
          {email}
        </div>
        <div style={{
          display: 'inline-block', fontSize: 10, fontWeight: 700,
          padding: '2px 8px', borderRadius: 100,
          background: plan === 'premium' ? 'rgba(204,255,0,0.15)' : 'rgba(255,255,255,0.06)',
          color: plan === 'premium' ? '#CCFF00' : '#71717A',
          marginBottom: 16
        }}>
          {ent.name}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <MenuBtn icon="⏰" label="Напомняния" onClick={onReminders} />
          <MenuBtn icon="🚪" label="Излез" onClick={onSignOut} danger />
        </div>
      </div>
    </div>
  );
}

function MenuBtn({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px', borderRadius: 10,
        background: 'transparent', border: 'none',
        color: danger ? '#EF4444' : '#A1A1AA',
        fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
        textAlign: 'left', width: '100%'
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
