/**
 * Step 1: Fetch all European universities from HEI API (European University Foundation)
 * Public API — no auth needed. Docs: https://hei.api.uni-foundation.eu/about
 *
 * Run: node scripts/fetchHEI.mjs
 * Output: scripts/hei_raw.json (~900 institutions)
 */

import { writeFileSync } from 'fs';

const BASE = 'https://hei.api.uni-foundation.eu/api/public';

// European countries we care about (ISO-3166 Alpha-2)
const EU_COUNTRIES = [
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR',
  'DE','GR','HU','IE','IT','LV','LT','LU','MT','NL',
  'PL','PT','RO','SK','SI','ES','SE','GB','NO','CH',
  'IS','AL','BA','ME','MK','RS',
];

// Bulgarian country names (matches format in universities.js)
const COUNTRY_BG = {
  AT:'Австрия', BE:'Белгия', BG:'България', HR:'Хърватия',
  CY:'Кипър', CZ:'Чехия', DK:'Дания', EE:'Естония',
  FI:'Финландия', FR:'Франция', DE:'Германия', GR:'Гърция',
  HU:'Унгария', IE:'Ирландия', IT:'Италия', LV:'Латвия',
  LT:'Литва', LU:'Люксембург', MT:'Малта', NL:'Нидерландия',
  PL:'Полша', PT:'Португалия', RO:'Румъния', SK:'Словакия',
  SI:'Словения', ES:'Испания', SE:'Швеция', GB:'UK',
  NO:'Норвегия', CH:'Швейцария', IS:'Исландия',
  AL:'Албания', BA:'Босна', ME:'Черна гора', MK:'Македония',
  RS:'Сърбия',
};

async function fetchCountry(iso) {
  try {
    const res = await fetch(`${BASE}/country/${iso}/hei`, {
      headers: { 'Accept': 'application/vnd.api+json' }
    });
    if (!res.ok) {
      console.warn(`  [${iso}] HTTP ${res.status} — skipped`);
      return [];
    }
    const json = await res.json();
    const items = json.data || [];
    return items.map(item => {
      const attr = item.attributes || {};
      return {
        hei_id:       item.id || attr.hei_id,
        name:         attr.name || '',
        country_iso:  iso,
        country_bg:   COUNTRY_BG[iso] || iso,
        erasmus_code: attr.erasmus_code || null,
      };
    });
  } catch (err) {
    console.warn(`  [${iso}] Error: ${err.message}`);
    return [];
  }
}

async function main() {
  console.log('Fetching HEI API — European universities...\n');
  const all = [];

  for (const iso of EU_COUNTRIES) {
    process.stdout.write(`${iso}... `);
    const unis = await fetchCountry(iso);
    console.log(`${unis.length} institutions`);
    all.push(...unis);
    // Polite rate limiting
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\nTotal: ${all.length} institutions`);

  // Filter out entries with no name or hei_id
  const clean = all.filter(u => u.hei_id && u.name);
  console.log(`After cleanup: ${clean.length} valid institutions`);

  writeFileSync('scripts/hei_raw.json', JSON.stringify(clean, null, 2));
  console.log('\nSaved → scripts/hei_raw.json');
  console.log('Next step: node scripts/enrichWithClaude.mjs');
}

main();
