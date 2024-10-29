'use client'; // This indicates that the component is a client component in Next.js
import React from 'react'; // Importing React
import { AiFillFire, AiFillRocket, AiFillHeart, AiFillQuestionCircle } from 'react-icons/ai'; // Importing icons from react-icons
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'; // Importing NextUI components
import { FaFlag } from 'react-icons/fa'; // Importing the flag icon

const LevelsModal = () => {
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
                <h2 className="text-2xl font-bold text-text">Level Up & Earn Beams</h2> {/* Header text */}
              </ModalHeader>
              <ModalBody className="text-text"> {/* Modal body */}
                <div className="space-y-8"> {/* Space between items */}
                  {/* RuleItem components for displaying level rules */}
                  <RuleItem 
                    icon={<AiFillRocket className="text-blue-500" size={24} />} // Rocket icon for the first rule
                    title="Progress Through Levels"
                    description="As you gather more beams, you will level up! Keep pushing to reach higher levels!"
                  />
                  <RuleItem 
                    icon={<AiFillFire className="text-red-500" size={24} />} // Fire icon for the second rule
                    title="Earn Beams Through Activities"
                    description="Earn beams by engaging in content, and participating in polls. The more active you are, the faster you level up!"
                  />
                  <RuleItem 
                    icon={<FaFlag className="text-green-500" size={24} />} // Flag icon for the third rule
                    title="Unlock Achievements"
                    description="Achieve special badges and milestones as you reach certain levels. These will be a mark of your hard work and dedication!"
                  />
                  <RuleItem 
                    icon={<AiFillHeart className="text-pink-500" size={24} />} // Heart icon for the fourth rule
                    title="Stay Motivated"
                    description="Every time you level up, you get closer to the future! Don’t forget to check out your achievements and celebrate your progress!"
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
                  I&apos;m Ready to Level Up! {/* Button text */}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className='w-full flex justify-between px-6 md:px-8 my-4'> {/* Main container for the modal trigger */}
      <div className="flex flex-col items-start"> {/* Column for title and underline */}
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Levels</h1> {/* Title */}
        <div className="border-b-2 border-brand mb-3 w-[60px]"></div> {/* Underline for title */}
      </div>
      <Button isIconOnly className='bg-transparent text-[#a2a2a2] cursor-pointer' onPress={onOpen}> {/* Button to open modal */}
        <AiFillQuestionCircle size={24} /> {/* Question icon */}
      </Button>
      {renderOverlay()} {/* Render the modal overlay */}
    </div>
  );
}

export default LevelsModal; // Exporting the LevelsModal component for use in other parts of the application
