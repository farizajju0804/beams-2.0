'use client'
import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft2, ArrowRight2, Award } from 'iconsax-react'
import Link from 'next/link';

// Define the interface for the component props
interface VictoryVaultProps {
  badges: any; // Array of badge objects passed to the component
  color: string; // Color used for styling links
}

// VictoryVault component
const VictoryVault: React.FC<VictoryVaultProps> = ({ badges, color }) => {
  // Ref to the scrollable div
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // State to track the visibility of scroll shadows
  const [showLeftShadow, setShowLeftShadow] = useState(false)
  const [showRightShadow, setShowRightShadow] = useState(false)

  // Function to handle scroll event and show/hide shadows based on scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftShadow(scrollLeft > 0) // Show left shadow if scrolled right
      setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 1) // Show right shadow if scrolled left
    }
  }

  // Effect to handle initial scroll state and window resizing
  useEffect(() => {
    handleScroll()
    // Add resize event listener to handle window resizing
    window.addEventListener('resize', handleScroll)
    return () => window.removeEventListener('resize', handleScroll)
  }, [])

  // Function to scroll left or right by a specified amount
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200 // Set scroll amount
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' }) // Smooth scroll
    }
  }

  return (
    <div className="relative max-w-md w-full">
      <div className="w-full bg-background rounded-3xl shadow-defined flex flex-col items-center justify-center max-w-md relative overflow-hidden">
        {/* Header section with title and icon */}
        <div className="flex items-center bg-yellow w-full justify-center py-2 rounded-t-3xl">
          <Award variant='Bold' size={20} className="mr-2 text-purple" />
          <h2 className="text-sm text-purple md:text-lg font-poppins font-semibold">My Victory Vault</h2>
        </div>
        
        {/* Conditional rendering based on the presence of badges */}
        {badges.length === 0 ? (
          <div className="px-4 flex flex-col items-center py-4">
            <p className="text-center text-sm mb-3 text-grey-4">
              Start unlocking badges to fill your Victory Vault!
            </p>
            <Image
              src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1729337158/achievements/badge-fallback-group_rejblk.webp"
              alt="Badge"
              width={1000}
              height={100}
              className="w-72 object-cover h-14"
            />
          </div>
        ) : (
          // Display the list of badges if available
          <div className="relative w-full px-4 py-4">
            {/* Left shadow gradient */}
            {showLeftShadow && (
              <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-background to-transparent z-10" />
            )}
            
            {/* Right shadow gradient */}
            {showRightShadow && (
              <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-background to-transparent z-10" />
            )}
            
            <div
              ref={scrollRef}
              className="flex items-center space-x-6 overflow-x-auto scrollbar-hide relative"
              onScroll={handleScroll}
            >
              {/* Map through badges to display each badge as a link */}
              {badges.map((badge: any) => (
                <Link
                  key={badge.id}
                  href={`/achievements/#${badge.achievementId}`}
                  className="flex-shrink-0"
                >
                  <div className="w-16 h-16 relative">
                    <Image
                      src={badge.achievement.badgeImageUrl}
                      alt={`Badge ${badge.achievement.id}`}
                      layout="fill"
                      className="object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center pb-4">
          <Link
            href="/achievements/#victory"
            style={{ color }}
            className="text-sm underline font-medium hover:opacity-80"
          >
            {badges.length === 0 ? "Explore Badges" : "View My Badges"}
          </Link>
        </div>
      </div>

      {/* Scroll buttons positioned half outside */}
      {showLeftShadow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-full p-2 shadow-lg z-20"
        >
          <ArrowLeft2 size={20} className="text-grey-4" />
        </button>
      )}
      {showRightShadow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-background rounded-full p-2 shadow-lg z-20"
        >
          <ArrowRight2 size={20} className="text-grey-4" />
        </button>
      )}
    </div>
  )
}

export default VictoryVault