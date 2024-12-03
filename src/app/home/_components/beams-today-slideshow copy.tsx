'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { Button, Chip } from '@nextui-org/react'
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react'
import { useRouter } from 'next/navigation'

export interface Slide {
    id: string
    title: string
    thumbnailUrl: string | null
    category: {
      name: string
    }
    date: Date
  }
  
  

interface BeamsSlideshowProps {
  slides: Slide[]
}

export function BeamsSlideshow({ slides }: BeamsSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
 const router = useRouter()
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

  const currentSlide = slides[currentIndex]

  return (
  
    <div onClick={() => router.push(`/beams-today/${currentSlide.id}`)} className="relative cursor-pointer mt-2 mb-6 w-full max-w-5xl mx-auto">
      <div className="absolute top-[6px] left-0 z-10">
        <Link 
          href="/beams-today"
          onClick={(e) => e.stopPropagation() }
          className="bg-yellow px-4 py-2 text-lg md:text-xl font-poppins text-black font-semibold transition-colors"
        >
          Beams Today
        </Link>
      </div>

      {currentSlide.category && (
        <div className="absolute top-4 right-4 z-10">
          <Chip className="text-sm rounded-full">
            {currentSlide.category.name}
          </Chip>
        </div>
      )}

        <div className="relative h-[400px] w-full overflow-hidden ">
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
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentSlide.thumbnailUrl})` }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm">
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
      

      {/* Navigation Buttons */}
      <div className="absolute inset-x-0 bottom-4 flex gap-4 inset-y-0 left-4 right-4 flex-row items-center justify-between">
        <Button
           isIconOnly
          className={cn(
            "bg-default-100 transition-all duration-300 ease-in-out z-10",
            direction === -1 && "bg-primary text-white"
          )}
          onClick={() => paginate(-1)}
        >
          <ArrowLeft2 className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          isIconOnly
          className={cn(
            "bg-default-100 transition-all duration-300 ease-in-out z-10",
            direction === 1 && "bg-primary text-white"
          )}
          onClick={() => paginate(1)}
        >
          <ArrowRight2 className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
    </div>
    
  )
}

