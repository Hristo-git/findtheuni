import React, { useState } from 'react';
import { universities } from '../data/universities.js';
import { Card, Btn } from './UI.jsx';

// Sample ambassador profiles
const ambassadors = [
  { id:1, name:"Мария К.", uni:"LMU Munich", country:"Германия", program:"Медицина", year:3, avatar:"👩‍⚕️", lang:["Български","Немски","Английски"], bio:"Уча медицина в Мюнхен от 3 години. Мога да ви помогна с Studienkolleg и кандидатстването!", online:true, responses:47, avgTime:"~2ч" },
  { id:2, name:"Георги П.", uni:"TU Munich", country:"Германия", program:"CS", year:2, avatar:"👨‍💻", lang:["Български","Английски","Немски"], bio:"Software engineering в TUM. Работя и стажувам в BMW. Питайте за IT програми в Германия!", online:true, responses:63, avgTime:"~1ч" },
  { id:3, name:"Ива С.", uni:"University of Edinburgh", country:"UK", program:"AI", year:1, avatar:"👩‍🔬", lang:["Български","Английски"], bio:"Току-що започнах MSc AI в Единбург. Мога да помогна с UCAS, Personal Statement и Student Visa.", online:false, responses:28, avgTime:"~4ч" },
  { id:4, name:"Петър Д.", uni:"TU Delft", country:"Нидерландия", program:"Aerospace Eng.", year:3, avatar:"🧑‍🚀", lang:["Български","Английски","Нидерландски"], bio:"Aerospace в Делфт! Обичам инженерството и мога да споделя за студентския живот в NL.", online:true, responses:35, avgTime:"~3ч" },
  { id:5, name:"Елена В.", uni:"Politecnico di Milano", country:"Италия", program:"Design", year:2, avatar:"👩‍🎨", lang:["Български","Английски","Италиански"], bio:"Product Design в Polimi. Мога да помогна с портфолио и кандидатстване за дизайн програми.", online:false, responses:22, avgTime:"~5ч" },
  { id:6, name:"Стефан Г.", uni:"Charles University", country:"Чехия", program:"Medicine", year:4, avatar:"🧑‍⚕️", lang:["Български","Английски","Чешки"], bio:"4-ти курс медицина в Прага. Евтино, качествено и красив град. Питайте каквото и да е!", online:true, responses:51, avgTime:"~2ч" },
];

export default function PeerChat() {
  const [search, setSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [selectedAmb, setSelectedAmb] = useState(null);
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const filtered = ambassadors.filter(a => {
    if (search) { const s = search.toLowerCase(); if (!(a.name.toLowerCase().includes(s) || a.uni.toLowerCase().includes(s) || a.program.toLowerCase().includes(s) || a.country.toLowerCase().includes(s))) return false; }
    if (filterCountry && a.country !== filterCountry) return false;
    return true;
  });

  const countries = [...new Set(ambassadors.map(a => a.country))].sort();

  if (selectedAmb) {
    return (
      <div className="page-enter" style={{ padding:'32px 0' }}>
        <Btn onClick={() => { setSelectedAmb(null); setSent(false); setMsg(''); }} sm style={{ marginBottom:14 }}>← Назад</Btn>

        <Card style={{ padding:'20px', marginBottom:14 }}>
          <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:14 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:'#F5F5F4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>{selectedAmb.avatar}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:16, fontWeight:600 }}>{selectedAmb.name}</span>
                <span style={{ width:8, height:8, borderRadius:'50%', background: selectedAmb.online ? '#059669' : '#A8A29E' }} />
                <span style={{ fontSize:10, color: selectedAmb.online ? '#059669' : '#A8A29E' }}>{selectedAmb.online ? 'Онлайн' : 'Офлайн'}</span>
              </div>
              <div style={{ fontSize:12, color:'#78716C' }}>{selectedAmb.uni} · {selectedAmb.program} · {selectedAmb.year}-ри курс</div>
            </div>
          </div>
          <p style={{ fontSize:12, color:'#57534E', lineHeight:1.5, marginBottom:10 }}>{selectedAmb.bio}</p>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
            {selectedAmb.lang.map(l => <span key={l} style={{ padding:'2px 8px', borderRadius:6, fontSize:10, background:'#EFF6FF', color:'#2563EB' }}>{l}</span>)}
          </div>
          <div style={{ display:'flex', gap:12, fontSize:10, color:'#A8A29E' }}>
            <span>💬 {selectedAmb.responses} отговора</span>
            <span>⏱️ Отговаря за {selectedAmb.avgTime}</span>
          </div>
        </Card>

        {/* Message form */}
        {!sent ? (
          <Card>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>💬 Изпрати съобщение</div>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4}
              placeholder={`Здравей ${selectedAmb.name.split(' ')[0]}! Имам въпрос за ${selectedAmb.uni}...`}
              style={{ width:'100%', padding:'10px', border:'1px solid #E7E5E4', borderRadius:8, fontSize:12, fontFamily:'inherit', resize:'vertical', marginBottom:8 }} />
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:'#A8A29E', marginBottom:4 }}>Примерни въпроси:</div>
                <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                  {['Как е студентският живот?','Трудно ли е приемането?','Колко струва на месец?','Има ли стажове?'].map(q =>
                    <button key={q} onClick={() => setMsg(q)} style={{ padding:'3px 8px', borderRadius:6, fontSize:9, border:'1px solid #E7E5E4', background:'#FAFAF9', color:'#78716C', cursor:'pointer', fontFamily:'inherit' }}>{q}</button>
                  )}
                </div>
              </div>
              <Btn accent onClick={() => setSent(true)} sm style={{ alignSelf:'flex-end' }}>Изпрати →</Btn>
            </div>
          </Card>
        ) : (
          <Card style={{ background:'#ECFDF5', border:'1px solid #A7F3D0', textAlign:'center', padding:'24px' }}>
            <div style={{ fontSize:36, marginBottom:8 }}>✅</div>
            <div style={{ fontSize:14, fontWeight:600, color:'#059669', marginBottom:4 }}>Съобщението е изпратено!</div>
            <p style={{ fontSize:12, color:'#065F46' }}>
              {selectedAmb.name.split(' ')[0]} обикновено отговаря за {selectedAmb.avgTime}. Ще получиш имейл когато отговори.
            </p>
            <p style={{ fontSize:10, color:'#A8A29E', marginTop:8 }}>
              ⚠️ Peer-to-peer чатът е в бета. В пълната версия ще получиш real-time нотификации.
            </p>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding:'32px 0' }} className="page-enter">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:600 }}>💬 Чат със студенти</h2>
          <p style={{ color:'#78716C', fontSize:13, marginBottom:14 }}>Попитай реални български студенти в чужбина</p>
        </div>
        <span style={{ padding:'3px 10px', borderRadius:8, fontSize:10, background:'#FFFBEB', color:'#92400E', fontWeight:600 }}>🧪 Beta</span>
      </div>

      {/* Info banner */}
      <Card style={{ marginBottom:14, background:'linear-gradient(135deg,#EFF6FF,#F5F3FF)', border:'none' }}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <span style={{ fontSize:28 }}>🎓</span>
          <div>
            <div style={{ fontSize:12, fontWeight:600 }}>Student Ambassadors</div>
            <div style={{ fontSize:11, color:'#78716C', lineHeight:1.4 }}>
              Нашите амбасадори са реални български студенти в европейски университети.
              Питай за живота, приемането, стажове — всичко от първо лице.
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        <div style={{ flex:1, position:'relative' }}>
          <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Търси по име, университет, програма..."
            style={{ width:'100%', padding:'9px 10px 9px 32px', border:'1px solid #E7E5E4', borderRadius:8, fontSize:12, fontFamily:'inherit', background:'white', outline:'none' }} />
        </div>
        <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)}
          style={{ padding:'8px', border:'1px solid #E7E5E4', borderRadius:8, fontSize:11, fontFamily:'inherit', background:'white' }}>
          <option value="">Всички държави</option>
          {countries.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Online count */}
      <div style={{ fontSize:11, color:'#78716C', marginBottom:10 }}>
        <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:'#059669', marginRight:4 }} />
        {filtered.filter(a => a.online).length} онлайн от {filtered.length} амбасадори
      </div>

      {/* Ambassador cards */}
      <div style={{ display:'grid', gap:8 }}>
        {filtered.map((a, i) => (
          <Card key={a.id} onClick={() => setSelectedAmb(a)}
            style={{ cursor:'pointer', padding:'14px 16px', animation:`slideIn .3s ease-out ${i*0.04}s both` }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ position:'relative' }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'#F5F5F4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{a.avatar}</div>
                <div style={{ position:'absolute', bottom:-1, right:-1, width:10, height:10, borderRadius:'50%', background: a.online ? '#059669' : '#D6D3D1', border:'2px solid white' }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{a.name}</div>
                <div style={{ fontSize:11, color:'#78716C' }}>{a.uni} · {a.program} · {a.year}-ри курс</div>
                <div style={{ fontSize:10, color:'#A8A29E', marginTop:2 }}>🌐 {a.lang.join(', ')} · 💬 {a.responses} отг. · ⏱️ {a.avgTime}</div>
              </div>
              <span style={{ color:'#2563EB', fontSize:12, fontWeight:600 }}>Чат →</span>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'40px 0', color:'#A8A29E' }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🔍</div>
          <p>Няма амбасадори по тези критерии.</p>
        </div>
      )}

      {/* CTA for becoming ambassador */}
      <Card style={{ marginTop:16, background:'linear-gradient(135deg,#059669,#2563EB)', border:'none', textAlign:'center', padding:'20px' }}>
        <div style={{ fontSize:22, marginBottom:6 }}>🎓</div>
        <div style={{ fontSize:14, fontWeight:600, color:'white', marginBottom:4 }}>Учиш в чужбина? Стани амбасадор!</div>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.8)', marginBottom:10 }}>Помагай на бъдещи студенти и получи сертификат + менторски опит.</p>
        <button style={{ padding:'8px 18px', borderRadius:10, background:'white', color:'#059669', fontWeight:600, fontSize:12, border:'none', cursor:'pointer', fontFamily:'inherit' }}>Кандидатствай →</button>
      </Card>
    </div>
  );
}
