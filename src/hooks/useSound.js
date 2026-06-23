import { useState, useEffect, useRef, useCallback } from 'react'

export function useSound() {
  const [isSpeaking, setIsSpeaking] = useState(false)
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
    setIsSpeaking(false)
  }, [])

  const speak = useCallback((text, onEnd) => {
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.6
    utt.pitch = 1.35
    utt.volume = 1.0
    const voice = pickVoice()
    if (voice) utt.voice = voice
    utt.onend = () => { setIsSpeaking(false); onEnd?.() }
    utt.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utt)
  }, [pickVoice])

  // Full word — earns star, triggers auto-advance via onEnd
  const playWord = useCallback((text, onEnd) => {
    if (!text || !window.speechSynthesis) return
    cancelSound()
    setIsSpeaking(true)
    setTimeout(() => speak(text, onEnd), 50)
  }, [cancelSound, speak])

  // Single phoneme — same voice/pitch/rate as playWord
  const playPhoneme = useCallback((sound) => {
    if (!sound || !window.speechSynthesis) return
    cancelSound()
    setIsSpeaking(true)
    setTimeout(() => speak(sound), 50)
  }, [cancelSound, speak])

  // Sequence — each sound spoken with 750ms gap, same voice as above
  const playSequence = useCallback((sounds, onEnd) => {
    if (!sounds?.length || !window.speechSynthesis) return
    cancelSound()
    setIsSpeaking(true)
    let i = 0
    const playNext = () => {
      if (i >= sounds.length) { setIsSpeaking(false); onEnd?.(); return }
      const utt = new SpeechSynthesisUtterance(sounds[i++])
      utt.rate = 0.6
      utt.pitch = 1.35
      utt.volume = 1.0
      const voice = pickVoice()
      if (voice) utt.voice = voice
      utt.onend = () => setTimeout(playNext, 750)
      utt.onerror = () => { setIsSpeaking(false); onEnd?.() }
      window.speechSynthesis.speak(utt)
    }
    setTimeout(playNext, 50)
  }, [cancelSound, pickVoice])

  return { playWord, playPhoneme, playSequence, cancelSound, isSpeaking }
}
