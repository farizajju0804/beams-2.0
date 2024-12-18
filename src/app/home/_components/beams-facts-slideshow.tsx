'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { Button, Chip } from '@nextui-org/react'
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react'
import { FactModal } from '@/app/beams-facts/_components/FactModal'

export interface Slide {
    id: string
    title: string
    thumbnail: string 
    category: {
      name: string
      color: string
    }
    hashtags: string[]
    fact: string
    whyItsImportant: string
    date: Date
    completed: boolean
}

interface BeamsSlideshowProps {
  slides: Slide[]
  userId: string
}

export function BeamsFactsSlideshow({ slides, userId }: BeamsSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [selectedFact, setSelectedFact] = useState<Slide | null>(null)
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection
      if (nextIndex < 0) return slides.length - 1
      if (nextIndex >= slides.length) return 0
      return nextIndex
    })
  }

  const handleModalClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation() // Prevent event from bubbling up
    }
    setSelectedFact(null)
  }

  const handleSlideClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event from bubbling up
    const currentSlide = slides[currentIndex]
    
    // If the clicked slide is the same as the currently selected one, close the modal
    if (selectedFact && selectedFact.id === currentSlide.id) {
      setSelectedFact(null)
    } else {
      // Otherwise, open the modal with the clicked slide
      setSelectedFact(currentSlide)
    }
  }

  const currentSlide = slides[currentIndex]

  return (
    <div className="relative cursor-pointer mt-4 mb-8 w-full max-w-5xl mx-auto">
      <div className="absolute top-[5px] md:top-[6px] left-0 z-10">
        <Link 
          href="/beams-facts"
          className="bg-purple text-sm md:text-lg font-poppins text-yellow px-3 py-2 font-semibold transition-colors"
        >
          Beams Facts
        </Link>
      </div>

     

      <div className="relative h-[360px] md:h-[400px] w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
            className="absolute inset-0"
            onClick={handleSlideClick}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentSlide.thumbnail})` }}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80  to-black/10 backdrop-blur-sm">
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h2 className="text-white text-xl md:text-4xl font-bold mb-4">
                  {currentSlide.title}
                </h2>
                <p className="text-white/80 text-sm md:text-base">
                  {new Date(currentSlide.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
 
      {selectedFact && (
        <FactModal
          isOpen={!!selectedFact}
          onClose={handleModalClose}
          fact={selectedFact}
          userId={userId}
        />
      )}

      <div className="absolute inset-x-0 bottom-4 flex gap-4 inset-y-0 left-4 right-4 flex-row items-center justify-between">
        <Button
          isIconOnly
          size='sm'
          
          className={cn(
            "bg-default-100 min-w-0 w-7 h-7 md:w-8 md:h-8 transition-all duration-300 ease-in-out z-10",
            direction === -1 && "bg-primary text-white"
          )}
          onClick={(e) => {
            e.stopPropagation()
            paginate(-1)
          }}
        >
          <ArrowLeft2 className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          isIconOnly
          size='sm'
         
          className={cn(
            "bg-default-100  min-w-0 w-7 h-7 md:w-8 md:h-8 transition-all duration-300 ease-in-out z-10",
            direction === 1 && "bg-primary text-white"
          )}
          onClick={(e) => {
            e.stopPropagation()
            paginate(1)
          }}
        >
          <ArrowRight2 className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
    </div>
  )
}