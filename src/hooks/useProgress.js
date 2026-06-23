import { useState, useEffect } from 'react'
import { LESSONS } from '../data/lessons'

const STORAGE_KEY = 'phonetics_progress_v1'

const makeDefault = () =>
  Object.fromEntries(
    LESSONS.map((l, i) => [l.id, { stars: 0, completed: false, unlocked: i === 0 }])
  )

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Merge with defaults in case new lessons were added
        const defaults = makeDefault()
        return { ...defaults, ...parsed }
      }
    } catch {
      // ignore
    }
    return makeDefault()
  })

  const [autoAdvance, setAutoAdvanceState] = useState(() => {
    try {
      return localStorage.getItem('phonetics_autoadvance') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // ignore storage errors
    }
  }, [progress])

  const earnStar = (lessonId) => {
    setProgress(prev => {
      const current = prev[lessonId] || { stars: 0, completed: false, unlocked: false }
      const lesson = LESSONS.find(l => l.id === lessonId)
      const maxStars = lesson ? lesson.items.length : 0
      if (current.stars >= maxStars) return prev
      return { ...prev, [lessonId]: { ...current, stars: current.stars + 1 } }
    })
  }

  const completeLesson = (lessonId) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        [lessonId]: { ...prev[lessonId], completed: true },
      }
      // Unlock next lesson
      const nextId = lessonId + 1
      if (updated[nextId]) {
        updated[nextId] = { ...updated[nextId], unlocked: true }
      }
      return updated
    })
  }

  const isUnlocked = (lessonId) => progress[lessonId]?.unlocked ?? false

  const getTotalStars = () =>
    Object.values(progress).reduce((sum, p) => sum + (p.stars || 0), 0)

  const setAutoAdvance = (val) => {
    setAutoAdvanceState(val)
    try {
      localStorage.setItem('phonetics_autoadvance', String(val))
    } catch {
      // ignore
    }
  }

  const resetProgress = () => {
    const defaults = makeDefault()
    setProgress(defaults)
  }

  return {
    progress,
    earnStar,
    completeLesson,
    isUnlocked,
    getTotalStars,
    autoAdvance,
    setAutoAdvance,
    resetProgress,
  }
}
