#!/usr/bin/env node
// Look up one week's plan row from campaign-plan.json.
// Usage: node week-lookup.mjs <week-number>
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const plan = JSON.parse(fs.readFileSync(path.join(__dirname, 'campaign-plan.json'), 'utf8'));

const wk = Number(process.argv[2]);
if (!wk || wk < 1 || wk > 24) {
  console.error('Usage: node week-lookup.mjs <week-number 1-24>');
  process.exit(1);
}

const row = plan.weeks.find((w) => w.week === wk);
if (!row) { console.error('no such week:', wk); process.exit(1); }

const phase = plan.phases[String(row.phase)];
const today = new Date();
const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
const rhythmToday = plan.weeklyRhythm.find((r) => r.day === dayName);

console.log(JSON.stringify({
  week: row,
  phase: { number: row.phase, ...phase },
  todaysRhythm: rhythmToday || null,
}, null, 2));
