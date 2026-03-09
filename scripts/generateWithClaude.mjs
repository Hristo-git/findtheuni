/**
 * Generate + enrich European university data entirely with Claude.
 * No external API needed — runs directly in any environment.
 *
 * Run: node scripts/generateWithClaude.mjs
 * Output: src/data/universitiesExpanded.js
 */

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync, readFileSync } from 'fs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Countries with target university count per country
const COUNTRIES = [
  // [iso, nameBG, targetCount]
  ['DE','Германия',18], ['GB','UK',18], ['FR','Франция',14], ['IT','Италия',12],
  ['ES','Испания',12], ['NL','Нидерландия',10], ['SE','Швеция',8],  ['BE','Белгия',7],
  ['CH','Швейцария',7],  ['AT','Австрия',7],   ['PL','Полша',9],   ['CZ','Чехия',7],
  ['GR','Гърция',7],    ['PT','Португалия',6], ['HU','Унгария',6], ['DK','Дания',6],
  ['FI','Финландия',6], ['NO','Норвегия',6],   ['IE','Ирландия',5],['RO','Румъния',6],
  ['BG','България',6],  ['HR','Хърватия',4],   ['SK','Словакия',4],['SI','Словения',3],
  ['EE','Естония',3],   ['LV','Латвия',3],     ['LT','Литва',3],   ['RS','Сърбия',4],
  ['CY','Кипър',3],     ['LU','Люксембург',2], ['MT','Малта',2],   ['IS','Исландия',2],
  ['AL','Албания',3],   ['MK','Македония',3],  ['BA','Босна',3],
];

// Already in the base DB — skip these SCHAC domains
const EXISTING = new Set([
  'sofi-uni.bg','tu-sofia.bg','unwe.bg','mu-sofia.bg','nbu.bg','uni-plovdiv.bg','vtu.bg','vfu.bg',
  'uoa.gr','auth.gr',
  'lmu.de','tum.de','hu-berlin.de','uni-heidelberg.de','rwth-aachen.de','fu-berlin.de',
  'tu-berlin.de','kit.edu','uni-frankfurt.de','uni-hamburg.de',
  'ox.ac.uk','cam.ac.uk','imperial.ac.uk','ucl.ac.uk','ed.ac.uk',
  'manchester.ac.uk','warwick.ac.uk','bristol.ac.uk','nottingham.ac.uk','birmingham.ac.uk',
  'sorbonne-universite.fr','polytechnique.edu','universite-paris-saclay.fr','sciences-po.fr',
  'uni-muenchen.de',
]);

const FIELD_LIST = 'IT,Инженерство,Медицина,Право,Бизнес,Хуманитарни,Природни науки,Икономика,Архитектура,Изкуства,Педагогика,Фармация,Маркетинг,Финанси';

function buildPrompt(iso, countryBg, count) {
  return `List the ${count} most well-known universities in ${countryBg} (${iso}).
For each, return a JSON array of objects with ALL fields:
- schac: internet domain (e.g. "cuni.cz") — unique identifier
- nameOrig: official name in local language
- nameEn: short English name (max 35 chars)
- city: city in Bulgarian if major European city (Прага, Виена etc.), else English
- lat: latitude float
- lng: longitude float
- rank: QS World University Ranking (integer; 0 if not in top 1200)
- students: total students (integer)
- founded: year founded (integer)
- tuition: [minEUR, maxEUR] annual tuition (EU public unis often [0,500], UK [9250,35000])
- fields: 1-4 items from: [${FIELD_LIST}]
- programs: 3-5 main English program names
- rating: float 3.5-5.0
- acceptance: % integer
- international: % international students integer
- type: "p" (public) or "v" (private)
- costOfLiving: EUR/month (rent+food+transport)
- employability: % integer
- emoji: one emoji

Focus on universities that students actually know and consider. Return ONLY a raw JSON array.`;
}

async function fetchCountry(iso, countryBg, count) {
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    system: 'You are a university data expert. Return ONLY raw valid JSON arrays. Never use markdown or code blocks.',
    messages: [{ role: 'user', content: buildPrompt(iso, countryBg, count) }],
  });

  const text = msg.content[0].text.trim()
    .replace(/^```json?\n?/,'').replace(/\n?```$/,'');

  const items = JSON.parse(text);
  return items.map(u => ({ ...u, country_iso: iso, country_bg: countryBg }));
}

async function main() {
  console.log('Generating European university data with Claude Haiku...\n');

  let all = [];
  let totalTokens = 0;

  for (const [iso, nameBg, count] of COUNTRIES) {
    process.stdout.write(`${iso} (${nameBg}, ${count} unis)... `);
    try {
      const items = await fetchCountry(iso, nameBg, count);
      const fresh = items.filter(u => !EXISTING.has(u.schac));
      all.push(...fresh);
      console.log(`✓ ${fresh.length} new`);
    } catch (err) {
      console.log(`✗ ERROR: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 800)); // rate limit
  }

  console.log(`\nTotal new universities: ${all.length}`);

  // Deduplicate by schac, then by nameEn
  const seenSchac = new Set();
  const seenName  = new Set();
  const deduped   = all.filter(u => {
    const key = u.schac || u.nameEn?.toLowerCase();
    if (!key || seenSchac.has(key) || seenName.has(u.nameEn?.toLowerCase())) return false;
    seenSchac.add(u.schac);
    seenName.add(u.nameEn?.toLowerCase());
    return true;
  });

  console.log(`After dedup: ${deduped.length}`);

  // Read existing DB for max ID
  const existingRaw = readFileSync('src/data/universities.js', 'utf8');
  const existingIds = (existingRaw.match(/^\[(\d+),/gm) || []).map(m => parseInt(m.slice(1)));
  const maxId = existingIds.length ? Math.max(...existingIds) : 70;

  // Sort: ranked first by QS, then alphabetically
  deduped.sort((a,b) => {
    if (a.rank>0 && b.rank>0) return a.rank-b.rank;
    if (a.rank>0) return -1;
    if (b.rank>0) return 1;
    return (a.nameEn||'').localeCompare(b.nameEn||'');
  });

  function esc(s){ return (String(s||'')).replace(/"/g,'\\"'); }

  const rows = deduped.map((u,i) => {
    const id = maxId + i + 1;
    const rank    = Number(u.rank)||0;
    const students= Number(u.students)||10000;
    const founded = Number(u.founded)||1900;
    const tMin    = Number((u.tuition||[0,0])[0])||0;
    const tMax    = Number((u.tuition||[0,1000])[1])||1000;
    const fields  = JSON.stringify((u.fields||[]).slice(0,4));
    const rating  = Math.min(5,Math.max(3.5,parseFloat(u.rating||4.0))).toFixed(1);
    const accept  = Math.min(100,Math.max(0,Number(u.acceptance||50)));
    const intl    = Math.min(60,Math.max(0,Number(u.international||10)));
    const type    = u.type==='v'?'v':'p';
    const col     = Number(u.costOfLiving)||700;
    const emp     = Math.min(99,Math.max(50,Number(u.employability||70)));
    const progs   = JSON.stringify((u.programs||[]).slice(0,6));
    const lat     = parseFloat((Number(u.lat)||0).toFixed(4));
    const lng     = parseFloat((Number(u.lng)||0).toFixed(4));

    // Skip bad coords
    if (lat===0 && lng===0) return null;

    return `[${id},"${esc(u.nameOrig||u.nameEn)}","${esc(u.nameEn)}","${esc(u.country_bg)}","${esc(u.city)}",${rank},${students},${founded},[${tMin},${tMax}],${fields},${rating},${accept},${intl},"${esc(u.emoji||'🎓')}","${type}",${col},${emp},${progs},[${lat},${lng}]]`;
  }).filter(Boolean);

  const output = `// Auto-generated by scripts/generateWithClaude.mjs
// ${new Date().toISOString().split('T')[0]} — ${rows.length} European universities
const rawHEI=[
${rows.join(',\n')}
];
export default rawHEI;
`;

  writeFileSync('src/data/universitiesExpanded.js', output);
  console.log(`\nWrote ${rows.length} rows → src/data/universitiesExpanded.js`);

  // Country breakdown
  const byCo = {};
  deduped.forEach(u => byCo[u.country_bg] = (byCo[u.country_bg]||0)+1);
  console.log('\nBreakdown:');
  Object.entries(byCo).sort((a,b)=>b[1]-a[1]).forEach(([c,n])=>console.log(`  ${c}: ${n}`));
}

main().catch(console.error);
