import { useState, useRef, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'phonetics_music_v1'

// Pentatonic notes: C4, E4, G4, A4, C5
const NOTES = [261.63, 329.63, 392.0, 440.0, 523.25]
const NOTE_DURATION = 0.6

export function useBackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true' } catch { return false }
  })

  const ctxRef = useRef(null)
  const gainRef = useRef(null)
  const schedulerRef = useRef(null)
  const noteIndexRef = useRef(0)
  const nextNoteTimeRef = useRef(0)
  const activeRef = useRef(false)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      gainRef.current = ctxRef.current.createGain()
      gainRef.current.gain.value = 0.06
      gainRef.current.connect(ctxRef.current.destination)
    }
    return ctxRef.current
  }, [])

  const scheduleNote = useCallback(() => {
    const ctx = getCtx()
    if (ctx.currentTime >= nextNoteTimeRef.current - 0.05) {
      const osc = ctx.createOscillator()
      const noteGain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = NOTES[noteIndexRef.current % NOTES.length]
      noteGain.gain.setValueAtTime(0.001, nextNoteTimeRef.current)
      noteGain.gain.linearRampToValueAtTime(1, nextNoteTimeRef.current + 0.05)
      noteGain.gain.linearRampToValueAtTime(0.001, nextNoteTimeRef.current + NOTE_DURATION - 0.05)
      osc.connect(noteGain)
      noteGain.connect(gainRef.current)
      osc.start(nextNoteTimeRef.current)
      osc.stop(nextNoteTimeRef.current + NOTE_DURATION)
      noteIndexRef.current += 1
      nextNoteTimeRef.current += NOTE_DURATION
    }
  }, [getCtx])

  const startScheduler = useCallback(() => {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()
    nextNoteTimeRef.current = ctx.currentTime
    activeRef.current = true

    const tick = () => {
      if (!activeRef.current) return
      scheduleNote()
      schedulerRef.current = setTimeout(tick, 150)
    }
    tick()
  }, [getCtx, scheduleNote])

  const stopScheduler = useCallback(() => {
    activeRef.current = false
    clearTimeout(schedulerRef.current)
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.3)
    }
  }, [])

  const toggle = useCallback(() => {
    setIsPlaying(prev => {
      const next = !prev
      try { localStorage.setItem(STORAGE_KEY, String(next)) } catch {}
      if (next) startScheduler()
      else stopScheduler()
      return next
    })
  }, [startScheduler, stopScheduler])

  // Start music if preference is set (after first interaction)
  const initIfNeeded = useCallback(() => {
    if (isPlaying && !activeRef.current) startScheduler()
  }, [isPlaying, startScheduler])

  useEffect(() => {
    return () => stopScheduler()
  }, [stopScheduler])

  return { isPlaying, toggle, initIfNeeded }
}
