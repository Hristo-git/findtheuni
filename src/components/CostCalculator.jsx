import React, { useState, useMemo } from 'react';
import { universities } from '../data/universities';
import { scholarships } from '../data/testData';
import { Card, Btn } from './UI';
import { useUser } from '../UserContext';
import { checkScholarshipEligibility } from '../utils/matching';

const MONTHS_PER_YEAR = 12;
const COST_SPLIT = { rent: 0.55, food: 0.25, transport: 0.1, other: 0.1 };

export default function CostCalculator({ preselectedUniId, onNavigate }) {
  const { profile } = useUser();
  const [uniId, setUniId] = useState(preselectedUniId || '');
  const [duration, setDuration] = useState(6); // semesters
  const [hasScholarship, setHasScholarship] = useState(false);
  const [scholarshipAmount, setScholarshipAmount] = useState(500);
  const [partTimeWork, setPartTimeWork] = useState(false);
  const [workHours, setWorkHours] = useState(10);
  const [workWage, setWorkWage] = useState(10);
  const [savings, setSavings] = useState(0);
  const [familySupport, setFamilySupport] = useState(0);

  const uni = uniId ? universities.find(u => u.id === parseInt(uniId)) : null;

  const eligibleScholarships = useMemo(() => {
    if (!profile.onboarded) return [];
    return scholarships
      .map(s => ({ ...s, ...checkScholarshipEligibility(s, profile) }))
      .filter(s => s.eligible);
  }, [profile]);

  const calc = useMemo(() => {
    if (!uni) return null;
    const years = duration / 2;
    const tuitionPerYear = uni.tuition[0];
    const livingPerMonth = uni.costOfLiving;

    const totalTuition = tuitionPerYear * years;
    const totalLiving = livingPerMonth * MONTHS_PER_YEAR * years;
    const totalInsurance = 80 * MONTHS_PER_YEAR * years;
    const totalTravel = 300 * years; // round trip per year
    const totalCost = totalTuition + totalLiving + totalInsurance + totalTravel;

    // Income
    const scholarshipTotal = hasScholarship ? scholarshipAmount * MONTHS_PER_YEAR * years : 0;
    const workTotal = partTimeWork ? workHours * 4.3 * workWage * MONTHS_PER_YEAR * years : 0;
    const totalIncome = scholarshipTotal + workTotal + savings + (familySupport * MONTHS_PER_YEAR * years);

    const gap = totalCost - totalIncome;
    const monthlyBudget = livingPerMonth + (tuitionPerYear / MONTHS_PER_YEAR);
    const monthlyIncome = (hasScholarship ? scholarshipAmount : 0) + (partTimeWork ? workHours * 4.3 * workWage : 0) + familySupport;
    const monthlyGap = monthlyBudget - monthlyIncome;

    return {
      years, tuitionPerYear, livingPerMonth,
      totalTuition, totalLiving, totalInsurance, totalTravel, totalCost,
      scholarshipTotal, workTotal, totalIncome, gap,
      monthlyBudget, monthlyIncome, monthlyGap,
      breakdown: {
        rent: Math.round(livingPerMonth * COST_SPLIT.rent),
        food: Math.round(livingPerMonth * COST_SPLIT.food),
        transport: Math.round(livingPerMonth * COST_SPLIT.transport),
        other: Math.round(livingPerMonth * COST_SPLIT.other),
      }
    };
  }, [uni, duration, hasScholarship, scholarshipAmount, partTimeWork, workHours, workWage, savings, familySupport]);

  const fmt = n => `€${Math.round(n).toLocaleString()}`;

  return (
    <div style={{ padding: '32px 0' }} className="page-enter">
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>
        💰 Калкулатор на разходите
      </h2>
      <p style={{ color: '#71717A', fontSize: 13, marginBottom: 20 }}>
        Изчисли общите разходи и финансовия план за обучение в чужбина
      </p>

      {/* University selector */}
      <Card style={{ marginBottom: 16, padding: '18px 22px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#71717A', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>Университет</div>
        <select value={uniId} onChange={e => setUniId(e.target.value)}
          style={{ width: '100%', padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 13, fontFamily: 'inherit', background: '#0A0A0B', color: '#A1A1AA' }}>
          <option value="">Избери университет...</option>
          {profile.favorites.length > 0 && <optgroup label="Любими">
            {universities.filter(u => profile.favorites.includes(u.id)).sort((a,b) => a.rank - b.rank).map(u =>
              <option key={u.id} value={u.id}>{u.emoji} {u.nameEn} — {u.city}, {u.country}</option>
            )}
          </optgroup>}
          <optgroup label="Всички">
            {universities.sort((a, b) => a.rank - b.rank).map(u =>
              <option key={u.id} value={u.id}>{u.emoji} {u.nameEn} — {u.city}, {u.country}</option>
            )}
          </optgroup>
        </select>
      </Card>

      {uni && <>
        {/* Duration */}
        <Card style={{ marginBottom: 16, padding: '18px 22px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#71717A', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>Продължителност</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[6, 8, 4, 2].map(s => (
              <button key={s} onClick={() => setDuration(s)} style={{
                padding: '8px 16px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                background: duration === s ? 'rgba(204,255,0,0.1)' : '#161618',
                border: duration === s ? '1px solid #CCFF00' : '1px solid rgba(255,255,255,0.08)',
                color: duration === s ? '#CCFF00' : '#A1A1AA', cursor: 'pointer', fontFamily: 'inherit',
              }}>{s} сем. ({s/2}г.)</button>
            ))}
          </div>
        </Card>

        {/* Monthly breakdown */}
        <Card style={{ marginBottom: 16, padding: '18px 22px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📊</span> Месечни разходи в {uni.city}
          </div>
          {[
            ['🏠 Наем', calc.breakdown.rent],
            ['🍕 Храна', calc.breakdown.food],
            ['🚌 Транспорт', calc.breakdown.transport],
            ['📱 Други', calc.breakdown.other],
            ['🏥 Осигуровка', 80],
            ['🎓 Такса (месечно)', Math.round(calc.tuitionPerYear / 12)],
          ].map(([label, val], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.06)' : 'none', fontSize: 13 }}>
              <span style={{ color: '#A1A1AA' }}>{label}</span>
              <span style={{ fontWeight: 500, color: '#fff' }}>{fmt(val)}/мес</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 4px', fontSize: 15, fontWeight: 700 }}>
            <span style={{ color: '#CCFF00' }}>Общо месечно</span>
            <span style={{ color: '#CCFF00', fontFamily: "'Space Grotesk',sans-serif" }}>{fmt(calc.monthlyBudget + 80)}/мес</span>
          </div>
        </Card>

        {/* Income sources */}
        <Card style={{ marginBottom: 16, padding: '18px 22px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💸</span> Приходи & Финансиране
          </div>

          {/* Scholarship */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <input type="checkbox" checked={hasScholarship} onChange={e => setHasScholarship(e.target.checked)} style={{ accentColor: '#CCFF00' }} />
              <span style={{ fontSize: 13, color: '#A1A1AA' }}>Стипендия</span>
            </label>
            {hasScholarship && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 28 }}>
                <input type="range" min={100} max={1500} step={50} value={scholarshipAmount} onChange={e => setScholarshipAmount(+e.target.value)}
                  style={{ flex: 1, accentColor: '#CCFF00' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#CCFF00', minWidth: 70, textAlign: 'right' }}>{fmt(scholarshipAmount)}/мес</span>
              </div>
            )}
            {eligibleScholarships.length > 0 && (
              <div style={{ marginLeft: 28, marginTop: 6, fontSize: 11, color: '#22C55E' }}>
                {eligibleScholarships.length} подходящи стипендии за твоя профил
                {onNavigate && <button onClick={() => onNavigate('scholarships')} style={{ marginLeft: 6, fontSize: 10, color: '#818CF8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Виж →</button>}
              </div>
            )}
          </div>

          {/* Part-time work */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <input type="checkbox" checked={partTimeWork} onChange={e => setPartTimeWork(e.target.checked)} style={{ accentColor: '#CCFF00' }} />
              <span style={{ fontSize: 13, color: '#A1A1AA' }}>Работа на непълно работно време</span>
            </label>
            {partTimeWork && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginLeft: 28 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#71717A', marginBottom: 4 }}>Часове/седмица</div>
                  <input type="number" min={4} max={20} value={workHours} onChange={e => setWorkHours(+e.target.value)}
                    style={{ width: '100%', padding: 8, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, background: '#0A0A0B', color: '#A1A1AA', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#71717A', marginBottom: 4 }}>Заплата €/час</div>
                  <input type="number" min={5} max={25} value={workWage} onChange={e => setWorkWage(+e.target.value)}
                    style={{ width: '100%', padding: 8, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, background: '#0A0A0B', color: '#A1A1AA', fontFamily: 'inherit' }} />
                </div>
              </div>
            )}
          </div>

          {/* Family support */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#71717A', marginBottom: 4 }}>Подкрепа от семейство (€/мес)</div>
            <input type="range" min={0} max={1500} step={50} value={familySupport} onChange={e => setFamilySupport(+e.target.value)}
              style={{ width: '100%', accentColor: '#CCFF00' }} />
            <div style={{ fontSize: 12, color: '#A1A1AA', textAlign: 'right' }}>{fmt(familySupport)}/мес</div>
          </div>

          {/* Savings */}
          <div>
            <div style={{ fontSize: 10, color: '#71717A', marginBottom: 4 }}>Спестявания (еднократно)</div>
            <input type="number" min={0} step={500} value={savings} onChange={e => setSavings(+e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, background: '#0A0A0B', color: '#A1A1AA', fontFamily: 'inherit' }} />
          </div>
        </Card>

        {/* Summary */}
        <Card glow style={{ marginBottom: 16, padding: '22px 24px', background: calc.gap <= 0 ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)', border: `1px solid ${calc.gap <= 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            {calc.gap <= 0 ? '✅' : '⚠️'} Финансов план за {calc.years} години
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ textAlign: 'center', padding: 14, background: 'rgba(239,68,68,0.08)', borderRadius: 12 }}>
              <div style={{ fontSize: 10, color: '#71717A', marginBottom: 4 }}>Общо разходи</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: '#EF4444' }}>{fmt(calc.totalCost)}</div>
            </div>
            <div style={{ textAlign: 'center', padding: 14, background: 'rgba(34,197,94,0.08)', borderRadius: 12 }}>
              <div style={{ fontSize: 10, color: '#71717A', marginBottom: 4 }}>Общо приходи</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: '#22C55E' }}>{fmt(calc.totalIncome)}</div>
            </div>
          </div>

          {/* Detail rows */}
          <div style={{ marginBottom: 14 }}>
            {[
              ['Такси за обучение', calc.totalTuition, '#EF4444'],
              ['Разходи за живот', calc.totalLiving, '#EF4444'],
              ['Осигуровка', calc.totalInsurance, '#EF4444'],
              ['Пътуване', calc.totalTravel, '#EF4444'],
            ].map(([label, val, color], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
                <span style={{ color: '#71717A' }}>- {label}</span>
                <span style={{ color }}>{fmt(val)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 6, paddingTop: 6 }}>
              {[
                hasScholarship && ['Стипендия', calc.scholarshipTotal, '#22C55E'],
                partTimeWork && ['Работа', calc.workTotal, '#22C55E'],
                familySupport > 0 && ['Семейство', familySupport * 12 * calc.years, '#22C55E'],
                savings > 0 && ['Спестявания', savings, '#22C55E'],
              ].filter(Boolean).map(([label, val, color], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
                  <span style={{ color: '#71717A' }}>+ {label}</span>
                  <span style={{ color }}>{fmt(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gap / surplus */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '2px solid rgba(255,255,255,0.08)', fontSize: 16, fontWeight: 700 }}>
            <span style={{ color: '#fff' }}>{calc.gap <= 0 ? 'Излишък' : 'Нужно допълнително'}</span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", color: calc.gap <= 0 ? '#22C55E' : '#EF4444' }}>{fmt(Math.abs(calc.gap))}</span>
          </div>

          {/* Monthly summary */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 10, padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#71717A' }}>Месечни разходи</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#EF4444', fontFamily: "'Space Grotesk',sans-serif" }}>{fmt(calc.monthlyBudget + 80)}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#71717A' }}>Месечни приходи</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#22C55E', fontFamily: "'Space Grotesk',sans-serif" }}>{fmt(calc.monthlyIncome)}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#71717A' }}>{calc.monthlyGap + 80 <= 0 ? 'Излишък/мес' : 'Дефицит/мес'}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: (calc.monthlyGap + 80) <= 0 ? '#22C55E' : '#F59E0B', fontFamily: "'Space Grotesk',sans-serif" }}>{fmt(Math.abs(calc.monthlyGap + 80))}</div>
            </div>
          </div>
        </Card>

        {/* Tips */}
        {calc.gap > 0 && (
          <Card style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#F59E0B', marginBottom: 10 }}>💡 Препоръки за покриване на разликата</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {!hasScholarship && (
                <div style={{ fontSize: 12, color: '#A1A1AA', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span>🎯</span> <span>Кандидатствай за стипендия — {eligibleScholarships.length > 0 ? `имаш ${eligibleScholarships.length} подходящи` : 'разгледай наличните'}</span>
                </div>
              )}
              {!partTimeWork && (
                <div style={{ fontSize: 12, color: '#A1A1AA', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span>💼</span> <span>Работа на непълно време (10ч/седм.) може да покрие ~{fmt(10 * 4.3 * 10)}/мес</span>
                </div>
              )}
              <div style={{ fontSize: 12, color: '#A1A1AA', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span>🏠</span> <span>Търси споделено жилище — може да спестиш 30-40% от наема</span>
              </div>
              <div style={{ fontSize: 12, color: '#A1A1AA', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span>🍳</span> <span>Готви вкъщи вместо да ядеш навън — спестява ~€100-150/мес</span>
              </div>
            </div>
          </Card>
        )}
      </>}

      {!uni && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>💰</div>
          <p style={{ color: '#71717A', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
            Избери университет отгоре, за да видиш детайлна разбивка на разходите, възможности за финансиране и месечен бюджет.
          </p>
        </div>
      )}
    </div>
  );
}
