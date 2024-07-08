'use client'
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Textarea } from '@nextui-org/react';
import { Note } from 'iconsax-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { saveNote } from '@/actions/beams-today/saveUserNote';
import { toast, Toaster } from 'react-hot-toast';

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

  return (
    <>
      <Toaster position="top-center" />
      <Button endContent={<Note />} onPress={onOpen}>Note</Button>
      <Modal isOpen={isOpen} onClose={onClose} className="w-[70%]">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">Take a Note</ModalHeader>
            <ModalBody>
              <h1>Hi {user?.name}, have a nice day!</h1>
              <h2>Topic: {title}</h2>
              <Textarea
                value={note}
                onChange={handleNoteChange}
                placeholder="Type your note here..."
                width="100%"
                maxLength={1000}
                rows={10} 
              />
              <p className="text-right">{1000 - charCount} characters remaining</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={handleSaveNote}>
                Save Note
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NoteModal;
