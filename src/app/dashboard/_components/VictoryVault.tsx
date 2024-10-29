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

  // Effect to handle initial scroll state
  useEffect(() => {
    handleScroll()
  }, [])

  // Function to scroll left or right by a specified amount
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200 // Set scroll amount
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' }) // Smooth scroll
    }
  }

  return (
    <div className="w-full bg-background gap-3 text-text pb-4 rounded-3xl shadow-defined flex flex-col items-center justify-center max-w-md">
      {/* Header section with title and icon */}
      <div className="flex items-center bg-yellow w-full justify-center py-2 rounded-t-3xl">
        <Award variant='Bold' size={20} className="mr-2 text-purple" />
        <h2 className="text-sm text-purple md:text-lg font-poppins font-semibold">My Victory Vault</h2>
      </div>
      
      {/* Conditional rendering based on the presence of badges */}
      {badges.length === 0 ? (
        // Display message when no badges are present
        <div className='px-4 flex flex-col items-center'>
          <p className="text-center text-xs mb-3 md:text-sm text-grey-2">Start unlocking badges to fill your Victory Vault!</p>
          <Image
            src={"https://res.cloudinary.com/drlyyxqh9/image/upload/v1729337158/achievements/badge-fallback-group_rejblk.webp"}
            alt={`Badge`}
            width={1000}
            height={100}
            className="w-72 object-cover h-14" // Image styling
          />
        </div>
      ) : (
        // Display the list of badges if available
        <div className="relative px-4">
          <div
            ref={scrollRef} // Attach scroll ref to the div
            className="flex items-center justify-center space-x-6 overflow-x-auto scrollbar-hide" // Flexbox for layout with horizontal scrolling
            onScroll={handleScroll} // Handle scroll events
          >
            {/* Map through badges to display each badge as a link */}
            {badges.map((badge: any) => (
              <Link
                key={badge.id} // Unique key for each badge
                href={`/achievements/#${badge.achievementId}`} // Link to achievement section
                className="flex-shrink-0" // Prevent badge from shrinking
              >
                <div className="w-16 h-12 relative">
                  <Image
                    src={badge.achievement.badgeImageUrl} // Badge image source
                    alt={`Badge ${badge.achievement.id}`} // Alt text for accessibility
                    layout="fill" // Fill parent div
                    className="object-cover" // Image styling
                  />
                </div>
              </Link>
            ))}
          </div>
          {/* Conditional buttons for scrolling left and right */}
          {showLeftShadow && (
            <button
              onClick={() => scroll('left')} // Scroll left on click
              className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-grey-2 bg-opacity-75 rounded-full p-1 shadow-md" // Button styling
            >
              <ArrowLeft2 size={16} className="text-grey-1" /> 
            </button>
          )}
          {showRightShadow && (
            <button
              onClick={() => scroll('right')} // Scroll right on click
              className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-grey-2 bg-opacity-75 rounded-full p-1 shadow-md" // Button styling
            >
              <ArrowRight2 size={16} className="text-grey-1" /> 
            </button>
          )}
        </div>
      )}
      
      {/* Link to explore badges or view collected badges */}
      <div className="text-center">
        <Link
          href="/achievements/#victory" // Link to the victory section of achievements
          style={{ color: color }} // Dynamic color for link text
          className="text-sm underline font-medium" // Link styling
        >
          {badges.length === 0 ? "Explore Badges" : "View My Badges"} 
        </Link>
      </div>
    </div>
  )
}

export default VictoryVault; // Export the component for use in other parts of the application
