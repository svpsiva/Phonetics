import { motion } from 'framer-motion'

export default function LessonTile({ lesson, progress, onSelect }) {
  const p = progress[lesson.id] || { stars: 0, completed: false, unlocked: false }
  const locked = !p.unlocked
  const maxStars = lesson.items.length

  return (
    <motion.button
      onClick={() => !locked && onSelect(lesson.id)}
      whileTap={locked ? {} : { scale: 0.93 }}
      className={`relative rounded-3xl p-4 flex flex-col items-center gap-2
                  shadow-md w-full transition-all
                  ${locked ? 'grayscale opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{ backgroundColor: locked ? '#e5e7eb' : lesson.bgColor, minHeight: 130 }}
    >
      {/* Lesson number badge */}
      <span
        className="absolute top-2 left-3 text-xs font-body font-bold opacity-60"
        style={{ color: lesson.color }}
      >
        {lesson.id}
      </span>

      {/* Lock overlay */}
      {locked && (
        <span className="absolute inset-0 flex items-center justify-center text-3xl opacity-40 pointer-events-none">
          🔒
        </span>
      )}

      {/* Icon */}
      <span style={{ fontSize: 40 }}>{lesson.icon}</span>

      {/* Title */}
      <span
        className="font-display text-base text-center leading-tight"
        style={{ color: locked ? '#9ca3af' : lesson.color }}
      >
        {lesson.title}
      </span>

      {/* Stars */}
      {!locked && (
        <div className="flex gap-0.5">
          {Array.from({ length: maxStars }).map((_, i) => (
            <span key={i} style={{ fontSize: 11 }}>
              {i < p.stars ? '⭐' : '☆'}
            </span>
          ))}
        </div>
      )}

      {/* Completed badge */}
      {p.completed && (
        <span className="absolute top-2 right-2 text-base">✅</span>
      )}
    </motion.button>
  )
}
