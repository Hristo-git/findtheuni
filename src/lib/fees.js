// Каква такса реално плаща български (EU) студент.
//
// В данните таксата е диапазон [min, max], но диапазонът значи различно нещо
// в различните държави. Затова първо определяме модела, после коя граница важи:
//
//   eu       долната граница е тарифата за EU граждани, горната — за студенти извън EU
//   intl     Обединеното кралство: след Brexit българите плащат международната тарифа
//   language държави, в които обучението на местния език е безплатно или субсидирано
//   income   Италия: таксата зависи от дохода на семейството (ISEE)
//   private  частен университет — диапазонът е по програма, не по студент
//   flat     една и съща такса за всички

const LOCAL_LANGUAGE_FREE = new Set([
  'България', 'Полша', 'Чехия', 'Словакия', 'Словения',
  'Унгария', 'Румъния', 'Хърватия', 'Гърция', 'Сърбия',
]);

export function feeModel(u) {
  if (u.tuition[0] === u.tuition[1]) return 'flat';
  if (u.type === 'private') return 'private';
  if (u.country === 'UK') return 'intl';
  if (u.country === 'Италия') return 'income';
  if (LOCAL_LANGUAGE_FREE.has(u.country)) return 'language';
  return 'eu';
}

const eur = n => `€${n}`;
const span = (a, b) => `€${a}–${b}`;

/**
 * @returns {{exact: number|null, label: string, why: string, model: string}}
 *   exact — таксата в евро/година, когато е определима; null, когато остава диапазон.
 */
export function tuitionFor(u, profile = {}) {
  const [min, max] = u.tuition;
  const model = feeModel(u);

  switch (model) {
    case 'flat':
      return { exact: min, label: min === 0 ? 'Безплатно' : eur(min), why: 'Еднаква такса за всички студенти.', model };

    case 'intl':
      return {
        exact: max, label: `до ${eur(max)}`, model,
        why: `След Brexit българите плащат международната тарифа, която зависи от специалността. ${eur(min)} важи само за студенти с местен статут.`,
      };

    case 'eu':
      return {
        exact: min, label: min === 0 ? 'Безплатно' : eur(min), model,
        why: `Тарифа за граждани на EU. ${eur(max)} важи за студенти извън EU.`,
      };

    case 'language': {
      if (profile.langPref === 'local') {
        return {
          exact: min, label: min === 0 ? 'Безплатно' : eur(min), model,
          why: `Програмите на местния език са субсидирани за EU граждани. На английски: ${eur(max)}.`,
        };
      }
      if (profile.langPref) {
        return {
          exact: max, label: `до ${eur(max)}`, model,
          why: `Англоезичните програми се плащат, като медицината е най-скъпата. На местния език: ${min === 0 ? 'безплатно' : eur(min)}.`,
        };
      }
      return {
        exact: null, label: span(min, max), model,
        why: `Зависи от езика: ${min === 0 ? 'безплатно' : eur(min)} на местния език, ${eur(max)} на английски.`,
      };
    }

    case 'income':
      return {
        exact: null, label: span(min, max), model,
        why: 'Зависи от дохода на семейството (ISEE). При нисък доход таксата е €0 — плаща се само ~€140 регионален налог.',
      };

    case 'private':
    default:
      return {
        exact: null, label: span(min, max), model,
        why: 'Частен университет — таксата зависи от конкретната програма.',
      };
  }
}

/**
 * Число за сметки и подредба. Когато таксата остава диапазон, връща средата —
 * нито оптимистично, нито песимистично.
 */
export function tuitionEstimate(u, profile = {}) {
  const { exact } = tuitionFor(u, profile);
  return exact ?? Math.round((u.tuition[0] + u.tuition[1]) / 2);
}
