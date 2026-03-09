/**
 * Step 2: Enrich HEI raw data with Claude (Haiku — cheapest model)
 * Adds: city, lat/lng, QS rank, tuition, fields, programs, rating, etc.
 *
 * Run: ANTHROPIC_API_KEY=sk-... node scripts/enrichWithClaude.mjs
 * Input:  scripts/hei_raw.json
 * Output: scripts/hei_enriched.json
 *
 * Cost estimate: ~900 unis, 20/batch = 45 requests × ~$0.003 = ~$0.15 total
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const BATCH_SIZE = 20;

// Skip universities that already exist in our hand-curated DB
const EXISTING_SCHAC = new Set([
  'sofi-uni.bg','tu-sofia.bg','unwe.bg','mu-sofia.bg','nbu.bg',
  'uni-plovdiv.bg','vtu.bg','vfu.bg',
  'uoa.gr','auth.gr',
  'lmu.de','tum.de','hu-berlin.de','uni-heidelberg.de','rwth-aachen.de','fu-berlin.de','tu-berlin.de','kit.edu','uni-frankfurt.de','uni-hamburg.de',
  'ox.ac.uk','cam.ac.uk','imperial.ac.uk','ucl.ac.uk','ed.ac.uk','manchester.ac.uk','warwick.ac.uk','bristol.ac.uk','nottingham.ac.uk','birmingham.ac.uk',
  'sorbonne-universite.fr','polytechnique.edu','universite-paris-saclay.fr','sciences-po.fr','emlyon.edu',
  'uni-muenchen.de',
  // add more as needed
]);

const SYSTEM = `You are a university data expert. For each university given, return accurate structured data based on your training knowledge. Be concise and factual. If you're unsure about a specific value, use a reasonable estimate based on the country and institution type. Never refuse — always provide your best estimate.`;

function buildPrompt(batch) {
  const list = batch.map((u, i) =>
    `${i + 1}. "${u.name}" — ${u.country_bg} (${u.country_iso}), SCHAC: ${u.hei_id}`
  ).join('\n');

  return `For each university below, return a JSON array (same order, same count).
Each object must have ALL these fields:

- nameEn: Short English name (max 35 chars, e.g. "Sorbonne" not full official name)
- city: City name in Bulgarian if major/known, else English (e.g. "Париж", "Munich")
- lat: latitude as float (e.g. 48.8534)
- lng: longitude as float (e.g. 2.3488)
- rank: QS World Uni Ranking number (integer; 0 if outside top 1000)
- students: total enrolled students (integer, estimate if needed)
- founded: founding year (integer)
- tuition: [minEUR, maxEUR] annual tuition. Public EU unis often [0,300]. UK unis [9250,35000]. Private varies.
- fields: array of 1-4 from ONLY these options: ["IT","Инженерство","Медицина","Право","Бизнес","Хуманитарни","Природни науки","Икономика","Архитектура","Изкуства","Педагогика","Фармация","Маркетинг","Финанси"]
- programs: array of 3-5 main study program names in English (e.g. ["Computer Science","Law","Medicine"])
- rating: float 3.5–5.0 (student satisfaction estimate)
- acceptance: integer 0–100 (acceptance rate %)
- international: integer 0–60 (% international students)
- type: "p" (public/state) or "v" (private)
- costOfLiving: integer EUR/month (rent+food+transport for that city, e.g. Paris=1100, Munich=950, Sofia=480)
- employability: integer 50–99 (graduate employment rate %)
- emoji: one relevant emoji (🏛️🔬📚🏥⚙️📊🎨🌿🏰 etc.)

Universities:
${list}

Return ONLY a valid JSON array. No markdown, no explanation.`;
}

async function enrichBatch(batch) {
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [{ role: 'user', content: buildPrompt(batch) }],
    system: SYSTEM,
  });

  const text = msg.content[0].text.trim();
  // Strip markdown code blocks if model adds them
  const jsonText = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(jsonText);
}

async function main() {
  if (!existsSync('scripts/hei_raw.json')) {
    console.error('hei_raw.json not found. Run fetchHEI.mjs first.');
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync('scripts/hei_raw.json', 'utf8'));
  console.log(`Loaded ${raw.length} institutions from hei_raw.json`);

  // Skip already curated universities
  const toEnrich = raw.filter(u => !EXISTING_SCHAC.has(u.hei_id));
  console.log(`Skipping ${raw.length - toEnrich.length} existing entries`);
  console.log(`Enriching ${toEnrich.length} new institutions\n`);

  // Load existing enriched data to allow resuming
  let enriched = [];
  if (existsSync('scripts/hei_enriched.json')) {
    enriched = JSON.parse(readFileSync('scripts/hei_enriched.json', 'utf8'));
    console.log(`Resuming from ${enriched.length} already enriched\n`);
  }
  const alreadyDone = new Set(enriched.map(u => u.hei_id));
  const remaining = toEnrich.filter(u => !alreadyDone.has(u.hei_id));

  const batches = [];
  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    batches.push(remaining.slice(i, i + BATCH_SIZE));
  }

  console.log(`${batches.length} batches of ${BATCH_SIZE} to process`);
  console.log(`Estimated cost: ~$${(batches.length * 0.003).toFixed(2)}\n`);

  let done = 0;
  for (const [i, batch] of batches.entries()) {
    process.stdout.write(`Batch ${i + 1}/${batches.length} (${batch[0].name.slice(0,30)}...) `);
    try {
      const results = await enrichBatch(batch);
      // Merge hei_id + country back into enriched results
      const merged = results.map((r, idx) => ({
        hei_id:      batch[idx].hei_id,
        country_iso: batch[idx].country_iso,
        country_bg:  batch[idx].country_bg,
        name_orig:   batch[idx].name,
        erasmus:     batch[idx].erasmus_code,
        ...r,
      }));
      enriched.push(...merged);
      done += batch.length;
      console.log(`✓ (${done}/${remaining.length})`);

      // Save progress after every batch (resumable)
      writeFileSync('scripts/hei_enriched.json', JSON.stringify(enriched, null, 2));

      // Rate limiting — Haiku allows ~50 req/min
      await new Promise(r => setTimeout(r, 1200));
    } catch (err) {
      console.error(`\n  Batch ${i + 1} FAILED: ${err.message}`);
      console.error('  Saving progress and continuing...');
      writeFileSync('scripts/hei_enriched.json', JSON.stringify(enriched, null, 2));
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`\nDone! ${enriched.length} universities enriched`);
  console.log('Saved → scripts/hei_enriched.json');
  console.log('Next step: node scripts/importToUniDB.mjs');
}

main();
