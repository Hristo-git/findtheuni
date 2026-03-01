import React, { useState } from 'react';
import { universities } from '../data/universities.js';
import { Card, Btn } from './UI.jsx';

// Sample reviews — in production these come from a database
const sampleReviews = [
  { id:1, uniId:13, user:"Мария К.", year:2024, program:"Медицина", rating:5,
    aspects:{teaching:5,life:4,career:5,admission:3,diversity:4},
    text:"LMU е невероятен! Безплатно образование с топ качество. Единственият минус е бюрокрацията за записване." },
  { id:2, uniId:14, user:"Георги П.", year:2025, program:"Computer Science", rating:5,
    aspects:{teaching:5,life:4,career:5,admission:4,diversity:5},
    text:"TU Munich е мечта за IT. Връзките с индустрията са уникални — BMW, Siemens, SAP наемат директно." },
  { id:3, uniId:20, user:"Ива С.", year:2024, program:"PPE", rating:5,
    aspects:{teaching:5,life:5,career:5,admission:2,diversity:5},
    text:"Oxford е друг свят. Tutorial системата е уникална. Приемът е жесток но си заслужава." },
  { id:4, uniId:1, user:"Петър Д.", year:2025, program:"Информатика", rating:4,
    aspects:{teaching:3,life:4,career:3,admission:4,diversity:2},
    text:"СУ е солидна опция за България. Добри преподаватели, но инфраструктурата има нужда от обновяване." },
  { id:5, uniId:40, user:"Анна М.", year:2024, program:"Physics", rating:5,
    aspects:{teaching:5,life:3,career:5,admission:2,diversity:5},
    text:"ETH е топ 10 в света с причина. Натоварването е огромно но образованието е безценно. Цюрих е скъп!" },
  { id:6, uniId:31, user:"Никола Б.", year:2025, program:"AI", rating:4,
    aspects:{teaching:4,life:5,career:4,admission:3,diversity:5},
    text:"UvA за AI е страхотен избор. Амстердам е перфектен за млади хора. Жилище е трудно!" },
  { id:7, uniId:38, user:"Елена В.", year:2024, program:"Design", rating:5,
    aspects:{teaching:5,life:5,career:5,admission:3,diversity:4},
    text:"Polimi за дизайн е #1 в Европа. Милано вдъхновява на всяка крачка. Невероятни проекти." },
  { id:8, uniId:4, user:"Стефан Г.", year:2025, program:"Обща медицина", rating:4,
    aspects:{teaching:4,life:3,career:5,admission:3,diversity:3},
    text:"МУ София е тежко, но дипломата е призната навсякъде. 95% заетост. Струва си мъката." },
  { id:9, uniId:56, user:"Христо Р.", year:2024, program:"Medicine", rating:4,
    aspects:{teaching:4,life:5,career:4,admission:4,diversity:4},
    text:"Charles University в Прага — перфектен баланс между качество и цена. Градът е приказен." },
  { id:10, uniId:22, user:"Десислава К.", year:2025, program:"Computing", rating:5,
    aspects:{teaching:5,life:4,career:5,admission:3,diversity:5},
    text:"Imperial College е интензивен но те подготвя за всичко. Лондон е скъп, но стажовете компенсират." },
];

const aspectLabels = { teaching:"Преподаване", life:"Студ. живот", career:"Кариера", admission:"Приемане", diversity:"Разнообразие" };
const aspectEmoji = { teaching:"📚", life:"🎉", career:"💼", admission:"📝", diversity:"🌍" };

const Stars = ({ n, size = 12 }) => (
  <span style={{ fontSize: size, letterSpacing: 1 }}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>
);

export default function StudentReviews({ filterUniId }) {
  const [sortBy, setSortBy] = useState('recent');
  const [filterCountry, setFilterCountry] = useState('');
  const [showForm, setShowForm] = useState(false);

  let reviews = filterUniId
    ? sampleReviews.filter(r => r.uniId === filterUniId)
    : [...sampleReviews];

  if (filterCountry) {
    const countryUnis = universities.filter(u => u.country === filterCountry).map(u => u.id);
    reviews = reviews.filter(r => countryUnis.includes(r.uniId));
  }
  if (sortBy === 'rating') reviews.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'recent') reviews.sort((a, b) => b.year - a.year);

  // Aggregate stats
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const avgAspects = {};
  Object.keys(aspectLabels).forEach(k => {
    avgAspects[k] = reviews.length ? (reviews.reduce((s, r) => s + (r.aspects[k] || 0), 0) / reviews.length).toFixed(1) : 0;
  });

  const countries = [...new Set(sampleReviews.map(r => universities.find(u => u.id === r.uniId)?.country).filter(Boolean))].sort();

  return (
    <div className="page-enter">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
        <div>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:600, color:'#FFFFFF' }}>🌟 Отзиви от студенти</h2>
          <p style={{ color:'#71717A', fontSize:13, marginBottom:14 }}>{reviews.length} отзива · Средна оценка: ⭐{avgRating}/5</p>
        </div>
        <Btn accent onClick={() => setShowForm(!showForm)} sm>✍️ Напиши отзив</Btn>
      </div>

      {/* Write review form (placeholder) */}
      {showForm && (
        <Card style={{ marginBottom:14, background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', animation:'scaleIn .2s ease-out' }}>
          <div style={{ fontSize:12, fontWeight:600, color:'#F59E0B', marginBottom:4 }}>✍️ Напиши отзив</div>
          <p style={{ fontSize:11, color:'#F59E0B', lineHeight:1.5 }}>
            Тази функция ще бъде активна скоро! Ще можеш да споделиш опита си и да помогнеш на бъдещи студенти.
            Регистрирай се за ранен достъп.
          </p>
          <div style={{ marginTop:8, display:'flex', gap:6 }}>
            <input placeholder="Твоят имейл..." style={{ flex:1, padding:'7px 10px', border:'1px solid rgba(245,158,11,0.2)', borderRadius:6, fontSize:11, fontFamily:'inherit', background:'#0A0A0B', color:'#A1A1AA' }} />
            <Btn sm style={{ background:'#F59E0B', color:'#0A0A0B', border:'none' }}>Запиши ме</Btn>
          </div>
        </Card>
      )}

      {/* Aggregate aspect bars */}
      {reviews.length > 0 && (
        <Card style={{ marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:600, marginBottom:8, color:'#FFFFFF' }}>📊 Средни оценки по аспект</div>
          <div style={{ display:'grid', gap:6 }}>
            {Object.entries(aspectLabels).map(([k, label]) => (
              <div key={k} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:12, width:16 }}>{aspectEmoji[k]}</span>
                <span style={{ fontSize:11, width:90, color:'#71717A' }}>{label}</span>
                <div style={{ flex:1, height:8, background:'rgba(255,255,255,0.08)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', background: avgAspects[k] >= 4 ? '#22C55E' : avgAspects[k] >= 3 ? '#F59E0B' : '#EF4444', borderRadius:4, width:`${avgAspects[k] / 5 * 100}%`, transition:'width .6s' }} />
                </div>
                <span style={{ fontSize:11, fontWeight:600, width:28, textAlign:'right', color:'#FFFFFF' }}>{avgAspects[k]}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters */}
      {!filterUniId && (
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)}
            style={{ padding:'6px 10px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, fontSize:11, fontFamily:'inherit', background:'#0A0A0B', color:'#A1A1AA' }}>
            <option value="">Всички държави</option>
            {countries.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding:'6px 10px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, fontSize:11, fontFamily:'inherit', background:'#0A0A0B', color:'#A1A1AA' }}>
            <option value="recent">Най-нови</option>
            <option value="rating">Най-висока оценка</option>
          </select>
        </div>
      )}

      {/* Review cards */}
      {reviews.map((r, i) => {
        const uni = universities.find(u => u.id === r.uniId);
        return (
          <Card key={r.id} style={{ marginBottom:8, padding:'14px 16px', animation:`slideIn .3s ease-out ${i*0.04}s both` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>{uni?.emoji || '🎓'}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:'#FFFFFF' }}>{r.user}</div>
                  <div style={{ fontSize:10, color:'#71717A' }}>{uni?.nameEn} · {r.program} · {r.year}</div>
                </div>
              </div>
              <div style={{ color:'#F59E0B' }}><Stars n={r.rating} /></div>
            </div>
            <p style={{ fontSize:12, color:'#A1A1AA', lineHeight:1.5, marginBottom:8 }}>{r.text}</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {Object.entries(r.aspects).map(([k, v]) => (
                <span key={k} style={{ padding:'2px 8px', borderRadius:100, fontSize:9, background: v >= 4 ? 'rgba(34,197,94,0.1)' : v >= 3 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', color: v >= 4 ? '#22C55E' : v >= 3 ? '#F59E0B' : '#EF4444', fontWeight:500 }}>
                  {aspectEmoji[k]} {aspectLabels[k]} {v}/5
                </span>
              ))}
            </div>
          </Card>
        );
      })}

      {reviews.length === 0 && (
        <div style={{ textAlign:'center', padding:'40px 0', color:'#71717A' }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🌟</div>
          <p>Все още няма отзиви. Бъди първият!</p>
        </div>
      )}
    </div>
  );
}
