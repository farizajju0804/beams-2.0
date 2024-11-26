'use client'; // This indicates that the component is a client component in Next.js
import React from 'react'; // Importing React
import {  AiFillHeart, AiFillQuestionCircle, AiFillStar, AiFillTrophy } from 'react-icons/ai'; // Importing icons for rules
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'; // Importing NextUI components
import { FaPollH } from 'react-icons/fa'; // Importing poll icon
import {  MdNoteAlt } from 'react-icons/md'; // Importing note-taking icon
import { RiFileListLine } from 'react-icons/ri'; // Importing history icon
import { BsSoundwave,} from 'react-icons/bs'; // Importing audio and video icons

const BeamsTodayModal = () => {
  // useDisclosure hook to manage the modal's open/close state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // RuleItem component for displaying individual feature items
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
                <h2 className="text-2xl mx-auto font-bold text-text">Beams Today </h2> {/* Header text */}
              </ModalHeader>
              <ModalBody className="text-text"> {/* Modal body */}
                <div className="space-y-8"> {/* Space between items */}
                  {/* RuleItem components for displaying product features */}
                  <RuleItem 
                    icon={<AiFillStar className="text-indigo-500" size={24} />} // Heart icon
                    title="Fascinating Daily Topics"
                    description="Explore engaging topics that can be consumed in less than 2 minutes."
                  />
                  <RuleItem 
                    icon={<BsSoundwave className="text-blue-500" size={24} />} // Audio icon
                    title="Available in Multiple Formats"
                    description="Consume content in audio, video, and text formats to match your preference."
                  />
                  <RuleItem 
                    icon={<MdNoteAlt className="text-teal-500" size={24} />} // Note-taking icon
                    title="Take Notes"
                    description="Add personal notes while engaging with the content for future reference."
                  />
                  <RuleItem 
                    icon={<AiFillHeart className="text-red-500" size={24} />} // Star icon
                    title="Add to Favorites"
                    description="Save topics that interest you to your favorites for easy access later."
                  />
                  <RuleItem 
                    icon={<RiFileListLine className="text-purple" size={24} />} // History icon
                    title="Access Past Topics"
                    description="Review and engage with past topics to stay informed and catch up on missed content."
                  />
                  <RuleItem 
                    icon={<FaPollH className="text-orange-500" size={24} />} // Poll icon
                    title="Polls for Each Topic"
                    description="Participate in interactive polls to share your opinions and insights."
                  />
                  <RuleItem 
                    icon={<AiFillTrophy className="text-green-500" size={24} />} // Trophy icon for rewards
                    title="Earn Beams"
                    description="Gain beams by completing any format (audio, video, text) and participating in polls. This encourages daily engagement and boosts your progress!"
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
                  Start Exploring!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className='w-full lg:w-4/6 px-4 lg:px-4 max-w-4xl mx-auto flex justify-between my-3'> {/* Main container for the modal trigger */}
      <div className="flex flex-col items-start"> {/* Column for title and underline */}
        <h1 className="text-lg md:text-2xl mx-auto text-text font-poppins font-semibold mb-[1px]">Topic Of The Day</h1> {/* Title */}
        <div className="border-b-2 border-brand mb-3 w-[60px]"></div> {/* Underline for title */}
      </div>
      <Button isIconOnly className='bg-transparent text-[#a2a2a2] cursor-pointer' onPress={onOpen}> {/* Button to open modal */}
        <AiFillQuestionCircle size={24} /> {/* Question icon */}
      </Button>
      {renderOverlay()} {/* Render the modal overlay */}
    </div>
  );
}

export default BeamsTodayModal; // Exporting the BeamsTodayModal component for use in other parts of the application
