"use client"

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'iconsax-react'
import confetti from 'canvas-confetti'

const SCRATCH_THRESHOLD = 0.7

const useScratchCard = (threshold: number) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isScratching, setIsScratching] = useState(false)
  const [scratchPercentage, setScratchPercentage] = useState(0)

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.fillStyle = '#CCCCCC'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  const revealAll = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    setIsRevealed(true)
    setScratchPercentage(1)
    
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }, [])

  const handleScratch = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = (e as React.TouchEvent<HTMLCanvasElement>).touches
        ? (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientX - rect.left
        : (e as React.MouseEvent<HTMLCanvasElement>).clientX - rect.left
      const y = (e as React.TouchEvent<HTMLCanvasElement>).touches
        ? (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientY - rect.top
        : (e as React.MouseEvent<HTMLCanvasElement>).clientY - rect.top

      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, 20, 0, 2 * Math.PI)
      ctx.fill()

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const scratchedPixels = imageData.data.filter((x, i) => i % 4 === 3 && x === 0).length
      const totalPixels = imageData.data.length / 4
      const newScratchPercentage = scratchedPixels / totalPixels

      setScratchPercentage(newScratchPercentage)
      if (newScratchPercentage >= threshold && !isRevealed) {
        revealAll()
      }
    }
  }, [isScratching, isRevealed, revealAll, threshold])

  useEffect(() => {
    initCanvas()
  }, [initCanvas])

  return { 
    canvasRef, 
    isRevealed, 
    scratchPercentage, 
    handleScratch,
    setIsScratching,
    revealAll
  }
}

export default function Component() {
  const { 
    canvasRef, 
    isRevealed, 
    scratchPercentage, 
    handleScratch, 
    setIsScratching,
    revealAll
  } = useScratchCard(SCRATCH_THRESHOLD)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="relative w-64 h-64 bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isRevealed ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex flex-col items-center justify-center"
          >
            <Check className="w-16 h-16 text-white mb-2" />
            <p className="text-white text-xl font-bold">You Won!</p>
          </motion.div>
        </div>
        <canvas
          ref={canvasRef}
          width={256}
          height={256}
          onMouseDown={() => setIsScratching(true)}
          onMouseUp={() => setIsScratching(false)}
          onMouseLeave={() => setIsScratching(false)}
          onTouchStart={() => setIsScratching(true)}
          onTouchEnd={() => setIsScratching(false)}
          onMouseMove={handleScratch}
          onTouchMove={handleScratch}
          className={`absolute inset-0 cursor-pointer ${isRevealed ? 'pointer-events-none' : ''}`}
        />
        {!isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-700 text-lg font-semibold">Scratch here!</p>
          </div>
        )}
        <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
          {Math.round(scratchPercentage * 100)}% scratched
        </div>
      </div>
    </div>
  )
}