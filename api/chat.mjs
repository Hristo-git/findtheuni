import Anthropic from '@anthropic-ai/sdk';
import { universities } from '../src/data/universities.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Compact university table for the system prompt (~3K tokens total)
const uniTable = universities.map(u =>
  `${u.emoji} ${u.nameEn} | ${u.country}, ${u.city} | #${u.rank} | Такса:€${u.tuition[0]}–${u.tuition[1]}/год | Живот:€${u.costOfLiving}/мес | Рейтинг:${u.rating}/5 | Прием:${u.acceptance}% | Заетост:${u.employability}% | ${u.fields.slice(0, 3).join('/')} | ${u.programs.slice(0, 3).join(', ')}`
).join('\n');

const SYSTEM = `Ти си AI съветник "Find The Uni" — платформа помагаща на български ученици да намерят университет в Европа. Отговаряй САМО НА БЪЛГАРСКИ. Бъди конкретен и сбит (max 160 думи). Използвай emoji умерено. Когато цитираш университети, включвай конкретни числа от базата данни.

БАЗА ДАННИ — ${universities.length} УНИВЕРСИТЕТА:
${uniTable}

КЛЮЧОВИ ФАКТИ:
• Безплатно: Германия (€0+€300/сем), Норвегия (напълно), Финландия (EU), Чехия/Полша (на местен език), Гърция/Австрия (EU €0–1500)
• Виза: EU граждани → без виза в EU, само местна регистрация. UK → Student visa £363+£1334/год. Швейцария → разрешение СЛЕД пристигане.
• Работа: Германия/UK/Австрия 20ч/сед; Скандинавия/Чехия/Полша без ограничение за EU; Швейцария 15ч/сед след 6 мес.
• Сертификати: IELTS 6.5+/TOEFL 90+ за англ.; Goethe B2/TestDaF за немски; DELF B2 за френски
• Нострификация: ДЗИ е призната автоматично в EU по Болонски процес. UK ENIC/NARIC признава директно.
• Срокове: UK-UCAS 15 яну; Германия 1–15 юли; Нидерландия 1 май; Швеция 15 яну; Норвегия 15 апр; ETH/EPFL 30 апр; Финландия 20 яну; Ирландия 1 фев
• Приемни: Германия → Abitur+DSH/TestDaF; UK → A-Levels+Personal Statement; Скандинавия → само оценки, БЕЗ изпит; Швейцария → вход. изпит за чужденци
• Стипендии: Erasmus+ €800–1200/мес; DAAD €934/мес (DE); Chevening (UK пълна); SI Scholarship (SE); Eiffel €1181/мес (FR)`;

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
      system: SYSTEM,
      messages,
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(500).json({ error: 'AI временно недостъпен' });
  }
}
