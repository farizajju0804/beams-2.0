import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'iconsax-react'
import confetti from 'canvas-confetti'

interface ScratchCardProps {
  scratchImage: string;
  finalImage: string;
  onReveal: () => void;
}

const SCRATCH_THRESHOLD = 0.8

const useScratchCard = (scratchImage: string, finalImage: string, threshold: number, onReveal: () => void) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isScratching, setIsScratching] = useState(false)
  const [scratchPercentage, setScratchPercentage] = useState(0)

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const scratchImg = new Image()
      scratchImg.src = scratchImage
      scratchImg.crossOrigin = "anonymous"

      scratchImg.onload = () => {
        ctx.drawImage(scratchImg, 0, 0, canvas.width, canvas.height)
      }
    }
  }, [scratchImage])

  const revealAll = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    setIsRevealed(true)
    setScratchPercentage(1)
    onReveal()
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }, [onReveal])

  const handleScratch = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      const x = (e as React.TouchEvent<HTMLCanvasElement>).touches
        ? (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientX - rect.left
        : (e as React.MouseEvent<HTMLCanvasElement>).clientX - rect.left
      const y = (e as React.TouchEvent<HTMLCanvasElement>).touches
        ? (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientY - rect.top
        : (e as React.MouseEvent<HTMLCanvasElement>).clientY - rect.top

      const adjustedX = x * scaleX
      const adjustedY = y * scaleY

      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(adjustedX, adjustedY, 20, 0, 2 * Math.PI)
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
    isScratching,
    scratchPercentage, 
    handleScratch,
    setIsScratching,
    revealAll
  }
}

const ScratchCard: React.FC<ScratchCardProps> = ({ scratchImage, finalImage, onReveal }) => {
  const { 
    canvasRef, 
    isRevealed, 
    isScratching,
    scratchPercentage, 
    handleScratch, 
    setIsScratching,
  } = useScratchCard(scratchImage, finalImage, SCRATCH_THRESHOLD, onReveal)

  return (
    <div className="relative w-full h-full bg-white rounded-lg shadow-xl overflow-hidden">
      <img 
        src={finalImage} 
        alt="Final image" 
        className="absolute inset-0 w-full h-full object-cover"
      />
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
        className={`absolute inset-0 w-full h-full cursor-pointer ${isRevealed ? 'pointer-events-none' : ''}`}
      />
      {!isRevealed && scratchPercentage === 0 && (
        <div className="absolute z-[10] inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-text bg-background p-2 text-lg font-semibold">Scratch here!</p>
        </div>
      )}
      <div className="absolute bottom-2 left-2 text-xs text-background bg-text bg-opacity-50 px-2 py-1 rounded">
        {Math.round(scratchPercentage * 100)}% scratched
      </div>
    </div>
  )
}

export default ScratchCard