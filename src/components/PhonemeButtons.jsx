import { motion } from 'framer-motion'

export default function PhonemeButtons({ parts, sounds, onPlayPhoneme, onPlaySequence, isSpeaking, color }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Individual phoneme pills */}
      <div className="flex gap-2 justify-center flex-wrap">
        {parts.map((part, i) => (
          <motion.button
            key={i}
            onClick={() => onPlayPhoneme(sounds[i])}
            disabled={isSpeaking}
            whileTap={{ scale: 0.88 }}
            className="min-w-[60px] min-h-[52px] px-3 rounded-xl font-display border-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color,
              borderColor: color,
              backgroundColor: `${color}18`,
              fontSize: 'clamp(18px, 5vw, 26px)',
            }}
          >
            {part}
          </motion.button>
        ))}
      </div>

      {/* Play all sounds sequentially */}
      <motion.button
        onClick={() => onPlaySequence(sounds)}
        disabled={isSpeaking}
        whileTap={{ scale: 0.93 }}
        className="w-full min-h-[52px] rounded-2xl text-lg font-body font-bold
                   flex items-center justify-center gap-2 border-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          color,
          borderColor: color,
          backgroundColor: `${color}10`,
        }}
      >
        <span>▶</span>
        <span>Play All Sounds</span>
      </motion.button>
    </div>
  )
}
