import Anthropic from '@anthropic-ai/sdk';
import { universities } from '../src/data/universities.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Compact university table for the system prompt (~3K tokens total)
const uniTable = universities.map(u =>
  `${u.emoji} ${u.nameEn} | ${u.country}, ${u.city} | #${u.rank} | Такса:€${u.tuition[0]}–${u.tuition[1]}/год | Живот:€${u.costOfLiving}/мес | Рейтинг:${u.rating}/5 | Прием:${u.acceptance}% | Заетост:${u.employability}% | ${u.fields.slice(0, 3).join('/')} | ${u.programs.slice(0, 3).join(', ')}`
).join('\n');

function buildSystem() {
  const now = new Date();
  const currentDate = now.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });
  const currentYear = now.getFullYear();
  const academicYear = now.getMonth() >= 7
    ? `${currentYear}/${currentYear + 1}`
    : `${currentYear - 1}/${currentYear}`;
  const nextAcademicYear = now.getMonth() >= 7
    ? `${currentYear + 1}/${currentYear + 2}`
    : `${currentYear}/${currentYear + 1}`;

  return `Ти си AI съветник "Find The Uni" — платформа помагаща на български ученици да намерят университет в Европа. Отговаряй САМО НА БЪЛГАРСКИ. Бъди конкретен и сбит (max 160 думи). Използвай emoji умерено. Когато цитираш университети, включвай конкретни числа от базата данни.

ТЕКУЩА ДАТА: ${currentDate}
ТЕКУЩА УЧЕБНА ГОДИНА: ${academicYear}
СЛЕДВАЩА УЧЕБНА ГОДИНА (за кандидатстване): ${nextAcademicYear}
ВАЖНО: Винаги посочвай че данните са актуални към ${currentYear} г. и препоръчвай проверка на официалния сайт за такси/срокове.

БАЗА ДАННИ — ${universities.length} УНИВЕРСИТЕТА:
${uniTable}

КЛЮЧОВИ ФАКТИ (актуални ${currentYear}):
• Безплатно: Германия (€0+€350/сем администрация), Норвегия (напълно), Финландия (EU/EEA), Чехия/Полша (на местен език), Гърция/Австрия (EU €0–1500)
• Виза: EU граждани → без виза в EU, само местна регистрация. UK → Student visa £490 + IHS £776/год. здравна осигуровка. Швейцария → разрешение СЛЕД пристигане.
• Работа (мин. заплата ${currentYear}): Германия 20ч/сед €12.82/ч; UK 20ч/сед £12.21/ч; Нидерландия 16ч/сед €13.68/ч; Франция 964ч/год €11.88/ч; Ирландия 20ч/сед €13.50/ч; Скандинавия/Чехия/Полша без ограничение за EU; Швейцария 15ч/сед след 6 мес.
• Сертификати: IELTS 6.5+ (~€220); TOEFL iBT 90+ (~€260); Goethe B2/C1 (~€150); TestDaF 4-4 (~€200); DELF B2 (~€120)
• Нострификация: ДЗИ е призната автоматично в EU по Болонски процес. UK ENIC признава директно.
• Срокове за ${nextAcademicYear}: UK-UCAS 15 яну (Oxford/Cam: 15 окт); Германия 1–15 юли (зим.) / 1–15 дек. (лет.); Нидерландия 1 май (EU) / 1 апр (non-EU); Швеция 15 яну; Норвегия 15 апр; ETH/EPFL 30 апр; Финландия 20 яну; Ирландия 1 фев; Дания 15 март; Унгария 15 фев; България юли (след ДЗИ)
• Приемни: Германия → Abitur+DSH/TestDaF; UK → A-Levels+Personal Statement; Скандинавия → само оценки, БЕЗ изпит; Швейцария → вход. изпит за чужденци
• Стипендии: Erasmus+ €820–1200/мес; DAAD €934/мес (DE); Chevening пълна (UK); SI SEK 10000/мес (SE); Eiffel €1181/мес (FR)
• Разходи на живот (${currentYear}): София ~€500; Прага ~€700; Варшава ~€600; Берлин ~€950; Париж ~€1200; Лондон ~€1500; Цюрих ~€1650`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message, history = [] } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Missing message' });

  // Keep last 8 messages as context (4 exchanges)
  const messages = [
    ...history.slice(-8).map(m => ({
      role: m.from === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
    { role: 'user', content: message },
  ];

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 450,
      system: buildSystem(),
      messages,
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(500).json({ error: 'AI временно недостъпен' });
  }
}
