'use client'; // Mark as client component for Next.js

import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Textarea, Chip } from '@nextui-org/react';
import { Edit2, Note } from 'iconsax-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { getNote, saveNote } from '@/actions/beams-today/saveUserNote';
import { toast, Toaster } from 'react-hot-toast';
import FormattedDate from './FormattedDate';

// Interface defining the required props for the NoteModal component
interface NoteModalProps {
  id: string;    // Unique identifier for the note
  title: string; // Title to display in the modal header
}

const NoteModal: React.FC<NoteModalProps> = ({ id, title }) => {
  // Custom hook to get the current user's information
  const user = useCurrentUser();
  
  // NextUI hook to handle modal open/close state
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // State management for the note component
  const [note, setNote] = useState('');                           // Stores the current note content
  const [charCount, setCharCount] = useState(0);                  // Tracks the character count of the note
  const [isExistingNote, setIsExistingNote] = useState(false);   // Indicates if we're editing an existing note
  const [isSaving, setIsSaving] = useState(false);               // Tracks the saving state for UI feedback

  // Effect hook to fetch existing note when modal opens
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after component unmount

    // Async function to fetch the note data
    const fetchNote = async () => {
      if (user) {
        try {
          // Attempt to fetch the existing note using the provided ID
          const existingNote = await getNote(id);
          
          // Only update state if the component is still mounted and we have data
          if (isMounted && existingNote) {
            setNote(existingNote.note);
            setCharCount(existingNote.note.length);
            setIsExistingNote(true);
          }
        } catch (error) {
          // Handle network-related errors when loading the note
          if (!navigator.onLine || error instanceof TypeError) {
            toast.error('Unable to load note. Please check your internet connection.');
          } else {
            // Handle other types of errors
            toast.error('Failed to load note. Please try again later.');
          }
        }
      }
    };

    // Only fetch the note when the modal is opened
    if (isOpen) {
      fetchNote();
    }

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [id, user, isOpen]); // Dependencies that trigger the effect

  // Handler for note content changes
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Enforce 1000 character limit
    if (value.length <= 1000) {
      setNote(value);
      setCharCount(value.length);
    }
  };

  // Helper function to determine if an error is network-related
  const isNetworkError = (error: unknown): boolean => {
    if (error instanceof TypeError) {
      // Network errors typically manifest as TypeErrors
      return true;
    }
    return false;
  };

  // Handler for saving the note
  const handleSaveNote = async () => {
    if (!user) return; // Exit if no user is logged in
    
    setIsSaving(true); // Start the saving process
    try {
      // Check internet connectivity before attempting to save
      if (!navigator.onLine) {
        toast.error('Unable to save note. Please check your internet connection.');
        return;
      }

      // Attempt to save the note
      await saveNote(id, note);
      toast.success('Note saved successfully!');
      onClose(); // Close the modal on successful save
    } catch (error) {
      // Handle different types of errors
      if (isNetworkError(error) || !navigator.onLine) {
        toast.error('Unable to save note. Please check your internet connection.');
      } else {
        toast.error('Failed to save note. Please try again later.');
      }
    } finally {
      setIsSaving(false); // Reset saving state regardless of outcome
    }
  };

  // Get current date for display
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <>
      {/* Toast container for notifications */}
      <Toaster position="top-center" />

      {/* Button to open the modal */}
      <Button
        size="sm"
        isIconOnly
        startContent={isExistingNote ? <Edit2 size={20} className='text-gray-2' /> : <Note size={20} className='text-grey-2' />}
        className='bg-grey-1'
        onPress={onOpen}
      />

      {/* Modal component */}
      <Modal isOpen={isOpen} onClose={onClose} size='3xl' placement="top-center" hideCloseButton>
        <ModalContent className='py-2 px-2 md:px-6'>
          <>
            {/* Modal Header */}
            <ModalHeader className="flex justify-start items-center">
              <div className="flex flex-col">
                <span className="text-xl font-bold">{title}</span>
              </div>
            </ModalHeader>

            {/* Modal Body */}
            <ModalBody className="bg-brand-100 rounded-3xl w-full flex flex-col justify-between pb-4 px-2 md:px-4 flex-grow">
              {/* Note textarea */}
              <Textarea
                value={note}
                color={'secondary'}
                onChange={(e) => handleNoteChange(e as unknown as React.ChangeEvent<HTMLTextAreaElement>)}
                placeholder="Type your note here..."
                width="100%"
                maxLength={1000}
                minRows={120}
                size='lg'
                classNames={{ base: 'border-none', input: 'text-text' }}
                className="bg-transparent w-full rounded-md border-none flex-grow"
              />

              {/* Footer information */}
              <div className='flex items-center justify-between w-full mt-4'>
                {/* Current date display */}
                <Chip className="text-sm bg-text text-background py-1 px-3">
                  <FormattedDate date={currentDate} />
                </Chip>
                {/* Character count display */}
                <Chip size='sm' className="text-right bg-background text-sm mt-2">
                  {1000 - charCount} Remaining
                </Chip>
              </div>
            </ModalBody>

            {/* Modal Footer */}
            <ModalFooter className="flex justify-between">
              {/* Cancel button */}
              <Button 
                variant="light" 
                onPress={onClose}
                isDisabled={isSaving}
              >
                Cancel
              </Button>
              {/* Save button */}
              <Button 
                color="primary" 
                className='text-white' 
                onPress={handleSaveNote}
                isLoading={isSaving}
                isDisabled={isSaving}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NoteModal;