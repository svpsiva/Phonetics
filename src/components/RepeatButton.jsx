import { motion } from 'framer-motion'

export default function RepeatButton({ onPlay, isSpeaking, color }) {
  return (
    <motion.button
      onClick={onPlay}
      disabled={isSpeaking}
      whileTap={{ scale: 0.92 }}
      className="w-full min-h-[56px] rounded-2xl text-lg font-body font-bold
                 flex items-center justify-center gap-2 border-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        color,
        borderColor: color,
        backgroundColor: `${color}15`,
      }}
    >
      <span>🔁</span>
      <span>Again</span>
    </motion.button>
  )
}
