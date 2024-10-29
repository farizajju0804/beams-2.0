import React from 'react'; // Import React
import Image from 'next/image'; // Import Next.js Image component for optimized images
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@nextui-org/react"; // Import necessary components from NextUI

// Define the interface for the component props
interface StatCardProps {
  title: string; // Title of the stat card
  value: string | number; // Value displayed on the card (can be a string or a number)
  imageSrc: string; // Source URL of the image
  modalContent: React.ReactNode; // Content to be displayed in the modal
  viewLabel: string; // Label for the view button
  showViewLabel: boolean; // Flag to determine if the view label should be shown
}

// StatCard component
const StatCard: React.FC<StatCardProps> = ({ title, value, imageSrc, modalContent, viewLabel, showViewLabel }) => {
  // Use disclosure hook for managing modal open/close state
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Main card container */}
      <div className="bg-background rounded-2xl shadow-defined p-4 md:p-6 flex items-center justify-between">
        {/* Left section for title, value, and button */}
        <div className="flex flex-col items-start">
          <h4 className="text-sm md:text-lg font-semibold text-text">{title}</h4> {/* Card title */}
          <p className="text-2xl md:text-4xl font-poppins my-3 font-bold bg-gradient-to-b from-brand to-yellow text-transparent bg-clip-text">
            {value} {/* Card value with gradient text */}
          </p>
          {/* Conditional rendering of the view button */}
          {showViewLabel && 
            <Button 
              size="sm" 
              className="text-xs text-grey-2 md:text-sm bg-transparent rounded-full underline transition-all p-0 duration-300"
              onClick={onOpen} // Open modal on click
            >
              {viewLabel} {/* View label text */}
            </Button>
          }
        </div>
        {/* Image displayed on the right side of the card */}
        <Image src={imageSrc} alt={title} width={100} height={100} className="w-16 h-16" />
      </div>

      {/* Modal component for detailed view */}
      <Modal 
        isOpen={isOpen} // Control modal visibility
        onClose={onClose} // Close modal function
        scrollBehavior="inside" // Modal scroll behavior
        backdrop="blur" // Blur the background when modal is open
        size="3xl" // Modal size
        classNames={{
          wrapper: 'z-[110]' // z-index for modal wrapper
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-text font-poppins">{title}</h2> {/* Modal header with title */}
          </ModalHeader>
          <ModalBody className='px-4 py-0'>
            <div className="max-h-[80vh] overflow-y-auto"> {/* Scrollable content area */}
              {modalContent} {/* Content passed to modal */}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StatCard; // Export the component for use in other parts of the application
