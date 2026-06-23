import { motion } from 'framer-motion'

export default function MusicToggle({ isPlaying, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.85 }}
      className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow
                 flex items-center justify-center text-2xl"
      aria-label={isPlaying ? 'Mute music' : 'Play music'}
    >
      {isPlaying ? '🎵' : '🔇'}
    </motion.button>
  )
}
