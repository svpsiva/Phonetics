import { motion } from 'framer-motion'

export default function NavButton({ direction, onClick, disabled, label }) {
  const isBack = direction === 'back'
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.88 }}
      className="w-[64px] h-[64px] rounded-full flex items-center justify-center
                 text-2xl shadow-md bg-white/80 backdrop-blur-sm
                 disabled:opacity-30 disabled:cursor-not-allowed"
      aria-label={label}
    >
      {isBack ? '←' : '→'}
    </motion.button>
  )
}
