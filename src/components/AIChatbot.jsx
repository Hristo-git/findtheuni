import React, { useState, useRef, useEffect } from 'react';
import { chatPatterns } from '../data/chatData';
import { universities, fieldEmoji } from '../data/universities';

function getReply(msg) {
  const lower = msg.toLowerCase();
  
  // Check patterns
  for (const p of chatPatterns) {
    if (p.patterns.some(pat => lower.includes(pat))) return p.answer;
  }
  
  // Check for specific university name
  const uni = universities.find(u => 
    lower.includes(u.name.toLowerCase()) || lower.includes(u.nameEn.toLowerCase())
  );
  if (uni) {
    return `**${uni.name}** (${uni.nameEn})\n📍 ${uni.city}, ${uni.country} · 🏆 #${uni.rank}\n⭐ ${uni.rating}/5 · 💰 ${uni.tuition[0] === 0 && uni.tuition[1] === 0 ? 'Безплатно!' : `€${uni.tuition[0]}–${uni.tuition[1]}`}\n👔 ${uni.employability}% заетост · 👥 ${uni.students.toLocaleString()} студенти\n📚 Програми: ${uni.programs.join(', ')}\n💡 ${uni.type === 'public' ? 'Държавен' : 'Частен'} · 🌐 ${uni.languages.join(', ')}`;
  }
  
  // Check for country
  const countryMatch = universities.filter(u => lower.includes(u.country.toLowerCase()));
  if (countryMatch.length > 0) {
    const country = countryMatch[0].country;
    const unis = universities.filter(u => u.country === country).sort((a, b) => a.rank - b.rank);
    return `Университети в **${country}** (${unis.length}):\n${unis.slice(0, 5).map(u => `${u.emoji} **${u.nameEn}** — #${u.rank}, ⭐${u.rating}`).join('\n')}\n${unis.length > 5 ? `\n...и още ${unis.length - 5}. Виж всички в браузъра!` : ''}`;
  }
  
  // Check for field
  const fieldMatch = Object.keys(fieldEmoji).find(f => lower.includes(f.toLowerCase()));
  if (fieldMatch) {
    const unis = universities.filter(u => u.fields.includes(fieldMatch)).sort((a, b) => a.rank - b.rank);
    return `Топ университети за **${fieldMatch}**:\n${unis.slice(0, 5).map(u => `${u.emoji} **${u.nameEn}** (${u.city}) — #${u.rank}`).join('\n')}\n\nОбщо ${unis.length} университета предлагат ${fieldMatch}.`;
  }
  
  return "Благодаря за въпроса! Мога да ти помогна с:\n🎓 Университети (напр. \"Oxford\", \"ТУ София\")\n🌍 Държави (напр. \"Германия\", \"UK\")\n📚 Области (напр. \"IT\", \"Медицина\", \"Бизнес\")\n💰 Стипендии и разходи\n🧠 RIASEC теста\n\nПросто попитай!";
}

function formatMsg(text) {
  return text.split('\n').map((line, i) => {
    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} style={{ marginBottom: 2 }} />;
  });
}

export default function AIChatbot({ isOpen, onClose }) {
  const [msgs, setMsgs] = useState([
    { from: 'ai', text: "Здравей! 👋 Аз съм AI съветникът на Read More. Питай ме за университети, стипендии, програми или страни. Как мога да помогна?" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMsgs(prev => [...prev, { from: 'user', text: userMsg }]);
    setTyping(true);
    setTimeout(() => {
      const reply = getReply(userMsg);
      setMsgs(prev => [...prev, { from: 'ai', text: reply }]);
      setTyping(false);
    }, 600 + Math.random() * 400);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, width: 360, maxHeight: '70vh', background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200, display: 'flex', flexDirection: 'column', animation: 'scaleIn .3s ease-out', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <div><div style={{ fontSize: 14, fontWeight: 600 }}>AI Съветник</div>
          <div style={{ fontSize: 10, opacity: 0.8 }}>Read More Assistant</div></div>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: '4px 8px', color: 'white', fontSize: 14 }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', minHeight: 200, maxHeight: 'calc(70vh - 120px)' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            <div style={{
              maxWidth: '85%', padding: '10px 14px', borderRadius: 14,
              background: m.from === 'user' ? '#2563EB' : '#F5F5F4',
              color: m.from === 'user' ? 'white' : '#1C1917',
              fontSize: 12, lineHeight: 1.5,
              borderBottomRightRadius: m.from === 'user' ? 4 : 14,
              borderBottomLeftRadius: m.from === 'ai' ? 4 : 14,
            }}>
              {formatMsg(m.text)}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: 4, padding: '8px 12px', background: '#F5F5F4', borderRadius: 14, width: 'fit-content', marginBottom: 10 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#A8A29E', animation: `float 1.2s ease-in-out ${i * 0.15}s infinite` }} />)}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick actions */}
      <div style={{ padding: '6px 14px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {['💰 Безплатно', '💻 IT', '🏥 Медицина', '🎓 Стипендии'].map(q => (
          <button key={q} onClick={() => { setInput(q.slice(2).trim()); setTimeout(() => { setInput(q.slice(2).trim()); send(); }, 50); }} style={{ padding: '3px 8px', borderRadius: 8, fontSize: 10, border: '1px solid #E7E5E4', background: '#FAFAF9', color: '#78716C' }}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid #E7E5E4', display: 'flex', gap: 8 }}>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Попитай нещо..." style={{ flex: 1, padding: '8px 12px', border: '1px solid #E7E5E4', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
        <button onClick={send} style={{ padding: '8px 14px', borderRadius: 10, background: '#2563EB', color: 'white', border: 'none', fontSize: 13, fontWeight: 600 }}>→</button>
      </div>
    </div>
  );
}
