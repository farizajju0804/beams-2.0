'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft2, ArrowRight2 } from "iconsax-react"


interface BeamPost {
  id: string
  title: string
  shortDesc: string
  thumbnailUrl: string | null
  category: {
    name: string
  }
}

interface BeamsTodayCarouselProps {
  beams: BeamPost[]
}

export default function BeamsTodayCarousel({ beams }: BeamsTodayCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-poppins font-semibold">Beams Today</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            className="rounded-full transition-opacity duration-300 disabled:opacity-50"
            aria-label="Previous slide"
          >
            <ArrowLeft2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            className="rounded-full transition-opacity duration-300 disabled:opacity-50"
            aria-label="Next slide"
          >
            <ArrowRight2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex pb-4 -ml-4">
          {beams.map((beam) => (
            <div key={beam.id} className="cursor-pointer flex-[0_0_100%] min-w-0 pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
              <Link href={`/beams-today/${beam.id}`} className="block">
                <Card className="max-w-sm  border-default-200 shadow-none overflow-hidden transition-transform duration-300">
                  <CardContent className="p-0">
                    {beam.thumbnailUrl && (
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <Image
                          src={beam.thumbnailUrl}
                          alt={beam.title}
                          fill
                          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-default-100">
                        {beam.category.name}
                      </div>
                      <h2 className="mb-3 text-lg md:text-xl font-bold leading-tight transition-colors">
                        {beam.title}
                      </h2>
                      <p className="text-sm text-default-600">
                        {beam.shortDesc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}