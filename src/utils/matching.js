import { universities } from '../data/universities';
import { countryGuides } from '../data/countryData';

/**
 * Calculate university match score (0-100) based on user profile
 */
export function calcMatch(u, profile) {
  if (!profile.onboarded) return null;
  let score = 0, max = 0;

  // Field overlap (30 pts)
  if (profile.fields.length > 0) {
    const overlap = u.fields.filter(f => profile.fields.includes(f)).length;
    score += (overlap / Math.max(profile.fields.length, 1)) * 30;
  } else score += 15;
  max += 30;

  // Budget fit (25 pts)
  if (profile.budget > 0) {
    const monthlyTotal = u.costOfLiving + (u.tuition[0] / 12);
    score += monthlyTotal <= profile.budget ? 25 : monthlyTotal <= profile.budget * 1.3 ? 15 : 5;
  } else score += 12;
  max += 25;

  // Language preference (20 pts)
  if (profile.langPref === 'en') score += u.international > 15 ? 20 : 10;
  else if (profile.langPref === 'de') score += ['Германия','Австрия','Швейцария'].includes(u.country) ? 20 : 5;
  else if (profile.langPref === 'fr') score += ['Франция','Швейцария','Белгия'].includes(u.country) ? 20 : 5;
  else if (profile.langPref === 'local') score += u.tuition[0] === 0 ? 20 : 10;
  else score += 10;
  max += 20;

  // Ranking (15 pts)
  score += u.rank <= 100 ? 15 : u.rank <= 300 ? 12 : u.rank <= 600 ? 8 : 4;
  max += 15;

  // Employability (10 pts)
  score += (u.employability / 100) * 10;
  max += 10;

  return Math.round((score / max) * 100);
}

/**
 * Country-to-language mapping for matching
 */
const countryLangMap = {
  bg: 'local', de: 'de', uk: 'en', nl: 'en', fr: 'fr', se: 'en',
  dk: 'en', no: 'en', fi: 'en', ch: 'de', at: 'de', be: 'fr',
  ie: 'en', es: 'local', it: 'local', pt: 'local', pl: 'local',
  cz: 'local', gr: 'local', ro: 'local', hr: 'local', rs: 'local', hu: 'local',
};

/**
 * Calculate country match score (0-100) based on user profile
 * Uses budget, language preference, fields availability, and free tuition preference
 */
export function calcCountryMatch(country, profile) {
  if (!profile.onboarded) return null;
  let score = 0, max = 0;

  // Budget fit (35 pts) — most important for students
  if (profile.budget > 0) {
    const ratio = profile.budget / country.cost;
    if (ratio >= 1.3) score += 35;      // very comfortable
    else if (ratio >= 1.0) score += 28;  // comfortable
    else if (ratio >= 0.8) score += 18;  // tight but possible
    else score += 5;                      // too expensive
  } else score += 17;
  max += 35;

  // Language match (25 pts)
  const countryLang = countryLangMap[country.id] || 'local';
  if (profile.langPref) {
    if (profile.langPref === countryLang) score += 25;
    else if (profile.langPref === 'en' && ['en', 'nl', 'se', 'dk', 'no', 'fi'].includes(country.id)) score += 22; // English-friendly countries
    else if (profile.langPref === 'en' && country.id === 'de') score += 15; // Germany has some EN programs
    else score += 5;
  } else score += 12;
  max += 25;

  // Field availability (25 pts)
  if (profile.fields.length > 0) {
    const countryUnis = universities.filter(u => {
      const guideName = country.name;
      return u.country === guideName;
    });
    const availableFields = [...new Set(countryUnis.flatMap(u => u.fields))];
    const overlap = profile.fields.filter(f => availableFields.includes(f)).length;
    score += (overlap / profile.fields.length) * 25;
  } else score += 12;
  max += 25;

  // University quality (15 pts) — based on top uni ranking
  const countryUnis = universities.filter(u => u.country === country.name).sort((a, b) => a.rank - b.rank);
  if (countryUnis.length > 0) {
    const bestRank = countryUnis[0].rank;
    score += bestRank <= 50 ? 15 : bestRank <= 150 ? 12 : bestRank <= 400 ? 8 : 4;
  }
  max += 15;

  return Math.round((score / max) * 100);
}

/**
 * Get ranked countries based on profile
 * Returns countryGuides sorted by match score
 */
export function getRankedCountries(profile) {
  if (!profile.onboarded) return countryGuides;

  return countryGuides
    .map(c => ({
      ...c,
      matchScore: calcCountryMatch(c, profile),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Check scholarship eligibility against profile
 */
export function checkScholarshipEligibility(scholarship, profile) {
  if (!profile.onboarded) return { eligible: false, reasons: [] };

  const reasons = [];
  let eligible = true;

  // Level match
  const levelMap = { bachelor: 'Бакалавър', master: 'Магистър', phd: 'Докторат' };
  const userLevel = levelMap[profile.level];
  if (userLevel && !scholarship.level.includes(userLevel)) {
    eligible = false;
    reasons.push(`Изисква ${scholarship.level.join(' или ')}`);
  }

  // Field match
  if (scholarship.fields[0] !== 'Всички' && profile.fields.length > 0) {
    const fieldOverlap = scholarship.fields.some(f => profile.fields.includes(f));
    if (!fieldOverlap) {
      eligible = false;
      reasons.push(`За области: ${scholarship.fields.join(', ')}`);
    }
  }

  return { eligible, reasons, matchScore: eligible ? 100 : 0 };
}

/**
 * Get recommended universities sorted by match score
 * Returns top N universities with scores
 */
export function getRecommendedUnis(profile, limit = 10) {
  if (!profile.onboarded) return [];

  return universities
    .map(u => ({ ...u, matchScore: calcMatch(u, profile) }))
    .filter(u => u.matchScore !== null && u.matchScore >= 40)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
