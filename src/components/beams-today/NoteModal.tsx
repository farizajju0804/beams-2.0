'use client';
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Textarea, Chip } from '@nextui-org/react';
import { Note } from 'iconsax-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { saveNote } from '@/actions/beams-today/saveUserNote';
import { toast, Toaster } from 'react-hot-toast';
import FormattedDate from './FormattedDate'; // Importing the FormattedDate component

interface NoteModalProps {
  id: string;
  title: string;
}

const NoteModal: React.FC<NoteModalProps> = ({ id, title }) => {
  const user = useCurrentUser(); // Ensure this returns an object with a user property
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [note, setNote] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleNoteChange = (e: React.ChangeEvent<unknown>) => {
    const target = e.target as HTMLTextAreaElement;
    const value = target.value;
    if (value.length <= 1000) {
      setNote(value);
      setCharCount(value.length);
    }
  };

  const handleSaveNote = async () => {
    if (user) {
      await saveNote(id, note);
      toast.success('Note saved successfully!');
      onClose();
    }
  };

  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  return (
    <>
      <Toaster position="top-center" />
      <Button startContent={<Note className='text-white'/>} color='primary' className='text-white' onPress={onOpen}>Note</Button>
      <Modal isOpen={isOpen} onClose={onClose} size='3xl' className='h-[70vh]'>
        <ModalContent className='py-2 px-6'>
          <>
            <ModalHeader className="flex justify-start items-center">
              <div className="flex flex-col">
                <span className="text-xl font-bold">{title}</span>
              </div>
              
            </ModalHeader>
            <ModalBody className="bg-brand-100 rounded-3xl w-full flex flex-col justify-between pb-4 px-4">
              <Textarea
                value={note}
                color={'secondary'}
                onChange={handleNoteChange}
                placeholder="Type your note here..."
                width="100%"
                maxLength={1000}
                minRows={120}
                size='lg'
                classNames={{base: 'border-none' }}
                className="bg-transparent w-full rounded-md border-none flex-grow"
              />
              <div className='flex items-center justify-between w-full'>
              <Chip className="text-sm bg-black text-white py-1 px-3">
                <FormattedDate date={currentDate} />
              </Chip>
              <Chip size='sm' className="text-right bg-white text-sm mt-2">{1000 - charCount} Remaining</Chip>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <Button  variant="light" onPress={onClose}>
                Cancel
              </Button>
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

export default NoteModal;
