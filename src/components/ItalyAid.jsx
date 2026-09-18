import React, { useState } from 'react';
import { Card, Btn } from './UI.jsx';
import { useUser } from '../UserContext';
import { italyAid, NO_TAX_AREA, DSU_ISEE_MAX } from '../lib/isee.js';

const box = {
  width: '100%', padding: '9px 12px', background: '#0A0A0B',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
  fontSize: 14, fontFamily: 'inherit', color: '#fff', outline: 'none',
};
const lbl = {
  fontSize: 10, fontWeight: 600, color: '#71717A',
  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4,
};

/**
 * Оценява таксата и стипендията DSU за италиански държавен университет.
 * Данните се пазят в профила (само в localStorage) и важат за всички
 * италиански университети, а не само за този.
 */
export default function ItalyAid({ uni }) {
  const user = useUser();
  const saved = user.profile.household;
  const [open, setOpen] = useState(!!saved);
  const [income, setIncome] = useState(saved?.income ?? '');
  const [size, setSize] = useState(saved?.size ?? 4);
  const [assets, setAssets] = useState(saved?.assets ?? '');

  const parsed = { income: Number(income), size: Number(size), assets: Number(assets) || 0 };
  const aid = income !== '' ? italyAid(uni, parsed) : null;
  const dirty = aid && (saved?.income !== parsed.income || saved?.size !== parsed.size || (saved?.assets ?? 0) !== parsed.assets);

  if (!open) {
    return (
      <Card style={{ marginBottom: 14, padding: '14px 16px', background: 'rgba(93,95,239,0.06)', border: '1px solid rgba(93,95,239,0.2)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 20 }}>🧮</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#818CF8' }}>Колко ще платиш ти?</div>
            <div style={{ fontSize: 11, color: '#71717A', lineHeight: 1.5 }}>
              В Италия таксата зависи от дохода на семейството. Два въпроса стигат за оценка.
            </div>
          </div>
          <Btn accent sm onClick={() => setOpen(true)}>Пресметни</Btn>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ marginBottom: 14, padding: '16px', background: 'rgba(93,95,239,0.06)', border: '1px solid rgba(93,95,239,0.2)' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#818CF8', marginBottom: 12 }}>
        🧮 Оценка на таксата и стипендията
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10, marginBottom: 12 }}>
        <div>
          <div style={lbl}>Годишен доход на семейството</div>
          <input type="number" inputMode="numeric" min="0" step="1000" value={income} placeholder="напр. 18000"
            onChange={e => setIncome(e.target.value)} style={box} />
          <div style={{ fontSize: 10, color: '#52525B', marginTop: 3 }}>нетно, в евро, на всички работещи</div>
        </div>
        <div>
          <div style={lbl}>Членове на домакинството</div>
          <select value={size} onChange={e => setSize(e.target.value)} style={box}>
            {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}{n === 7 ? '+' : ''}</option>)}
          </select>
          <div style={{ fontSize: 10, color: '#52525B', marginTop: 3 }}>включително теб</div>
        </div>
        <div>
          <div style={lbl}>Спестявания и втори имот</div>
          <input type="number" inputMode="numeric" min="0" step="1000" value={assets} placeholder="по желание"
            onChange={e => setAssets(e.target.value)} style={box} />
          <div style={{ fontSize: 10, color: '#52525B', marginTop: 3 }}>без основното жилище</div>
        </div>
      </div>

      {aid && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 8, marginBottom: 12 }}>
            {[
              { v: `≈ €${aid.isee.toLocaleString('bg-BG')}`, l: 'Оценен ISEE', cl: '#818CF8' },
              {
                v: aid.tuition.exact === 0 ? '€0' : `до €${aid.tuition.upTo.toLocaleString('bg-BG')}`,
                l: 'Такса за година', cl: aid.tuition.exact === 0 ? '#22C55E' : '#F59E0B',
              },
              {
                v: aid.dsuEligible ? `€${aid.dsuAmount.toLocaleString('bg-BG')}` : '—',
                l: 'Стипендия DSU', cl: aid.dsuEligible ? '#22C55E' : '#71717A',
              },
              {
                v: `${aid.netPerYear > 0 ? '+' : '−'}€${Math.abs(Math.round(aid.netPerYear)).toLocaleString('bg-BG')}`,
                l: 'Нето за година', cl: aid.netPerYear > 0 ? '#CCFF00' : '#EF4444',
              },
            ].map((s, i) => (
              <Card key={i} style={{ textAlign: 'center', padding: 10, background: 'rgba(255,255,255,0.03)', border: 'none' }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, color: s.cl }}>{s.v}</div>
                <div style={{ fontSize: 9, color: '#71717A', marginTop: 2 }}>{s.l}</div>
              </Card>
            ))}
          </div>

          <div style={{ fontSize: 11, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 12 }}>
            {aid.isee <= NO_TAX_AREA
              ? <>Под прага от €{NO_TAX_AREA.toLocaleString('bg-BG')} (<i>no tax area</i>) таксата е нула — плаща се само регионалният налог от ~€{aid.regionalTax}.</>
              : <>Над прага от €{NO_TAX_AREA.toLocaleString('bg-BG')} таксата расте прогресивно и по закон не може да надхвърли 7% от разликата над €13,000.</>}
            {' '}
            {aid.dsuEligible
              ? <>ISEE под €{Math.round(DSU_ISEE_MAX).toLocaleString('bg-BG')} те прави кандидат за стипендия DSU: ~€{aid.dsuAmount.toLocaleString('bg-BG')}/год за студент, живеещ далеч от дома, плюс пълно освобождаване от такси и достъп до субсидирано общежитие. Кандидатства се отделно в регионалната агенция (ER.GO, DiSCo и др.) през юли–септември.</>
              : <>ISEE над €{Math.round(DSU_ISEE_MAX).toLocaleString('bg-BG')} е извън прага за стипендия DSU.</>}
          </div>

          <div style={{ fontSize: 10, color: '#71717A', lineHeight: 1.5, padding: '10px 12px', background: 'rgba(245,158,11,0.08)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.15)' }}>
            ⚠️ Това е <b>ориентировъчна оценка</b>, не официално изчисление. Истинският ISEE се издава от CAF
            (за чуждестранни доходи — <i>ISEE parificato</i>) и отчита неща, които тук не са включени: кадастралната
            стойност на имотите, приспадания за наем, увеличения при три и повече деца. Всеки университет има и
            собствена таблица с ленти. Провери сумата при CAF и в сайта на университета, преди да планираш по нея.
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <Btn primary sm onClick={() => user.update({ household: parsed })} disabled={!dirty}>
              {dirty ? '💾 Запази за всички университети' : '✓ Запазено'}
            </Btn>
            {saved && (
              <Btn ghost sm onClick={() => { user.update({ household: null }); setIncome(''); setAssets(''); setSize(4); setOpen(false); }}>
                Изчисти
              </Btn>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
