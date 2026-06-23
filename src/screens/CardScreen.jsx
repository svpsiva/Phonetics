import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import EmojiCard from '../components/EmojiCard'
import SoundButton from '../components/SoundButton'
import NavButton from '../components/NavButton'
import ProgressBar from '../components/ProgressBar'
import StarBadge from '../components/StarBadge'

export default function CardScreen({
  item,
  lesson,
  cardIndex,
  totalCards,
  starsEarned,
  isSpeaking,
  onPlayWord,
  onBack,
  backDisabled,
  onSkip,
  onHome,
}) {
  const [isPulsing, setIsPulsing] = useState(false)

  const pulse = useCallback(() => {
    setIsPulsing(true)
    setTimeout(() => setIsPulsing(false), 600)
  }, [])

  const handlePlayWord = useCallback(() => {
    pulse()
    onPlayWord()
  }, [pulse, onPlayWord])

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ backgroundColor: lesson.bgColor }}
    >
      {/* Top bar: lesson title + progress + home button */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-2 shrink-0">
        <div className="flex-1">
          <p className="font-display text-base text-center mb-1.5" style={{ color: lesson.color }}>
            {lesson.title}
          </p>
          <ProgressBar current={cardIndex} total={totalCards} color={lesson.color} />
        </div>
        <motion.button
          onClick={onHome}
          whileTap={{ scale: 0.88 }}
          className="w-[48px] h-[48px] rounded-full flex items-center justify-center
                     text-xl shadow-md bg-white/80 backdrop-blur-sm shrink-0"
          aria-label="Home"
        >
          🏠
        </motion.button>
      </div>

      {/* Emoji */}
      <div className="flex-1 flex items-center justify-center min-h-0 px-4">
        <EmojiCard emoji={item.emoji} word={item.word} isPulsing={isPulsing} />
      </div>

      {/* Word display */}
      <div className="px-6 pb-2 text-center shrink-0">
        <motion.p
          key={item.id + '-display'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="font-display leading-none"
          style={{ fontSize: 'clamp(56px, 14vw, 96px)', color: lesson.color }}
        >
          {item.display}
        </motion.p>
        <p className="font-body text-base text-gray-400 mt-1">{item.phonetic}</p>
        {item.hint && (
          <p className="font-body text-sm text-gray-400 mt-0.5">{item.hint}</p>
        )}
      </div>

      {/* Audio button */}
      <div className="px-5 pb-2 shrink-0">
        <SoundButton
          onPlay={handlePlayWord}
          isSpeaking={isSpeaking}
          color={lesson.color}
          word={item.word}
        />
      </div>

      {/* Stars */}
      <div className="shrink-0">
        <StarBadge earned={starsEarned} total={totalCards} />
      </div>

      {/* Bottom nav: back + skip */}
      <div className="flex items-center justify-between px-6 pb-5 pt-2 shrink-0">
        <NavButton direction="back" onClick={onBack} disabled={backDisabled} label="Go back" />
        <NavButton direction="forward" onClick={onSkip} label="Skip" />
      </div>
    </div>
  )
}
