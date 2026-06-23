import { motion } from 'framer-motion'

export default function EmojiCard({ emoji, word, isPulsing }) {
  return (
    <motion.div
      className="flex items-center justify-center w-full h-full"
      animate={
        isPulsing
          ? { scale: [1, 1.25, 1.1, 1], rotate: [0, -5, 5, 0] }
          : { y: [0, -14, 0] }
      }
      transition={
        isPulsing
          ? { duration: 0.5, ease: 'easeOut' }
          : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      <span
        role="img"
        aria-label={word}
        style={{ fontSize: 'clamp(90px, 22vw, 160px)', lineHeight: 1 }}
      >
        {emoji}
      </span>
    </motion.div>
  )
}
