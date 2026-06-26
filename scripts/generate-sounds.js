#!/usr/bin/env node
// Run: GOOGLE_TTS_KEY=<key> node scripts/generate-sounds.js [--force]
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { LESSONS } from '../src/data/lessons.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'sounds')
mkdirSync(OUT, { recursive: true })

const KEY = process.env.GOOGLE_TTS_KEY
if (!KEY) { console.error('Error: GOOGLE_TTS_KEY environment variable not set'); process.exit(1) }

const FORCE = process.argv.includes('--force')

// Text overrides for strings TTS would mis-read as letter names or mispronounce
const TTS_TEXT = {
  bl: 'bluh', cl: 'cluh', fl: 'fluh', br: 'bruh', cr: 'cruh', dr: 'druh',
  sl: 'sluh', sm: 'smuh', sn: 'snuh', sp: 'spuh', tr: 'truh', gr: 'gruh', tw: 'twuh',
  sh: 'shh', ch: 'chuh', th: 'thuh', wh: 'wuh',
  ohn: 'own', ome: 'ohm', ote: 'oat', oo: 'ooh',
}

async function synthesize(text, speakingRate) {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: 'en-US', name: 'en-US-Neural2-F' },
        audioConfig: { audioEncoding: 'MP3', speakingRate },
      }),
    }
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  const { audioContent } = await res.json()
  return Buffer.from(audioContent, 'base64')
}

const words = new Set()
const soundStrings = new Set()
for (const lesson of LESSONS) {
  for (const item of lesson.items) {
    words.add(item.word)
    for (const s of item.sounds) soundStrings.add(s)
  }
}

const tasks = [
  ...[...words].sort().map(w => ({ name: w, text: w, rate: 0.80, type: 'word' })),
  ...[...soundStrings].sort().map(s => ({ name: s, text: TTS_TEXT[s] ?? s, rate: 0.70, type: 'sound' })),
]

let generated = 0, skipped = 0, errors = 0
for (const { name, text, rate, type } of tasks) {
  const outFile = join(OUT, `${name}.mp3`)
  if (!FORCE && existsSync(outFile)) { skipped++; continue }
  try {
    const buf = await synthesize(text, rate)
    writeFileSync(outFile, buf)
    generated++
    console.log(`✓  [${type}]  ${name.padEnd(12)} ← "${text}"`)
  } catch (e) {
    errors++
    console.error(`✗  [${type}]  ${name}: ${e.message}`)
  }
}
console.log(`\nDone — generated:${generated}  skipped:${skipped}  errors:${errors}`)
