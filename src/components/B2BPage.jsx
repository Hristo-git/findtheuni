import React, { useState } from 'react';
import { universities } from '../data/universities.js';
import { Btn, Card } from './UI.jsx';

const stats = {
  students: '2,500+',
  profiles: '800+',
  countries: 15,
  unis: universities.length,
  matchRate: '94%',
};

const features = [
  { icon: '🎯', title: 'Qualified Leads', desc: 'Студентите попълват академичен профил — GPA, езици, интереси. Получавате само релевантни кандидати, не random трафик.' },
  { icon: '🤖', title: 'AI Matching', desc: 'Нашият алгоритъм match-ва студенти с вашите програми по 6 критерия. По-висока конверсия, по-малко отпадащи.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Виждате в реално време колко студенти разглеждат вашия университет, кои програми са най-търсени, и conversion rate.' },
  { icon: '🇧🇬', title: 'Достъп до български пазар', desc: 'Единствената платформа за university matching изцяло на български. Достигнете до 50,000+ български кандидат-студенти годишно.' },
  { icon: '💰', title: 'Pay per Lead', desc: 'Плащате само за реални заявки, не за impressions. Без месечни такси, без lock-in. ROI от ден 1.' },
  { icon: '📋', title: 'Application Support', desc: 'Помагаме на студентите с документи, дедлайни и процеса — по-малко dropout, повече enrollments.' },
];

const pricing = [
  { name: 'Starter', price: '€0', period: '/месец', desc: 'Безплатен профил', features: ['Университетска страница', 'До 5 програми', 'Базова аналитика', 'Лого в каталога'], cta: 'Започни безплатно', accent: false },
  { name: 'Growth', price: '€199', period: '/месец', desc: 'За активен recruitment', features: ['Неограничени програми', 'AI match приоритет', 'Пълна аналитика', 'Lead notifications', 'Branded профил', 'Email на кандидатите'], cta: 'Свържи се', accent: true },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'За мрежи от университети', features: ['Всичко от Growth', 'Dedicated account manager', 'API интеграция', 'Custom recruitment кампании', 'Offline събития', 'White-label опция'], cta: 'Заяви среща', accent: false },
];

const testimonials = [
  { quote: 'Find The Uni ни помогна да достигнем до българските студенти, което беше невъзможно чрез другите платформи.', author: 'Recruitment Office', uni: 'Партньорски университет, Германия' },
  { quote: 'Качеството на leads е много по-високо от традиционните канали. Студентите идват подготвени и мотивирани.', author: 'International Admissions', uni: 'Партньорски университет, Нидерландия' },
];

export default function B2BPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div style={{ padding: '32px 0' }} className="page-enter">
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '40px 0 32px', marginBottom: 20 }}>
        <div style={{ display: 'inline-flex', padding: '4px 14px', background: 'rgba(93,95,239,0.15)', color: '#818CF8', borderRadius: 14, fontSize: 11, fontWeight: 600, marginBottom: 14 }}>🏫 За университети</div>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, lineHeight: 1.2, marginBottom: 8 }}>
          Достигнете до <span className="grad-text">българските студенти</span>
        </h1>
        <p style={{ color: '#A1A1AA', fontSize: 14, maxWidth: 480, margin: '0 auto 20px', lineHeight: 1.6 }}>
          Find The Uni е единствената AI платформа за university matching на български.
          Свързваме мотивирани студенти с правилните програми — qualified leads, не random трафик.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn primary onClick={() => document.getElementById('b2b-contact')?.scrollIntoView({ behavior: 'smooth' })}>📩 Свържете се</Btn>
          <Btn onClick={() => document.getElementById('b2b-pricing')?.scrollIntoView({ behavior: 'smooth' })}>💰 Вижте цените</Btn>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(100px,1fr))', gap: 8, marginBottom: 28 }}>
        {[
          [stats.students, 'Студенти', '#818CF8', 'rgba(93,95,239,0.15)'],
          [stats.profiles, 'Профила', '#A78BFA', 'rgba(124,58,237,0.15)'],
          [`${stats.countries}`, 'Държави', '#22C55E', 'rgba(34,197,94,0.15)'],
          [stats.matchRate, 'Match rate', '#F59E0B', 'rgba(245,158,11,0.15)'],
        ].map(([v, l, cl, bg], i) => (
          <Card key={i} style={{ textAlign: 'center', padding: 12, background: bg, border: 'none', animation: `scaleIn .3s ease-out ${i * 0.06}s both` }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: cl }}>{v}</div>
            <div style={{ fontSize: 10, color: cl, fontWeight: 500 }}>{l}</div>
          </Card>
        ))}
      </div>

      {/* How it works */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>Как работи?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10 }}>
          {[
            { step: '1', icon: '🧠', title: 'Студентът прави профил', desc: 'RIASEC тест, академични данни, предпочитания за държава и бюджет.' },
            { step: '2', icon: '🤖', title: 'AI match-ва програми', desc: 'Алгоритъмът изчислява % съвпадение с вашите програми по 6 критерия.' },
            { step: '3', icon: '📤', title: 'Студентът кандидатства', desc: 'Бутон "Кандидатствай" → qualified lead с пълен профил директно до вас.' },
            { step: '4', icon: '📊', title: 'Вие получавате данни', desc: 'Dashboard с analytics, conversion tracking, и lead quality scoring.' },
          ].map((s, i) => (
            <Card key={i} style={{ textAlign: 'center', padding: '18px 14px', animation: `slideIn .3s ease-out ${i * 0.06}s both` }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#CCFF00', color: '#0A0A0B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{s.step}</div>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: '#A1A1AA', lineHeight: 1.4 }}>{s.desc}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>Защо Find The Uni?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 10 }}>
          {features.map((f, i) => (
            <Card key={i} style={{ padding: '16px', animation: `slideIn .3s ease-out ${i * 0.04}s both` }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 11, color: '#A1A1AA', lineHeight: 1.5 }}>{f.desc}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 10 }}>
          {testimonials.map((t, i) => (
            <Card key={i} style={{ background: 'rgba(93,95,239,0.1)', border: 'none', padding: '18px' }}>
              <div style={{ fontSize: 12, color: '#A1A1AA', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 10 }}>"{t.quote}"</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#818CF8' }}>{t.author}</div>
              <div style={{ fontSize: 10, color: '#A8A29E' }}>{t.uni}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="b2b-pricing" style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>Ценообразуване</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10 }}>
          {pricing.map((p, i) => (
            <Card key={i} style={{ padding: '20px', textAlign: 'center', border: p.accent ? '2px solid #CCFF00' : undefined, position: 'relative', animation: `scaleIn .3s ease-out ${i * 0.06}s both` }}>
              {p.accent && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', padding: '2px 12px', borderRadius: 8, background: '#CCFF00', color: '#0A0A0B', fontSize: 9, fontWeight: 600 }}>Популярен</div>}
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, color: '#CCFF00' }}>{p.price}<span style={{ fontSize: 12, fontWeight: 400, color: '#A8A29E' }}>{p.period}</span></div>
              <div style={{ fontSize: 11, color: '#A1A1AA', marginBottom: 12 }}>{p.desc}</div>
              <div style={{ textAlign: 'left', marginBottom: 14 }}>
                {p.features.map((f, j) => <div key={j} style={{ fontSize: 11, padding: '3px 0', color: '#A1A1AA' }}>✓ {f}</div>)}
              </div>
              <Btn primary={p.accent} sm onClick={() => document.getElementById('b2b-contact')?.scrollIntoView({ behavior: 'smooth' })}>{p.cta}</Btn>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div id="b2b-contact">
        <Card style={{ background: 'linear-gradient(135deg,rgba(93,95,239,0.15),rgba(204,255,0,0.1))', border: 'none', padding: '28px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📩</div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Свържете се с нас</h2>
          <p style={{ fontSize: 12, color: '#A1A1AA', marginBottom: 16, maxWidth: 400, margin: '0 auto 16px' }}>
            Оставете имейл и ще ви изпратим повече информация за партньорската програма.
          </p>
          {!sent ? (
            <div style={{ display: 'flex', gap: 8, maxWidth: 360, margin: '0 auto' }}>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="university@email.com" type="email"
                style={{ flex: 1, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#0A0A0B', color: '#fff' }} />
              <Btn accent onClick={() => { if (email.includes('@')) setSent(true); }}>Изпрати</Btn>
            </div>
          ) : (
            <div style={{ padding: '16px', background: 'rgba(34,197,94,0.15)', borderRadius: 12 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>✅</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#22C55E' }}>Благодарим!</div>
              <div style={{ fontSize: 12, color: '#22C55E' }}>Ще се свържем с вас до 24 часа на {email}</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
