import { motion } from 'framer-motion'

export default function PhonemeButtons({ parts, sounds, onPlayPhoneme, onPlaySequence, isSpeaking, color }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-center flex-wrap">
        {parts.map((part, i) => (
          <motion.button
            key={i}
            onClick={() => onPlayPhoneme(sounds[i])}
            disabled={isSpeaking}
            whileTap={{ scale: 0.88 }}
            className="px-5 py-3 rounded-full font-display text-2xl
                       bg-white/80 shadow-md backdrop-blur-sm
                       disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color }}
          >
            {part}
          </motion.button>
        ))}
      </div>
      <motion.button
        onClick={() => onPlaySequence(sounds)}
        disabled={isSpeaking}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3 rounded-2xl font-display text-lg
                   bg-white/60 shadow-md backdrop-blur-sm
                   disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ color }}
      >
        ▶ Play All Sounds
      </motion.button>
    </div>
  )
}
