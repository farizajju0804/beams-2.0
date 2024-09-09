'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Trash } from 'iconsax-react';
import { toast, Toaster } from 'react-hot-toast';
import { removeNote } from '@/actions/beams-today/removeNote';

interface NotesTabProps {
  notes: any[];
}

/**
 * NotesTab component displays a list of user's notes related to Beams Today topics.
 * Each note can be deleted or clicked to navigate to the topic's page.
 */
const NotesTab: React.FC<NotesTabProps> = ({ notes }) => {
  const router = useRouter();
  const [selectedNote, setSelectedNote] = useState<string | null>(null); // Modal state to confirm note deletion

  // Handle note deletion with confirmation modal
  const handleDelete = async (noteId: string) => {
    try {
      await removeNote(noteId); // API call to delete the note
      toast.success('Note deleted successfully'); // Show success notification
      setSelectedNote(null); // Close the modal
      router.refresh(); // Refresh the page to update the notes list
    } catch (error) {
      toast.error('Failed to delete note'); // Show error notification if deletion fails
    }
  };

  // Handle clicking on the card to navigate to the topic page
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, noteId: string) => {
    e.preventDefault();
    router.push(`/beams-today/${noteId}`); // Navigate to the topic detail page
  };

  // Open confirmation modal when delete button is clicked
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedNote(noteId); // Set the selected note to be deleted
  };

  return (
    <>
  

      <div className="mt-4 min-h-[50vh]">
        {notes.length === 0 ? (
          <p>No notes found.</p> // Show message if no notes are available
        ) : (
          notes.map((note) => (
            <div key={note.id} className="mb-4 cursor-pointer" onClick={(e) => handleCardClick(e, note.beamsTodayId)}>
              <Card>
                <CardHeader>
                  <p className="text-lg font-bold">{note.beamsToday.title}</p>
                </CardHeader>
                <CardBody>
                  <p>{note.note}</p> {/* Display the note content */}
                </CardBody>
                <CardFooter>
                  <Button
                    color="danger"
                    startContent={<Trash size="20" />}
                    onClick={(e) => handleButtonClick(e, note.id)} // Trigger delete confirmation
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))
        )}

        {/* Confirmation modal for deleting the note */}
        <Modal placement='center' isOpen={selectedNote !== null} className='z-[1100]' onClose={() => setSelectedNote(null)}>
          <ModalContent>
            <ModalHeader>Delete Note</ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this note?</p>
            </ModalBody>
            <ModalFooter>
              <Button onPress={() => setSelectedNote(null)}>Cancel</Button>
              <Button color="danger" onPress={() => handleDelete(selectedNote!)}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default NotesTab;
