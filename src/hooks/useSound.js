import { useState, useEffect, useRef, useCallback } from 'react'

export function useSound() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const voicesRef = useRef([])
  const utteranceRef = useRef(null)
  const onEndCallbackRef = useRef(null)

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
    // Prefer a local English female voice for a child-friendly sound
    return (
      voices.find(v => v.lang.startsWith('en') && v.localService && v.name.toLowerCase().includes('female')) ||
      voices.find(v => v.lang.startsWith('en') && v.localService) ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0] ||
      null
    )
  }, [])

  const cancelSound = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  const playSound = useCallback((text, onEnd) => {
    if (!text || !window.speechSynthesis) return

    // Must cancel first to avoid queuing on some browsers
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.6
    utterance.pitch = 1.35
    utterance.volume = 1.0

    const voice = pickVoice()
    if (voice) utterance.voice = voice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      if (onEndCallbackRef.current) onEndCallbackRef.current()
    }
    utterance.onerror = () => setIsSpeaking(false)

    onEndCallbackRef.current = onEnd || null
    utteranceRef.current = utterance

    // Safari: slight delay prevents a known cancellation race
    setTimeout(() => {
      window.speechSynthesis.speak(utterance)
    }, 50)

    setIsSpeaking(true)
  }, [pickVoice])

  return { playSound, cancelSound, isSpeaking }
}
