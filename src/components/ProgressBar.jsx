import { motion } from 'framer-motion'

export default function ProgressBar({ current, total, color }) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}
