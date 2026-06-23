import { motion } from 'framer-motion'

export default function SoundButton({ onPlay, isSpeaking, color }) {
  return (
    <motion.button
      onClick={onPlay}
      disabled={isSpeaking}
      whileTap={{ scale: 0.92 }}
      className="w-full min-h-[72px] rounded-2xl text-white text-2xl font-display
                 flex items-center justify-center gap-3 shadow-lg
                 disabled:opacity-60 disabled:cursor-not-allowed
                 transition-opacity"
      style={{ backgroundColor: color, boxShadow: `0 6px 20px ${color}55` }}
    >
      <span style={{ fontSize: 28 }}>{isSpeaking ? '🔊' : '🔈'}</span>
      <span>{isSpeaking ? 'Playing…' : 'Play Sound'}</span>
    </motion.button>
  )
}
