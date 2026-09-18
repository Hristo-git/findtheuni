// Търсене по свободен текст с разбиране на областите.
//
// Заявката се разбива на думи и всяка дума трябва да съвпадне с нещо —
// държава, град, име, област или програма. Затова „Италия бизнес" връща
// италианските университети с бизнес, а само „архитектура" — всички с
// архитектура, независимо от държавата.

import { allFields } from '../data/universities.js';

// Думи, които носят смисъл в изречение, но не и за търсенето.
// Без тях „Искам да уча дизайн в Нидерландия" се свежда до „дизайн нидерландия".
const STOP_WORDS = new Set([
  'искам', 'иска', 'бих', 'да', 'уча', 'уча', 'следвам', 'запиша', 'кандидатствам',
  'в', 'във', 'на', 'за', 'и', 'с', 'със', 'по', 'от', 'до', 'при', 'или',
  'ми', 'си', 'се', 'е', 'са', 'най', 'къде', 'как', 'кои', 'кой',
  'университет', 'университети', 'уни', 'специалност', 'специалности',
  'програма', 'програми', 'държава', 'държави', 'град', 'градове',
  'study', 'studying', 'in', 'at', 'the', 'a', 'an', 'i', 'want', 'to', 'for',
  'university', 'universities', 'uni', 'programme', 'program',
]);

// Всяка област с думите, с които реален човек би я потърсил.
const FIELD_SYNONYMS = {
  'IT': ['it', 'ит', 'информатика', 'информационни', 'компютри', 'компютърни', 'софтуер', 'софтуерно', 'програмиране', 'програмист', 'кодене', 'cs', 'computer', 'computing', 'software'],
  'Инженерство': ['инженерство', 'инженер', 'инженерно', 'engineering'],
  'Медицина': ['медицина', 'медицински', 'медик', 'лекар', 'доктор', 'medicine', 'medical'],
  'Бизнес': ['бизнес', 'мениджмънт', 'менажмънт', 'управление', 'предприемачество', 'business', 'management', 'mba', 'bba'],
  'Право': ['право', 'правен', 'юрист', 'юридически', 'адвокат', 'law', 'legal'],
  'Природни науки': ['природни', 'natural'],
  'Хуманитарни': ['хуманитарни', 'humanities'],
  'Изкуства': ['изкуства', 'изкуство', 'арт', 'art', 'arts'],
  'Дизайн': ['дизайн', 'design'],
  'Архитектура': ['архитектура', 'архитект', 'архитектурен', 'architecture'],
  'Финанси': ['финанси', 'финансов', 'finance'],
  'Маркетинг': ['маркетинг', 'marketing'],
  'Икономика': ['икономика', 'икономически', 'economics', 'economy'],
  'Фармация': ['фармация', 'фармацевт', 'pharmacy'],
  'Педагогика': ['педагогика', 'педагог', 'учител', 'образование', 'education'],
  'Електроника': ['електроника', 'електронен', 'electronics'],
};


/** Разбива заявка на значещи думи. */
export function tokenize(query) {
  return String(query || '')
    .toLowerCase()
    .split(/[\s,.;/+&-]+/)
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t));
}

/** Коя област (ако изобщо) стои зад дадена дума. */
export function fieldForToken(token) {
  for (const [field, words] of Object.entries(FIELD_SYNONYMS)) {
    if (words.some(w => w === token || (token.length >= 4 && w.startsWith(token)) || (w.length >= 4 && token.startsWith(w)))) {
      return field;
    }
  }
  // Резервен вариант: самото име на областта, ако е в данните.
  const direct = allFields.find(f => f.toLowerCase().startsWith(token) && token.length >= 3);
  return direct || null;
}

/** Съвпада ли думата с програма — пряко или през синонимите на областта ѝ. */
function programHit(u, token) {
  if (u.programs.some(p => p.toLowerCase().includes(token))) return true;
  const field = fieldForToken(token);
  const words = field ? FIELD_SYNONYMS[field] || [] : [];
  return words.some(w => w.length >= 4 && u.programs.some(p => p.toLowerCase().includes(w)));
}

function textHit(u, token) {
  return u.name.toLowerCase().includes(token)
    || u.nameEn.toLowerCase().includes(token)
    || u.city.toLowerCase().includes(token)
    || u.country.toLowerCase().includes(token)
    || u.fields.some(f => f.toLowerCase().includes(token))
    || u.languages.some(l => l.toLowerCase().includes(token))
    || u.programs.some(p => p.toLowerCase().includes(token));
}

/** Съвпада ли университетът с всички думи в заявката. */
export function matchesQuery(u, query) {
  const tokens = tokenize(query);
  if (!tokens.length) return true;
  return tokens.every(t => {
    const field = fieldForToken(t);
    return (field && u.fields.includes(field)) || textHit(u, t);
  });
}

/**
 * Как приложението е разчело заявката — за да е видимо на потребителя.
 * @returns {{fields: string[], countries: string[], other: string[]}}
 */
export function explainQuery(query, universities) {
  const tokens = tokenize(query);
  const fields = [], countries = [], other = [];
  for (const t of tokens) {
    const field = fieldForToken(t);
    if (field && !fields.includes(field)) { fields.push(field); continue; }
    const country = universities.find(u => u.country.toLowerCase().startsWith(t))?.country;
    if (country && !countries.includes(country)) { countries.push(country); continue; }
    other.push(t);
  }
  return { fields, countries, other };
}

/** Кои области и програми на този университет са причина да излезе в резултата. */
export function searchHighlights(u, query) {
  const tokens = tokenize(query);
  if (!tokens.length) return { fields: [], programs: [] };
  const fields = u.fields.filter(f =>
    tokens.some(t => fieldForToken(t) === f || f.toLowerCase().includes(t)));
  const programs = u.programs.filter(p =>
    tokens.some(t => p.toLowerCase().includes(t)
      || (FIELD_SYNONYMS[fieldForToken(t)] || []).some(w => w.length >= 4 && p.toLowerCase().includes(w))));
  return { fields, programs };
}

/**
 * Колко силно съвпада университетът — име и програма тежат повече от
 * това просто да е тагнат с областта.
 */
export function relevanceScore(u, query) {
  const tokens = tokenize(query);
  let score = 0;
  for (const t of tokens) {
    if (u.name.toLowerCase().includes(t) || u.nameEn.toLowerCase().includes(t)) score += 4;
    else if (programHit(u, t)) score += 3;
    else if (u.city.toLowerCase().includes(t) || u.country.toLowerCase().includes(t)) score += 2;
    else if (u.fields.some(f => f.toLowerCase().includes(t))) score += 1.5;
    else if (fieldForToken(t) && u.fields.includes(fieldForToken(t))) score += 1;
  }
  return score;
}
