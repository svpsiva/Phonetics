import { useState, useEffect, useRef, useCallback } from 'react'

const BASE = import.meta.env.BASE_URL  // '/' in dev, '/Phonetics/' on GH Pages

// Preload audio elements for instant playback
const audioCache = new Map()
function getAudio(sound) {
  if (!audioCache.has(sound)) {
    audioCache.set(sound, new Audio(`${BASE}sounds/${sound}.wav`))
  }
  return audioCache.get(sound)
}

export function useSound() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const currentAudioRef = useRef(null)
  const voicesRef = useRef([])

  useEffect(() => {
    const loadVoices = () => { voicesRef.current = window.speechSynthesis.getVoices() }
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      window.speechSynthesis.cancel()
    }
  }, [])

  const pickVoice = useCallback(() => {
    const voices = voicesRef.current
    return (
      voices.find(v => v.lang.startsWith('en') && v.localService && v.name.toLowerCase().includes('female')) ||
      voices.find(v => v.lang.startsWith('en') && v.localService) ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0] || null
    )
  }, [])

  const cancelSound = useCallback(() => {
    window.speechSynthesis.cancel()
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
    setIsSpeaking(false)
  }, [])

  // Full-word playback: Web Speech API (natural quality, device voice)
  const playWord = useCallback((text, onEnd) => {
    if (!text || !window.speechSynthesis) return
    cancelSound()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.6
    utt.pitch = 1.35
    utt.volume = 1.0
    const voice = pickVoice()
    if (voice) utt.voice = voice
    utt.onstart = () => setIsSpeaking(true)
    utt.onend = () => { setIsSpeaking(false); onEnd?.() }
    utt.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    setTimeout(() => window.speechSynthesis.speak(utt), 50)
  }, [cancelSound, pickVoice])

  // Single phoneme: pre-generated audio file
  const playPhoneme = useCallback((sound) => {
    cancelSound()
    const audio = getAudio(sound)
    audio.currentTime = 0
    currentAudioRef.current = audio
    setIsSpeaking(true)
    audio.onended = () => { setIsSpeaking(false); currentAudioRef.current = null }
    audio.onerror = () => { setIsSpeaking(false); currentAudioRef.current = null }
    audio.play().catch(() => setIsSpeaking(false))
  }, [cancelSound])

  // Sequence: play each phoneme audio file with 750ms gap between them
  const playSequence = useCallback((sounds, onEnd) => {
    if (!sounds?.length) return
    cancelSound()
    setIsSpeaking(true)
    let i = 0
    let cancelled = false

    const playNext = () => {
      if (cancelled) return
      if (i >= sounds.length) {
        setIsSpeaking(false)
        currentAudioRef.current = null
        onEnd?.()
        return
      }
      const audio = getAudio(sounds[i++])
      audio.currentTime = 0
      currentAudioRef.current = audio
      audio.onended = () => { if (!cancelled) setTimeout(playNext, 750) }
      audio.onerror = () => { setIsSpeaking(false); currentAudioRef.current = null; onEnd?.() }
      audio.play().catch(() => { setIsSpeaking(false); onEnd?.() })
    }

    // Store cancellation flag on the ref so cancelSound can stop the chain
    currentAudioRef.current = { pause: () => { cancelled = true }, currentTime: 0 }
    playNext()
  }, [cancelSound])

  return { playWord, playPhoneme, playSequence, cancelSound, isSpeaking }
}
