import { useState, useRef, useCallback } from 'react'

const BASE = import.meta.env.BASE_URL
const audioCache = new Map()

function getAudio(name) {
  if (!audioCache.has(name)) audioCache.set(name, new Audio(`${BASE}sounds/${name}.mp3`))
  return audioCache.get(name)
}

export function useSound() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const currentAudioRef = useRef(null)

  const cancelSound = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
    setIsSpeaking(false)
  }, [])

  const playAudio = useCallback((name, onEnd) => {
    cancelSound()
    const audio = getAudio(name)
    audio.currentTime = 0
    currentAudioRef.current = audio
    setIsSpeaking(true)
    audio.onended = () => { setIsSpeaking(false); currentAudioRef.current = null; onEnd?.() }
    audio.onerror = () => { setIsSpeaking(false); currentAudioRef.current = null }
    audio.play().catch(() => { setIsSpeaking(false); currentAudioRef.current = null })
  }, [cancelSound])

  const playWord = useCallback((word, onEnd) => {
    playAudio(word, onEnd)
  }, [playAudio])

  const playPhoneme = useCallback((sound) => {
    playAudio(sound)
  }, [playAudio])

  const playSequence = useCallback((sounds, onEnd) => {
    if (!sounds?.length) return
    cancelSound()
    setIsSpeaking(true)
    let i = 0
    const playNext = () => {
      if (i >= sounds.length) { setIsSpeaking(false); onEnd?.(); return }
      const name = sounds[i++]
      const audio = getAudio(name)
      audio.currentTime = 0
      currentAudioRef.current = audio
      audio.onended = () => setTimeout(playNext, 750)
      audio.onerror = () => { setIsSpeaking(false); onEnd?.() }
      audio.play().catch(() => { setIsSpeaking(false); onEnd?.() })
    }
    playNext()
  }, [cancelSound])

  return { playWord, playPhoneme, playSequence, cancelSound, isSpeaking }
}
