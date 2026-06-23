import { motion } from 'framer-motion'
import ConfettiOverlay from '../components/ConfettiOverlay'
import { LESSONS } from '../data/lessons'

export default function CompletionScreen({ lesson, starsEarned, onHome, onNextLesson, onRepeat, hasNextLesson }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="h-full w-full flex flex-col items-center justify-center px-6 gap-6"
      style={{ backgroundColor: lesson.bgColor }}
    >
      <ConfettiOverlay colors={[lesson.color, '#FFD700', '#FF6B6B', '#4ECDC4']} />

      {/* Trophy */}
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ fontSize: 'clamp(72px, 20vw, 120px)' }}
      >
        🏆
      </motion.div>

      {/* Heading */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-4xl"
          style={{ color: lesson.color }}
        >
          You did it!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-body text-lg text-gray-500 mt-1"
        >
          {lesson.title} complete!
        </motion.p>
      </div>

      {/* Stars */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', bounce: 0.5 }}
        className="flex gap-2"
      >
        {Array.from({ length: lesson.items.length }).map((_, i) => (
          <span key={i} style={{ fontSize: 'clamp(22px, 6vw, 36px)' }}>
            {i < starsEarned ? '⭐' : '☆'}
          </span>
        ))}
      </motion.div>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-3 max-w-sm">
        {hasNextLesson && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onClick={onNextLesson}
            whileTap={{ scale: 0.94 }}
            className="w-full min-h-[68px] rounded-2xl text-white text-xl font-display
                       flex items-center justify-center gap-2 shadow-lg"
            style={{ backgroundColor: lesson.color }}
          >
            <span>Next Lesson</span>
            <span>→</span>
          </motion.button>
        )}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          onClick={onRepeat}
          whileTap={{ scale: 0.94 }}
          className="w-full min-h-[60px] rounded-2xl text-lg font-body font-bold
                     flex items-center justify-center gap-2 border-2"
          style={{ color: lesson.color, borderColor: lesson.color, backgroundColor: `${lesson.color}15` }}
        >
          🔁 Play Again
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          onClick={onHome}
          whileTap={{ scale: 0.94 }}
          className="w-full min-h-[52px] rounded-2xl text-gray-500 text-base font-body
                     flex items-center justify-center gap-2"
        >
          🏠 Home
        </motion.button>
      </div>
    </motion.div>
  )
}
