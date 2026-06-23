import { motion } from 'framer-motion'

export default function SoundButton({ onPlay, isSpeaking, color, word }) {
  return (
    <motion.button
      onClick={onPlay}
      disabled={isSpeaking}
      whileTap={{ scale: 0.92 }}
      className="w-full min-h-[72px] rounded-2xl text-white font-display
                 flex items-center justify-center gap-3 shadow-lg
                 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        backgroundColor: color,
        boxShadow: `0 6px 20px ${color}55`,
        fontSize: 'clamp(20px, 5vw, 28px)',
      }}
    >
      <span style={{ fontSize: 'clamp(22px, 6vw, 32px)' }}>
        {isSpeaking ? '🔊' : '🔈'}
      </span>
      <span>{isSpeaking ? 'Playing…' : word}</span>
    </motion.button>
  )
}
