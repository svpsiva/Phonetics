#!/usr/bin/env node
// Generates WAV files for every phoneme sound used in lessons.js.
// Uses espeak-ng with X-SAMPA phoneme notation for consonants (cleaner sound
// than plain text) and natural English text for rime units.
// Run: node scripts/generate-sounds.js
import { execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { LESSONS } from '../src/data/lessons.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'sounds')
mkdirSync(OUT, { recursive: true })

// Maps sound string → espeak-ng text input.
// X-SAMPA phoneme notation [[...]] produces cleaner isolated consonant sounds.
// Rime units are real English syllables; espeak handles them as plain text.
const SOUND_MAP = {
  // ── Fricatives & sonorants (can be sustained) ──────────────────
  'fuh':  '[[f:f:f:]]',      // /fff/
  'luh':  '[[l:l:l:]]',      // /lll/
  'muh':  '[[m:m:m:]]',      // /mmm/
  'nuh':  '[[n:n:n:]]',      // /nnn/
  'ruh':  '[[r:r:r:]]',      // /rrr/
  'suh':  '[[s:s:s:]]',      // /sss/
  'vuh':  '[[v:v:v:]]',      // /vvv/
  'zuh':  '[[z:z:z:]]',      // /zzz/
  'huh':  '[[h@]]',          // /h/ + schwa

  // ── Stop consonants (trailing schwa is unavoidable in speech physics) ─
  'buh':  '[[b@]]',
  'duh':  '[[d@]]',
  'guh':  '[[g@]]',
  'juh':  '[[dZ@]]',
  'kuh':  '[[k@]]',
  'puh':  '[[p@]]',
  'tuh':  '[[t@]]',
  'wuh':  '[[w@]]',          // /w/ is a glide, minimal schwa

  // ── Digraph onsets ─────────────────────────────────────────────
  'sh':   '[[S:S:S:]]',      // /ʃʃʃ/ (shhhh)
  'ch':   '[[tS@]]',         // /tʃ/ + minimal schwa
  'th':   '[[D:D:D:]]',      // /ðð/ voiced th (as in "this", "that")
  'wh':   '[[w@]]',          // /w/ (English wh = /w/)

  // ── Blend onsets (consonant clusters — use text for natural blend) ─
  'bl':   'bluh',
  'cl':   'cluh',
  'fl':   'fluh',
  'br':   'bruh',
  'cr':   'cruh',
  'dr':   'druh',
  'sl':   'sluh',
  'sm':   'smuh',
  'sn':   'snuh',
  'sp':   'spuh',
  'tw':   'twuh',
  'gr':   'gruh',
  'tr':   'truh',

  // ── Isolated vowel sounds ──────────────────────────────────────
  'ih':   '[[I]]',           // short /ɪ/
  'uh':   '[[V]]',           // short /ʌ/
  'oh':   '[[oU]]',          // long /oʊ/ (as in "slow")
  'oo':   '[[u:]]',          // long /uː/ (as in "blue", "shoe")
  'eye':  '[[aI]]',          // /aɪ/ diphthong (as in "cry", "fly")
  'ohn':  'ohn',             // long /oʊn/ — for "bone" rime; plain text
  'iz':   '[[Iz]]',          // /ɪz/
}

// Collect every unique sound string from all lessons
const allSounds = new Set()
for (const lesson of LESSONS) {
  for (const item of lesson.items) {
    for (const s of item.sounds) allSounds.add(s)
  }
}

const BASE_FLAGS = '-v en-us -s 120 -p 70 -a 100'

let generated = 0
let skipped = 0

for (const sound of [...allSounds].sort()) {
  const outFile = join(OUT, `${sound}.wav`)
  const input = SOUND_MAP[sound] ?? sound   // fall back to plain text for rime units

  const escapedInput = input.replace(/"/g, '\\"')
  const cmd = `espeak-ng "${escapedInput}" ${BASE_FLAGS} -w "${outFile}"`

  try {
    execSync(cmd, { stdio: 'pipe' })
    generated++
    console.log(`✓  ${sound.padEnd(10)} ← ${input}`)
  } catch (e) {
    console.error(`✗  ${sound}: ${e.message}`)
  }
}

console.log(`\nGenerated ${generated} files in public/sounds/  (${skipped} skipped)`)
