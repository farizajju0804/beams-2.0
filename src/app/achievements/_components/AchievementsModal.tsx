'use client'; // This indicates that the component is a client component in Next.js
import React from 'react'; // Importing React
import { AiFillFire, AiFillTrophy, AiFillHeart, AiFillQuestionCircle, AiFillGift } from 'react-icons/ai'; // Importing icons from react-icons
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'; // Importing NextUI components

const AchievementsModal = () => {
  // useDisclosure hook to manage the modal's open/close state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // RuleItem component for displaying individual achievement items
  const RuleItem = ({ icon, title, description }: any) => (
    <div className="flex items-start space-x-3"> {/* Flex container for the rule item */}
      <div className="flex-shrink-0"> {/* Prevents icon from shrinking */}
        {icon} {/* Icon for the achievement */}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3> {/* Title of the achievement */}
        <p className="text-sm opacity-80">{description}</p> {/* Description of the achievement */}
      </div>
    </div>
  );

  // Function to render the modal overlay
  const renderOverlay = () => {
    return (
      <Modal 
        size='2xl' // Size of the modal
        isOpen={isOpen} 
        onOpenChange={onOpenChange} // Handler for opening/closing the modal
        scrollBehavior="inside" // Control modal scroll behavior
        backdrop="blur" // Background blur effect
        className="bg-background" // Background class for modal
        hideCloseButton={true} // Hides the default close button
        classNames={{
          wrapper: 'z-[110]' // Set z-index for modal wrapper
        }}
      >
        <ModalContent>
          {(onClose) => ( // Render the modal content
            <>
              <ModalHeader className="flex flex-col gap-1"> {/* Modal header */}
                <h2 className="text-2xl font-bold text-text">Unlock Achievements & Earn Badges</h2> {/* Header text */}
              </ModalHeader>
              <ModalBody className="text-text"> {/* Modal body */}
                <div className="space-y-8"> {/* Space between items */}
                  {/* RuleItem components for displaying achievement rules */}
                  <RuleItem 
                    icon={<AiFillFire className="text-orange-500" size={24} />} // Fire icon for the first rule
                    title="Complete Activities & Earn Badges"
                    description="Badges are earned through completing specific tasks. Each badge comes with unique activities, and extra beams await upon completion!"
                  />
                  <RuleItem 
                    icon={<AiFillTrophy className="text-green-500" size={24} />} // Trophy icon for the second rule
                    title="Showcase Your Achievements"
                    description="Your earned badges will be proudly displayed on your dashboard. Flaunt them and show the world your progress!"
                  />
                  <RuleItem 
                    icon={<AiFillGift className="text-blue-500" size={24} />} // Gift icon for the third rule
                    title="Exclusive Rewards for Each Badge"
                    description="Each completed badge brings with it not only bragging rights but exclusive rewards and extra beams to boost your progress!"
                  />
                  <RuleItem 
                    icon={<AiFillHeart className="text-red-500" size={24} />} // Heart icon for the fourth rule
                    title="Stay Inspired"
                    description="Celebrate each step of your journey and stay motivated as you climb higher."
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
                  Let&apos;s Unlock Some Badges! {/* Button text */}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className='w-full flex justify-between px-6 my-4 md:px-8'> {/* Main container for the modal trigger */}
      <div className="flex flex-col items-start"> {/* Column for title and underline */}
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Victory Vault</h1> {/* Title */}
        <div className="border-b-2 border-brand mb-3 w-[60px]"></div> {/* Underline for title */}
      </div>
      <Button isIconOnly className='bg-transparent text-[#a2a2a2] cursor-pointer' onPress={onOpen}> {/* Button to open modal */}
        <AiFillQuestionCircle size={24} /> {/* Question icon */}
      </Button>
      {renderOverlay()} {/* Render the modal overlay */}
    </div>
  );
};

export default AchievementsModal; // Exporting the AchievementsModal component for use in other parts of the application
