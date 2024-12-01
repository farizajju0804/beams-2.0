'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Lamp, 
  Flash, 
  Cpu, 
  Radio
} from 'iconsax-react'

const quotes = [
  "Innovation is the calling card of the future.",
  "The best way to predict the future is to create it.",
  "Technology is best when it brings people together.",
  "The only way to discover the limits of the possible is to go beyond them into the impossible.",
  "The advance of technology is based on making it fit in so that you don't really even notice it.",
]

// Define icons as an array of components
const iconComponents = [
  Lamp,
  Flash,
  Cpu,
  Radio
] as const

type IconComponent = typeof iconComponents[number]

export default function DailyHeader() {
  const [quote, setQuote] = useState('')
  const [Icon, setIcon] = useState<IconComponent | null>(null)

  useEffect(() => {
    const date = new Date()
    const index = date.getDate() % quotes.length
    setQuote(quotes[index])
    setIcon(iconComponents[index])
  }, [])

  return (
    <div className="relative  md:rounded-3xl mb-8 overflow-hidden bg-gradient-to-br from-[#f96f2e] to-[#f7cd61] text-white">
  

      {/* Header content */}
      <div className="relative px-6 py-6 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'loop',
            }}
            className="mb-6 flex justify-center"
          >
            {Icon && (
              <Icon 
                size={80}
                color="white"
                variant="Bold"
              />
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="mb-2 text-5xl font-bold font-poppins tracking-tight sm:text-6xl drop-shadow-md"
          >
            Beams
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-4 text-xl font-medium text-white/90"
          >
            Illuminating minds, one innovation at a time
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg font-semibold italic text-white"
          >
            &ldquo;{quote}&rdquo;
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
        >
          <svg
            viewBox="0 0 1440 120"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0L48 8.875C96 17.75 192 35.5 288 44.375C384 53.25 480 53.25 576 44.375C672 35.5 768 17.75 864 26.625C960 35.5 1056 71 1152 79.875C1248 88.75 1344 71 1392 62.125L1440 53.25V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}