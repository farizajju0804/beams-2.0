'use client'; // Ensure the component is rendered on the client side in a Next.js environment.

import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Textarea, Chip } from '@nextui-org/react'; // Import UI components from NextUI.
import { Edit2, Note } from 'iconsax-react'; // Icons for editing and note creation.
import { useCurrentUser } from '@/hooks/use-current-user'; // Custom hook to fetch the current user information.
import { getNote, saveNote } from '@/actions/beams-today/saveUserNote'; // Actions to fetch and save user notes.
import { toast, Toaster } from 'react-hot-toast'; // Toast notifications for user feedback.
import FormattedDate from './FormattedDate'; // Component to format and display the current date.

interface NoteModalProps {
  id: string; // Unique identifier for the note or topic.
  title: string; // Title of the note/topic to display in the modal header.
}

const NoteModal: React.FC<NoteModalProps> = ({ id, title }) => {
  const user = useCurrentUser(); // Retrieve the current user information.
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control hooks.
  
  const [note, setNote] = useState(''); // State to store the user's note.
  const [charCount, setCharCount] = useState(0); // State to track the number of characters in the note.
  const [isExistingNote, setIsExistingNote] = useState(false); // State to track if a note already exists.

  // Effect to fetch an existing note when the modal opens.
  useEffect(() => {
    let isMounted = true;

    const fetchNote = async () => {
      if (user) { // Only proceed if a user is logged in.
        const existingNote = await getNote(id); // Fetch the note using the provided ID.
        if (isMounted && existingNote) {
          setNote(existingNote.note); // Set the fetched note in the state.
          setCharCount(existingNote.note.length); // Update the character count based on the note length.
          setIsExistingNote(true); // Mark that an existing note was found.
        }
      }
    };

    if (isOpen) { // Only fetch the note when the modal is open.
      fetchNote();
    }

    return () => {
      isMounted = false; // Cleanup to avoid state updates after unmount.
    };
  }, [id, user, isOpen]); // Dependencies to trigger the effect.

  // Handler for text area input changes, limiting the character count to 1000.
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      setNote(value); // Update the note state with the new value.
      setCharCount(value.length); // Update the character count.
    }
  };

  // Handler to save the note.
  const handleSaveNote = async () => {
    if (user) { // Ensure a user is logged in before saving.
      await saveNote(id, note); // Save the note via the API or action.
      toast.success('Note saved successfully!'); // Show success toast notification.
      onClose(); // Close the modal after saving.
    }
  };

  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in the YYYY-MM-DD format.

  return (
    <>
      <Toaster position="top-center" /> {/* For displaying toast notifications */}
      <Button
        size="sm"
        isIconOnly
        startContent={isExistingNote ? <Edit2 size={20} className='text-gray-2' /> : <Note size={20} className='text-grey-2' />} // Display Edit icon if note exists, otherwise Note icon.
        className='bg-grey-1'
        onPress={onOpen} // Open the modal when the button is clicked.
      />
      <Modal isOpen={isOpen} onClose={onClose} size='3xl' placement="top-center" hideCloseButton>
        <ModalContent className='py-2 px-2 md:px-6'>
          <>
            <ModalHeader className="flex justify-start items-center">
              <div className="flex flex-col">
                <span className="text-xl font-bold">{title}</span> {/* Display the title in the modal header */}
              </div>
            </ModalHeader>
            <ModalBody className="bg-brand-100 rounded-3xl w-full flex flex-col justify-between pb-4 px-2 md:px-4 flex-grow">
              {/* Text area for writing or editing the note */}
              <Textarea
                value={note} // Bind the note value to the text area.
                color={'secondary'}
                onChange={(e) => handleNoteChange(e as unknown as React.ChangeEvent<HTMLTextAreaElement>)} // Handle text input changes.
                placeholder="Type your note here..."
                width="100%" // Full width text area.
                maxLength={1000} // Limit the note to 1000 characters.
                minRows={120} // Minimum height for the text area.
                size='lg'
                classNames={{ base: 'border-none', input: 'text-text' }} // Custom styles.
                className="bg-transparent w-full rounded-md border-none flex-grow"
              />
              <div className='flex items-center justify-between w-full mt-4'>
                {/* Display the current date in the modal */}
                <Chip className="text-sm bg-text text-background py-1 px-3">
                  <FormattedDate date={currentDate} /> {/* Formatted date component */}
                </Chip>
                {/* Display the remaining character count */}
                <Chip size='sm' className="text-right bg-background text-sm mt-2">
                  {1000 - charCount} Remaining
                </Chip>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              {/* Cancel button to close the modal without saving */}
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              {/* Save button to save the note */}
              <Button color="primary" className='text-white' onPress={handleSaveNote}>
                Save
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NoteModal; // Export the NoteModal component for use elsewhere.
