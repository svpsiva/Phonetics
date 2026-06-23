import { motion } from 'framer-motion'

export default function StarBadge({ earned, total }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          initial={i === earned - 1 ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.7, delay: i === earned - 1 ? 0 : 0 }}
          style={{ fontSize: 'clamp(16px, 4vw, 22px)' }}
        >
          {i < earned ? '⭐' : '☆'}
        </motion.span>
      ))}
    </div>
  )
}
