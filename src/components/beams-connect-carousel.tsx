'use client'

import { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react'

interface BeamsConnection {
  id: string;
  title: string;
  thumbnail: string;
  isCompleted: boolean;
}

interface BeamsConnectCarouselProps {
  games: BeamsConnection[];
}

export default function BeamsConnectCarousel({ games }: BeamsConnectCarouselProps) {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    emblaApi && emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    emblaApi && emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const handleCardClick = (id: string) => {
    router.push(`/connection-game/${id}`);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <h1 className="text-2xl px-4 font-poppins mb-4 font-semibold">Beams Connect</h1>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {games.map((game, index) => (
            <div 
              key={game.id} 
              className="flex-[0_0_100%] min-w-0 cursor-pointer"
              onClick={() => handleCardClick(game.id)}
            >
              <motion.div 
                className="relative h-[80vh] flex items-center justify-center p-8 transition-transform hover:scale-[0.99]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: currentIndex === index ? 1 : 0, scale: currentIndex === index ? 1 : 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={game.thumbnail}
                    alt={game.title}
                    fill
                    className="object-cover"
                    priority={index === currentIndex}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
                </div>
                <div className="relative z-10 text-center max-w-3xl">
                  <AnimatePresence>
                    {currentIndex === index && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-black/50 p-4 rounded-lg backdrop-blur-sm"
                      >
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 shadow-text">
                          {game.title}
                        </h2>
                        <div className="mt-4">
                          <button 
                            className={`px-6 py-2 font-semibold rounded-full transition-colors ${
                              game.isCompleted 
                                ? 'bg-success text-white' 
                                : 'bg-primary text-white'
                            }`}
                          >
                            {game.isCompleted ? 'View Solution' : 'Play Now'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop navigation buttons */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-20 hidden md:block"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
      >
        <ArrowLeft2 className="w-8 h-8" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-20 hidden md:block"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
      >
        <ArrowRight2 className="w-8 h-8" />
      </button>

      {/* Mobile navigation buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 md:hidden z-20">
        <button
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
        >
          <ArrowLeft2 className="w-5 h-5" />
        </button>
        <button
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
        >
          <ArrowRight2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}