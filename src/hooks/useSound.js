import { useState, useEffect, useRef, useCallback } from 'react'

export function useSound() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const voicesRef = useRef([])

  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }
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
      voices[0] ||
      null
    )
  }, [])

  const makeUtterance = useCallback((text) => {
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.6
    utt.pitch = 1.35
    utt.volume = 1.0
    const voice = pickVoice()
    if (voice) utt.voice = voice
    return utt
  }, [pickVoice])

  const cancelSound = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  // Play a single word or phoneme string
  const playWord = useCallback((text, onEnd) => {
    if (!text || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = makeUtterance(text)
    utt.onstart = () => setIsSpeaking(true)
    utt.onend = () => { setIsSpeaking(false); onEnd?.() }
    utt.onerror = () => setIsSpeaking(false)
    setTimeout(() => window.speechSynthesis.speak(utt), 50)
    setIsSpeaking(true)
  }, [makeUtterance])

  // Play a single phoneme (same as playWord but no onEnd propagation to auto-advance)
  const playPhoneme = useCallback((sound) => {
    playWord(sound)
  }, [playWord])

  // Play each sound in the array sequentially with a 750ms gap between them
  const playSequence = useCallback((sounds, onEnd) => {
    if (!sounds?.length || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    setIsSpeaking(true)
    let i = 0

    const playNext = () => {
      if (i >= sounds.length) {
        setIsSpeaking(false)
        onEnd?.()
        return
      }
      const utt = makeUtterance(sounds[i++])
      utt.onend = () => setTimeout(playNext, 750)
      utt.onerror = () => { setIsSpeaking(false); onEnd?.() }
      window.speechSynthesis.speak(utt)
    }

    setTimeout(playNext, 50)
  }, [makeUtterance])

  return { playWord, playPhoneme, playSequence, cancelSound, isSpeaking }
}
