// Сглобява изискванията за кандидатстване за конкретен университет:
// правилата на държавата + изпитите за неговите области + собствената му
// процедура, ако има такава.

import { countryAdmissions, medicineExams, fieldRequirements, uniAdmissions, ownProcedure } from '../data/admissions.js';
import { countryGuides } from '../data/countryData.js';

/**
 * Типично ниво на английски. Данните за точния праг са на ниво програма,
 * затова тук се дава диапазонът, който отговаря на селективността.
 */
export function englishLevel(u) {
  if (u.rank && u.rank <= 50) return 'IELTS 7.0 / TOEFL iBT 100';
  if ((u.rank && u.rank <= 200) || u.acceptance <= 20) return 'IELTS 6.5 / TOEFL iBT 90';
  return 'IELTS 6.0–6.5 / TOEFL iBT 80–90';
}

/**
 * @returns {{
 *   country: string, portal: string, diploma: string, language: string,
 *   english: string, deadline: string|null, tests: string[],
 *   fieldNotes: {field: string, text: string}[], uniNote: string|null
 * }|null}
 */
export function admissionsFor(u) {
  const base = countryAdmissions[u.country];
  if (!base) return null;

  const guide = countryGuides.find(g => (g.country || g.name) === u.country);

  const fieldNotes = [];
  for (const field of u.fields) {
    if (field === 'Медицина') {
      const exam = medicineExams[u.country];
      if (exam) { fieldNotes.push({ field: 'Медицина', text: exam }); continue; }
    }
    const note = fieldRequirements[field];
    if (note && field !== 'Медицина') fieldNotes.push({ field, text: note });
  }

  return {
    country: u.country,
    portal: base.portal,
    diploma: base.diploma,
    language: base.language,
    english: englishLevel(u),
    deadline: guide?.deadlines || null,
    tests: ownProcedure.has(u.id) ? [] : (base.tests || []),
    note: base.note || null,
    fieldNotes,
    uniNote: uniAdmissions[u.id] || null,
    ownProcedure: ownProcedure.has(u.id),
  };
}
