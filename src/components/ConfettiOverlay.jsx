import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function ConfettiOverlay({ colors }) {
  useEffect(() => {
    const fire = (opts) => confetti({ particleCount: 60, spread: 80, ...opts })

    fire({ origin: { x: 0.2, y: 0.5 }, colors })
    setTimeout(() => fire({ origin: { x: 0.8, y: 0.4 }, colors }), 300)
    setTimeout(() => fire({ origin: { x: 0.5, y: 0.3 }, colors, particleCount: 100 }), 600)

    return () => confetti.reset()
  }, [])

  return null
}
