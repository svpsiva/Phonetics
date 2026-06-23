import { motion } from 'framer-motion'
import { LESSONS } from '../data/lessons'
import LessonTile from '../components/LessonTile'
import MusicToggle from '../components/MusicToggle'

export default function HomeScreen({ progress, onSelectLesson, getTotalStars, music }) {
  const totalStars = getTotalStars()
  const maxStars = LESSONS.reduce((s, l) => s + l.items.length, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full w-full flex flex-col bg-gradient-to-b from-sky-100 to-white overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3 shrink-0">
        <div>
          <h1 className="font-display text-3xl text-sky-600 leading-none">Learn to Read</h1>
          <p className="font-body text-sm text-sky-400 mt-0.5">
            ⭐ {totalStars} / {maxStars} stars
          </p>
        </div>
        <MusicToggle isPlaying={music.isPlaying} onToggle={music.toggle} />
      </div>

      {/* Total progress bar */}
      <div className="px-5 mb-3 shrink-0">
        <div className="w-full h-3 bg-sky-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-sky-400"
            animate={{ width: `${maxStars > 0 ? (totalStars / maxStars) * 100 : 0}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Lesson grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {LESSONS.map(lesson => (
            <LessonTile
              key={lesson.id}
              lesson={lesson}
              progress={progress}
              onSelect={onSelectLesson}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
