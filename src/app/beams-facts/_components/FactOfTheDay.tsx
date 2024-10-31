"use client"; // Indicates that this component will be rendered on the client-side

import React, { useState, useRef } from "react"; // Importing React and hooks for state management
import Image from "next/image"; // Importing Next.js Image component for optimized images
import ScratchCard from "@/app/beams-facts/_components/ScratchCard"; // Importing the ScratchCard component for revealing facts
import { markFactAsCompleted } from "@/actions/fod/fod"; // Importing the function to mark facts as completed

import DateComponent from "./DateComponent"; // Importing DateComponent for displaying the date

// Defining the props type for the FactOfTheDay component
interface FactOfTheDayProps {
  userId: string; // User ID for tracking fact completion
  facts: any; // Fact data passed as props
}

// Functional component definition
const FactOfTheDay: React.FC<FactOfTheDayProps> = ({ userId, facts }) => {
  // State to track whether the fact is revealed
  const [isRevealed, setIsRevealed] = useState(false);
  // State to store the current fact
  const [fact, setFact] = useState<any | null>(facts.fact);
  // State to track whether the fact has been completed
  const [isCompleted, setIsCompleted] = useState(facts.completed);

  // Get the current date in 'en-CA' format
  const clientDate = new Date().toLocaleDateString("en-CA");
  console.log("fod",clientDate)
  // Ref to prevent multiple reveals
  const revealLock = useRef(false);

  // Function to handle the reveal of the scratch card
  const handleReveal = async () => {
    // Prevent reveal if already revealed, completed, or if reveal is locked
    if (isRevealed || isCompleted || !fact || revealLock.current) {
      return;
    }

    // Lock the reveal action
    revealLock.current = true;
    // Set the state to revealed
    setIsRevealed(true);

    try {
      // Mark the fact as completed in the backend
      const result = await markFactAsCompleted(userId, fact.id, clientDate);
      setIsCompleted(true); // Update completed state

      if (result) {
        // Logic if marking completed was successful (currently empty)
      } else {
        console.log("Achievement already completed, no streak modal shown");
      }
      
    } catch (error) {
      console.error("Error marking fact as completed:", error); // Log any errors
    } finally {
      revealLock.current = false; // Unlock reveal action
    }
  };

  return (
    <div className="w-full mb-2 text-left relative max-w-md md:rounded-3xl mx-auto">
      {fact ? ( // Check if there is a fact to display
        <>
          <div className="px-6 lg:px-0 flex justify-between items-start lg:items-center">
            <div className="w-full flex-1">
              <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">
                {fact.title} {/* Display the title of the fact */}
              </h1>
              <div className="border-b-2 border-brand mb-4 w-full" style={{ maxWidth: '10%' }}></div>
            </div>
          </div>
          <div className="w-full relative max-w-md shadow-defined-top mx-auto h-[390px] rounded-lg">
            {isCompleted ? ( // Check if the fact is completed
              <div className="max-w-md w-full h-full relative">
                <Image
                  src={fact.finalImage} // Show the final image of the fact
                  alt="fact" // Alternative text for the image
                  priority={true} // Load image with priority
                  layout="fill"
                  style={{ objectFit: "cover" }} // Cover the area of the container
                  className="z-2 w-full h-full aspect-auto lg:rounded-lg" // Additional styling
                />
        
              {fact?.date && ( 
                  <div className="absolute top-2  right-2 z-10">
                    <DateComponent date={fact.date.toISOString().split('T')[0]} /> 
                  </div>
                )}
            
              </div>
              
            ) : ( // If the fact is not completed, show the ScratchCard
               <div className="max-w-md w-full h-full relative">
              <ScratchCard
                scratchImage={fact.scratchImage ? fact.scratchImage : 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1727699559/fact%20of%20the%20day/wrap_zd7veo.png'} // Use the provided scratch image or a default one
                finalImage={fact.finalImage} // Image to show after revealing
                onReveal={handleReveal} // Function to call when revealed
              />
              {fact?.date && ( 
                <div className="absolute top-2  right-20 -z-10">
                  <DateComponent date={fact.date.toISOString().split('T')[0]} /> 
                </div>
              )}
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-lg text-left md:text-center font-semibold text-grey-500 pl-6 md:pl-0">
          No fact available for today {/* Message for no available facts */}
        </p>
      )}
    </div>
  );
};

export default FactOfTheDay; // Exporting the component for use in other parts of the application
