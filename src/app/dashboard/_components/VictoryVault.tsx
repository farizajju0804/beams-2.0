'use client'
import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft2, ArrowRight2, Award, Shield } from 'iconsax-react'
import { UserAchievement } from '@prisma/client';
import Link from 'next/link';


interface VictoryVaultProps {
  badges: any;
  color : string;
}

const VictoryVault: React.FC<VictoryVaultProps> = ({ badges,color }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftShadow, setShowLeftShadow] = useState(false)
  const [showRightShadow, setShowRightShadow] = useState(false)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftShadow(scrollLeft > 0)
      setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    handleScroll()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-background gap-3 text-text pb-4 rounded-3xl shadow-defined flex flex-col items-center justify-center max-w-md">
      <div className="flex items-center bg-yellow w-full justify-center py-2 rounded-t-3xl">
        <Award variant='Bold' size={20} className="mr-2" />
        <h2 className="text-sm md:text-lg font-poppins font-semibold">My Victory Vault</h2>
      </div>
      
      {badges.length === 0 ? (
        <div className='px-4 flex flex-col items-center'>
        <p className="text-center  text-sm text-grey-2">Start unlocking badges to fill your Victory Vault!</p>
        <Image
                    src={"https://res.cloudinary.com/drlyyxqh9/image/upload/v1729076438/achievements/badge-fallback-group_au6dos.webp"}
                    alt={`Badge`}
                    width={1000}
                    height={100}
                    objectFit="cover"
                    className="w-60  h-16"
                  />
      </div>
      ) : (
        <div className="relative px-4">
          <div
            ref={scrollRef}
            className="flex items-center justify-center space-x-6 overflow-x-auto scrollbar-hide"
            onScroll={handleScroll}
          >
            {badges.map((badge:any) => (
             <Link
              key={badge.id}
                href={`/achievements/#${badge.achievementId}`}
                className="flex-shrink-0"
              >
                <div className="w-16 h-12 relative">
                  <Image
                    src={badge.achievement.badgeImageUrl}
                    alt={`Badge ${badge.achievement.id}`}
                    layout="fill"
                    objectFit="cover"
                    className=""
                  />
                </div>
              </Link>
            ))}
          </div>
          {showLeftShadow && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-grey-2 bg-opacity-75 rounded-full p-1 shadow-md"
            >
              <ArrowLeft2 size={16} className="text-grey-1" />
            </button>
          )}
          {showRightShadow && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-grey-2 bg-opacity-75 rounded-full p-1 shadow-md"
            >
              <ArrowRight2 size={16} className="text-grey-1" />
            </button>
          )}
        </div>
      )}
      
   
        <div className="text-center">
        <Link
            href="/achievements/#victory"
            style={{ color: color }}

            className="text-sm underline font-medium"
          >
            {badges.length === 0 ? "Explore Badges" : "View My Badges"}
          </Link>
        </div>
     
    </div>
  )
}

export default VictoryVault