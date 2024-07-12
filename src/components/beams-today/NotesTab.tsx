'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Trash } from 'iconsax-react';
import { toast,Toaster } from 'react-hot-toast';
import { removeNote } from '@/actions/beams-today/removeNote';

interface NotesTabProps {
  notes: any[];
}

const NotesTab: React.FC<NotesTabProps> = ({ notes }) => {
  const router = useRouter();
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const handleDelete = async (noteId: string) => {
    try {
      await removeNote(noteId);
      toast.success('Note deleted successfully');
      setSelectedNote(null);
      // Optionally, refresh the page or remove the note from the state
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, noteId: string) => {
    e.preventDefault();
    router.push(`/beams-today/${noteId}`);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedNote(noteId);
  };

  return (
    <>
      <Toaster position="top-center" />

    <div className="mt-4">
      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        notes.map((note) => (
          <Card key={note.id} className="mb-4 cursor-pointer" onClick={(e) => handleCardClick(e, note.beamsTodayId)}>
            <CardHeader>
              <p className="text-lg font-bold">{note.beamsToday.title}</p>
            </CardHeader>
            <CardBody>
              <p>{note.note}</p>
            </CardBody>
            <CardFooter>
              <Button
                color="danger"
                startContent={<Trash size="20" />}
                onClick={(e) => handleButtonClick(e, note.id)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))
      )}

      <Modal placement='center' isOpen={selectedNote !== null} onClose={() => setSelectedNote(null)}>
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
