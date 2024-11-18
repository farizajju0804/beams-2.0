'use client'; // This indicates that the component is a client component in Next.js
import React from 'react'; // Importing React
import { AiFillClockCircle, AiOutlineBulb, AiOutlineTrophy, AiOutlineSync, AiFillQuestionCircle, AiFillTrophy, AiFillBulb } from 'react-icons/ai'; // Importing icons for rules
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'; // Importing NextUI components
import { FaGamepad } from 'react-icons/fa'; // Importing the gamepad icon
import { BsImageFill } from 'react-icons/bs';

const ConnectionModal = () => {
  // useDisclosure hook to manage the modal's open/close state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // RuleItem component for displaying individual level items
  const RuleItem = ({ icon, title, description }: any) => (
    <div className="flex items-start space-x-3"> {/* Flex container for the rule item */}
      <div className="flex-shrink-0"> {/* Prevents icon from shrinking */}
        {icon} {/* Icon for the level item */}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3> {/* Title of the level item */}
        <p className="text-sm opacity-80">{description}</p> {/* Description of the level item */}
      </div>
    </div>
  );

  // Function to render the modal overlay
  const renderOverlay = () => {
    return (
      <Modal 
        size='2xl' // Size of the modal
        hideCloseButton={true} // Hides the default close button
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
                <h2 className="text-2xl font-bold text-text">Game Rules</h2> {/* Header text */}
              </ModalHeader>
              <ModalBody className="text-text"> {/* Modal body */}
                <div className="space-y-8"> {/* Space between items */}
                  {/* RuleItem components for displaying game rules */}
                  <RuleItem 
                    icon={<BsImageFill className="text-green-500" size={24} />} // Gamepad icon
                    title="Answer Using Image Clues"
                    description="Use the provided image clues to guess the answer, which could be a place, object, or concept."
                  />
                   <RuleItem 
                    icon={<AiFillClockCircle className="text-pink-500" size={24} />} // Jumbled letters icon (use creative replacement)
                    title="Jumbled Letters"
                    description="A 15-character string is provided as a visual clue. The answer is NOT within these characters but serves to create suspense."
                  />
                  <RuleItem 
                    icon={<FaGamepad className="text-cyan-500" size={24} />} // Input boxes icon (use creative replacement)
                    title="Answer Format"
                    description="If the answer has one word, only one input box appears. For multi-word answers, there will be multiple input boxes."
                  />
                  <RuleItem 
                    icon={<AiFillClockCircle className="text-red-500" size={24} />} // Clock icon for timing
                    title="60-Second Timer"
                    description="You have only 60 seconds to answer each question. Make sure to think fast!"
                  />
                  <RuleItem 
                    icon={<AiFillBulb className="text-teal-500" size={24} />} // Bulb icon for hints
                    title="Hints for Clues"
                    description="Hints are available if you get stuck, but using them will reduce your beams reward."
                  />
               <RuleItem 
                    icon={<AiFillTrophy className="text-indigo-500" size={24} />} // Trophy icon for rewards
                    title="Dynamic Beams Rewards"
                    description="Beams are rewarded based on how quickly you solve the challenge and if it's solved on the day of publication. Solving after the day of publication will not count toward beams addition. Early solvers gain more beams!"
                  />
  
                    <RuleItem 
                    icon={<AiOutlineSync className="text-blue-500" size={24} />} // Refresh icon
                    title="Daily Reset"
                    description="Each day, a new challenge is presented. You only have one chance to solve it per day."
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
                  I&apos;m Ready to Play!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className='w-full max-w-4xl flex justify-between px-6  my-4'> {/* Main container for the modal trigger */}
      <div className="flex flex-col items-start"> {/* Column for title and underline */}
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Beams Connection</h1> {/* Title */}
        <div className="border-b-2 border-brand mb-3 w-[60px]"></div> {/* Underline for title */}
      </div>
      <Button isIconOnly className='bg-transparent text-[#a2a2a2] cursor-pointer' onPress={onOpen}> {/* Button to open modal */}
        <AiFillQuestionCircle size={24} /> {/* Question icon */}
      </Button>
      {renderOverlay()} {/* Render the modal overlay */}
    </div>
  );
}

export default ConnectionModal; // Exporting the ConnectionModal component for use in other parts of the application
