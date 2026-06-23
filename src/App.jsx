import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LESSONS } from './data/lessons'
import { useProgress } from './hooks/useProgress'
import { useBackgroundMusic } from './hooks/useBackgroundMusic'
import HomeScreen from './screens/HomeScreen'
import LessonScreen from './screens/LessonScreen'
import CompletionScreen from './screens/CompletionScreen'

export default function App() {
  const [view, setView] = useState('home')          // 'home' | 'lesson' | 'done'
  const [activeLessonId, setActiveLessonId] = useState(null)

  const {
    progress, earnStar, completeLesson,
    isUnlocked, getTotalStars, autoAdvance, setAutoAdvance, resetProgress,
  } = useProgress()

  const music = useBackgroundMusic()

  const activeLesson = LESSONS.find(l => l.id === activeLessonId)

  const handleSelectLesson = useCallback((id) => {
    if (!isUnlocked(id)) return
    music.initIfNeeded()
    setActiveLessonId(id)
    setView('lesson')
  }, [isUnlocked, music])

  const handleComplete = useCallback(() => {
    setView('done')
  }, [])

  const handleHome = useCallback(() => {
    setActiveLessonId(null)
    setView('home')
  }, [])

  const handleNextLesson = useCallback(() => {
    if (!activeLesson) return
    const nextLesson = LESSONS.find(l => l.id === activeLesson.id + 1)
    if (nextLesson && isUnlocked(nextLesson.id)) {
      setActiveLessonId(nextLesson.id)
      setView('lesson')
    } else {
      setView('home')
    }
  }, [activeLesson, isUnlocked])

  const handleRepeat = useCallback(() => {
    setView('lesson')
  }, [])

  const hasNextLesson = activeLesson
    ? LESSONS.some(l => l.id === activeLesson.id + 1)
    : false

  const starsEarned = activeLesson
    ? (progress[activeLesson.id]?.stars ?? 0)
    : 0

  return (
    <div className="h-full w-full relative overflow-hidden" onClick={music.initIfNeeded}>
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <div key="home" className="absolute inset-0">
            <HomeScreen
              progress={progress}
              onSelectLesson={handleSelectLesson}
              getTotalStars={getTotalStars}
              music={music}
            />
          </div>
        )}

        {view === 'lesson' && activeLesson && (
          <div key={`lesson-${activeLesson.id}`} className="absolute inset-0">
            <LessonScreen
              lesson={activeLesson}
              progress={progress}
              earnStar={earnStar}
              completeLesson={completeLesson}
              autoAdvance={autoAdvance}
              onBack={handleHome}
              onHome={handleHome}
              onComplete={handleComplete}
            />
          </div>
        )}

        {view === 'done' && activeLesson && (
          <div key="done" className="absolute inset-0">
            <CompletionScreen
              lesson={activeLesson}
              starsEarned={starsEarned}
              hasNextLesson={hasNextLesson}
              onHome={handleHome}
              onNextLesson={handleNextLesson}
              onRepeat={handleRepeat}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
