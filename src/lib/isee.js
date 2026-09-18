// Оценка на ISEE и на италианската помощ (такса + стипендия DSU).
//
// ISEE е италианският показател за икономическото състояние на домакинството:
//   ISEE = (доход + 20% от имуществото) / скала на еквивалентност
// Скалата е по брой членове на домакинството (DPCM 159/2013, Приложение 1).
//
// ВАЖНО: това е ОЦЕНКА, не официално изчисление. Истинският ISEE се издава от
// CAF (за чуждестранни доходи — „ISEE parificato") и взема предвид неща, които
// тук не моделираме: приспадания за наем, кадастрална (не пазарна) стойност на
// имотите, увеличения при три и повече деца или член с увреждане. Затова
// резултатите са ленти, а не точни суми.

// ─── Скала на еквивалентност (DPCM 159/2013, Приложение 1) ───
const EQUIVALENCE = [1.00, 1.57, 2.04, 2.46, 2.85];
const EQUIVALENCE_STEP = 0.35; // за всеки член над петия

export function equivalenceScale(size) {
  const n = Math.max(1, Math.round(size || 1));
  if (n <= EQUIVALENCE.length) return EQUIVALENCE[n - 1];
  return EQUIVALENCE[EQUIVALENCE.length - 1] + (n - EQUIVALENCE.length) * EQUIVALENCE_STEP;
}

// ─── Прагове и суми за учебната 2026/27 ───
// Такси: национален праг на MUR (no tax area) и таванът по Закон 232/2016.
export const NO_TAX_AREA = 22000;
const CAP_BASE = 13000;      // таванът се смята върху разликата над тази сума
const CAP_RATE = 0.07;       // и не може да надхвърли 7% от нея
const CAP_CEILING = 30000;   // таванът важи до този ISEE
export const REGIONAL_TAX = 140; // регионален налог, дължи се и при нулева такса

// Стипендии DSU: Декрети на MUR 175/2026 и 176/2026.
export const DSU_ISEE_MAX = 28339.88;
export const DSU_ISPE_MAX = 61608.48;
export const DSU_AMOUNT = { fuoriSede: 7171.11, pendolare: 4190.71, inSede: 2890.16 };

/**
 * Оценка на ISEE по въведените от потребителя данни.
 * @param {{income:number, size:number, assets?:number}} household
 *   income — годишен нетен доход на цялото домакинство в евро
 *   size   — брой членове на домакинството
 *   assets — спестявания и имоти извън основното жилище (по желание)
 * @returns {number|null}
 */
export function estimateIsee(household = {}) {
  const { income, size, assets = 0 } = household;
  if (typeof income !== 'number' || !isFinite(income) || income < 0) return null;
  const ise = income + 0.2 * Math.max(0, assets || 0);
  return Math.round(ise / equivalenceScale(size));
}

/**
 * Каква такса се очаква при даден ISEE в италиански държавен университет.
 * @returns {{exact:number|null, upTo:number|null, band:string}}
 */
export function italyTuition(u, isee) {
  const max = u.tuition[1];
  if (isee <= NO_TAX_AREA) return { exact: 0, upTo: null, band: 'no-tax-area' };
  if (isee <= CAP_CEILING) {
    return { exact: null, upTo: Math.min(Math.round(CAP_RATE * (isee - CAP_BASE)), max), band: 'capped' };
  }
  return { exact: null, upTo: max, band: 'full' };
}

/**
 * Пълната картина за италиански държавен университет: такса + стипендия.
 * Български студент винаги е „fuori sede" — живее далеч от дома си.
 */
export function italyAid(u, household = {}) {
  const isee = estimateIsee(household);
  if (isee === null) return null;

  const tuition = italyTuition(u, isee);
  const dsuEligible = isee <= DSU_ISEE_MAX;
  const dsuAmount = dsuEligible ? Math.round(DSU_AMOUNT.fuoriSede) : 0;

  // Стипендиантите се освобождават от такса независимо от лентата.
  const feeIfScholarship = dsuEligible ? 0 : null;

  return {
    isee,
    tuition,
    dsuEligible,
    dsuAmount,
    feeIfScholarship,
    regionalTax: REGIONAL_TAX,
    // Нетен ефект за година: стипендия минус това, което остава да платиш.
    netPerYear: dsuEligible
      ? dsuAmount - REGIONAL_TAX
      : -((tuition.exact ?? tuition.upTo ?? 0) + REGIONAL_TAX),
  };
}
