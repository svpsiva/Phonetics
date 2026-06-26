import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CardScreen from './CardScreen'
import { useSound, preloadSounds } from '../hooks/useSound'

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

export default function LessonScreen({
  lesson,
  progress,
  earnStar,
  completeLesson,
  autoAdvance,
  onBack,
  onHome,
  onComplete,
}) {
  const [cardIndex, setCardIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [lastSoundEnd, setLastSoundEnd] = useState(0)
  const { playWord, playPhoneme, playSequence, isSpeaking } = useSound()

  // Preload all audio for this lesson on mount so playback is instant
  useEffect(() => {
    const names = new Set()
    for (const item of lesson.items) {
      names.add(item.word)
      for (const s of item.sounds) names.add(s)
    }
    preloadSounds([...names])
  }, [lesson.id])

  const p = progress[lesson.id] || { stars: 0 }
  const items = lesson.items
  const currentItem = items[cardIndex]

  const goNext = useCallback(() => {
    if (cardIndex >= items.length - 1) {
      completeLesson(lesson.id)
      onComplete()
      return
    }
    setDirection(1)
    setCardIndex(i => i + 1)
    setLastSoundEnd(0)
  }, [cardIndex, items.length, completeLesson, lesson.id, onComplete])

  const goBack = useCallback(() => {
    if (cardIndex === 0) return
    setDirection(-1)
    setCardIndex(i => i - 1)
    setLastSoundEnd(0)
  }, [cardIndex])

  // Word play: earns a star + triggers auto-advance
  const handlePlayWord = useCallback(() => {
    playWord(currentItem.word, () => {
      earnStar(lesson.id)
      setLastSoundEnd(Date.now())
    })
  }, [currentItem.word, playWord, earnStar, lesson.id])

  const handlePlayPhoneme = useCallback((sound) => {
    playPhoneme(sound)
  }, [playPhoneme])

  const handlePlaySequence = useCallback((sounds) => {
    playSequence(sounds)
  }, [playSequence])

  // Auto-advance 1.8s after word finishes
  useEffect(() => {
    if (!autoAdvance || !lastSoundEnd) return
    const timer = setTimeout(goNext, 1800)
    return () => clearTimeout(timer)
  }, [lastSoundEnd, autoAdvance, goNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full w-full overflow-hidden"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentItem.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-full w-full absolute inset-0"
        >
          <CardScreen
            item={currentItem}
            lesson={lesson}
            cardIndex={cardIndex}
            totalCards={items.length}
            starsEarned={p.stars}
            isSpeaking={isSpeaking}
            onPlayWord={handlePlayWord}
            onPlayPhoneme={handlePlayPhoneme}
            onPlaySequence={handlePlaySequence}
            onBack={goBack}
            backDisabled={cardIndex === 0}
            onSkip={goNext}
            onHome={onHome}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
