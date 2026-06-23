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

  return { playWord, cancelSound, isSpeaking }
}
