"use client"; // Indicates that this component will be rendered on the client-side

import React, { useState, useRef } from "react"; // Importing React and hooks for state management
import Image from "next/image"; // Importing Next.js Image component for optimized images
import ScratchCard from "@/app/beams-facts/_components/ScratchCard"; // Importing the ScratchCard component for revealing facts
import { markFactAsCompleted } from "@/actions/fod/fod"; // Importing the function to mark facts as completed

import DateComponent from "./DateComponent"; // Importing DateComponent for displaying the date

import {  AiFillQuestionCircle, AiFillStar } from 'react-icons/ai'; // Importing icons for rules
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'; // Importing NextUI components

import { RiFileListLine } from 'react-icons/ri'; // Importing history icon
import { GiCardRandom } from 'react-icons/gi'; // Importing scratch card icon
// Defining the props type for the FactOfTheDay component
interface FactOfTheDayProps {
  userId: string; // User ID for tracking fact completion
  facts: any; // Fact data passed as props
}



const RuleItem = ({ icon, title, description }: any) => (
  <div className="flex items-start space-x-3"> {/* Flex container for the rule item */}
    <div className="flex-shrink-0 mt-1"> {/* Prevents icon from shrinking */}
      {icon} {/* Icon for the feature item */}
    </div>
    <div>
      <h3 className="font-semibold">{title}</h3> {/* Title of the feature item */}
      <p className="text-sm opacity-80">{description}</p> {/* Description of the feature item */}
    </div>
  </div>
);

// Function to render the modal overlay



// Functional component definition
const FactOfTheDay: React.FC<FactOfTheDayProps> = ({ userId, facts }) => {
  // State to track whether the fact is revealed
  const [isRevealed, setIsRevealed] = useState(false);
  // State to store the current fact
  const [fact, setFact] = useState<any | null>(facts.fact);
  // State to track whether the fact has been completed
  const [isCompleted, setIsCompleted] = useState(facts.completed);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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

  const renderOverlay = () => {
    return (
      <Modal 
        size='2xl' // Size of the modal
        isOpen={isOpen} 
        onOpenChange={onOpenChange} // Handler for opening/closing the modal
        scrollBehavior="inside" // Control modal scroll behavior
        backdrop="blur" // Background blur effect
        className="bg-background" // Background class for modal
        classNames={{
          wrapper: 'z-[110]' // Set z-index for modal wrapper
        }}
      >
        <ModalContent>
          {(onClose) => ( // Render the modal content
            <>
              <ModalHeader className="flex flex-col gap-1"> {/* Modal header */}
                <h2 className="text-2xl mx-auto font-bold text-text">Daily Facts</h2> {/* Header text */}
              </ModalHeader>
              <ModalBody className="text-text"> {/* Modal body */}
                <div className="space-y-8"> {/* Space between items */}
                  {/* RuleItem components for displaying product features */}
                  <RuleItem 
                    icon={<AiFillStar className="text-red-500" size={24} />} // Star icon
                    title="Engaging Daily Facts"
                    description="Discover fun and interesting facts daily, each consumable in less than 30 seconds."
                  />
                  <RuleItem 
                    icon={<GiCardRandom className="text-blue-500" size={24} />} // Scratch card icon
                    title="Scratch Card Mechanism"
                    description="Reveal the fact of the day through an interactive scratch card experience."
                  />
                 
                  <RuleItem 
                    icon={<RiFileListLine className="text-green-500" size={24} />} // History icon
                    title="Access Past Facts"
                    description="Review and explore past facts to stay informed and never miss out."
                  />
                  
                 
                </div>
              </ModalBody>
              <ModalFooter> {/* Modal footer */}
                <Button 
                  color="warning" 
                  variant="shadow"
                  onPress={onClose} // Closes the modal when pressed
                  className="mt-4 w-full text-black font-lg font-semibold"
                >
                  Start Discovering!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className="w-full mb-2 text-left relative max-w-sm md:rounded-3xl mx-auto">
          <div className="px-6 lg:px-0 flex justify-between items-start lg:items-center">
            <div className="w-full flex-1">
              <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">
                Fact Of The Day {/* Display the title of the fact */}
              </h1>
              <div className="border-b-2 border-brand mb-4 w-full" style={{ maxWidth: '10%' }}></div>
            </div>
            <Button isIconOnly className='bg-transparent text-[#a2a2a2] cursor-pointer' onPress={onOpen}> {/* Button to open modal */}
        <AiFillQuestionCircle size={24} /> {/* Question icon */}
      </Button>
      {renderOverlay()} {/* Render the modal overlay */}
          </div>
          {fact ? ( // Check if there is a fact to display
        <>
          <div className="w-full relative max-w-sm shadow-defined-top mx-auto h-[390px] rounded-lg">
            {isCompleted ? ( // Check if the fact is completed
              <div className="max-w-sm w-full h-full relative">
                <Image
                  src={fact.finalImage} // Show the final image of the fact
                  alt="fact" // Alternative text for the image
                  priority={true} // Load image with priority
                  layout="fill"
                  style={{ objectFit: "cover" }} // Cover the area of the container
                  className="z-2 w-full h-full aspect-auto lg:rounded-lg" // Additional styling
                />
                <h1 className="absolute top-2 left-3 z-20 text-lg text-black font-poppins font-semibold mb-[1px]">
                {fact.title}
              </h1>
        
              {fact?.date && ( 
                  <div className="absolute top-2  right-3 z-10">
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
