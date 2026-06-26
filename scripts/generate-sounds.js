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

// IPA phoneme representations for consonant onsets, digraphs, and blends.
// These use SSML <phoneme alphabet="ipa"> for precise Neural2 pronunciation.
const PHONEME_IPA = {
  // Single consonant onsets (consonant + minimal schwa)
  buh: 'bʌ',  duh: 'dʌ',  fuh: 'fʌ',  guh: 'ɡʌ',
  huh: 'hʌ',  juh: 'dʒʌ', kuh: 'kʌ',  luh: 'lʌ',
  muh: 'mʌ',  nuh: 'nʌ',  puh: 'pʌ',  ruh: 'rʌ',
  suh: 'sʌ',  tuh: 'tʌ',  vuh: 'vʌ',  wuh: 'wʌ',
  yuh: 'jʌ',  zuh: 'zʌ',
  // Digraphs
  sh:  'ʃ',   ch:  'tʃ',  th:  'ð',   wh:  'w',
  // Blends (consonant cluster + minimal schwa)
  bl:  'blʌ', br:  'brʌ', cl:  'klʌ', cr:  'krʌ',
  dr:  'drʌ', fl:  'flʌ', gr:  'ɡrʌ', sl:  'slʌ',
  sm:  'smʌ', sn:  'snʌ', sp:  'spʌ', tr:  'trʌ',
  twuh: 'twʌ',
}

function phonemeSSML(ipa, fallback) {
  return `<speak><phoneme alphabet="ipa" ph="${ipa}">${fallback}</phoneme></speak>`
}

async function synthesize(input, speakingRate) {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input,
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

// Build task list: words use plain text; sounds use IPA phoneme SSML when available
const tasks = [
  ...[...words].sort().map(w => ({
    name: w,
    input: { text: w },
    rate: 0.80,
    type: 'word',
  })),
  ...[...soundStrings].sort().map(s => {
    const ipa = PHONEME_IPA[s]
    return {
      name: s,
      input: ipa ? { ssml: phonemeSSML(ipa, s) } : { text: s },
      rate: 0.70,
      type: ipa ? 'phoneme' : 'rime',
    }
  }),
]

let generated = 0, skipped = 0, errors = 0
for (const { name, input, rate, type } of tasks) {
  const outFile = join(OUT, `${name}.mp3`)
  if (!FORCE && existsSync(outFile)) { skipped++; continue }
  try {
    const buf = await synthesize(input, rate)
    writeFileSync(outFile, buf)
    generated++
    const desc = input.ssml ? `IPA /${PHONEME_IPA[name]}/` : `"${input.text}"`
    console.log(`✓  [${type.padEnd(7)}]  ${name.padEnd(12)} ← ${desc}`)
  } catch (e) {
    errors++
    console.error(`✗  [${type}]  ${name}: ${e.message}`)
  }
}
console.log(`\nDone — generated:${generated}  skipped:${skipped}  errors:${errors}`)
