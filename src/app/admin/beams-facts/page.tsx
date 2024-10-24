'use client'

import { useState, useEffect } from 'react';
import { 
  Button, 
  Input, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { FactOfTheday } from '@prisma/client';
import { getFacts, createFact, updateFact, deleteFact } from './_actions/facts';
import { toast, Toaster } from 'react-hot-toast';
import { Calendar } from "@nextui-org/react";
import { CalendarDate} from "@internationalized/date";

interface FactFormProps {
  fact?: FactOfTheday;
  onSubmit: (data: Omit<FactOfTheday, 'id'>) => void;
  onCancel: () => void;
}

function FactForm({ fact, onSubmit, onCancel }: FactFormProps) {
  const [date, setDate] = useState<CalendarDate | undefined>(() => {
    if (fact) {
      const factDate = new Date(fact.date);
      return new CalendarDate(factDate.getUTCFullYear(), factDate.getUTCMonth() + 1, factDate.getUTCDate());
    }
    return undefined;
  });
  const [title, setTitle] = useState(fact?.title || '');
  const [finalImage, setFinalImage] = useState(fact?.finalImage || '');
  const [scratchImage, setScratchImage] = useState(fact?.scratchImage || '');

  const handleDateChange = (value: CalendarDate) => {
    setDate(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!date || !title || !finalImage) {
      toast.error('Please fill in all required fields (Date, Title, and Final Image)');
      return;
    }

    const formattedDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
    const data: any = {
      date: formattedDate,
      title,
      finalImage,
      scratchImage: scratchImage || null,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='space-y-4'>
        <Calendar
          value={date}
          onChange={handleDateChange}
          className="rounded-md border"
        />
        <Input
          name="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          isRequired
        />
        <Input
          name="finalImage"
          label="Final Image URL"
          value={finalImage}
          onChange={(e) => setFinalImage(e.target.value)}
          isRequired
        />
        <Input
          name="scratchImage"
          label="Scratch Image URL (Optional)"
          value={scratchImage}
          onChange={(e) => setScratchImage(e.target.value)}
        />
      </div>
      <div className='mt-4 flex gap-4'>
        <Button color="primary" className='text-white' type="submit">Submit</Button>
        <Button color="default" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const [facts, setFacts] = useState<FactOfTheday[]>([]);
  const [selectedFact, setSelectedFact] = useState<FactOfTheday | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [factToDelete, setFactToDelete] = useState<string | null>(null);
 
  const fetchData = async () => {
    try {
      const fetchedFacts = await getFacts();
      setFacts(fetchedFacts);
    } catch (error) {
      toast.error('Failed to fetch facts');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (data: Omit<FactOfTheday, 'id'>) => {
    try {
      await createFact(data);
      onClose();
      fetchData();
      toast.success('Fact created successfully');
    } catch (error) {
      toast.error('Failed to create fact');
    }
  };

  const handleUpdate = async (data: Partial<Omit<FactOfTheday, 'id'>>) => {
    if (!selectedFact) return;
    try {
      await updateFact(selectedFact.id, data);
      onClose();
      fetchData();
      toast.success('Fact updated successfully');
    } catch (error) {
      toast.error('Failed to update fact');
    }
  };

  const handleDelete = async (id: string) => {
    setFactToDelete(id);
  };

  const confirmDelete = async () => {
    if (!factToDelete) return;
    try {
      await deleteFact(factToDelete);
      setFactToDelete(null);
      fetchData();
      toast.success('Fact deleted successfully');
    } catch (error) {
      toast.error('Failed to delete fact');
    }
  };

  return (
    <>
    <Toaster position='top-center'/>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fact of the Day Admin</h1>
      
      <Button color="primary" onClick={() => { setSelectedFact(null); onOpen(); }} className="mb-8 text-white">
        Create New Fact
      </Button>

      <Table aria-label="Fact of the Day table">
        <TableHeader>
          <TableColumn>Date</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {facts.map((fact) => (
            <TableRow key={fact.id}>
              <TableCell>{new Date(fact.date).toISOString().split('T')[0]}</TableCell>
              <TableCell>{fact.title}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button color="warning" size="sm" onClick={() => { setSelectedFact(fact); onOpen(); }}>Edit</Button>
                  <Button color="danger" size="sm" onClick={() => handleDelete(fact.id)}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{selectedFact ? 'Edit' : 'Create'} Fact</ModalHeader>
          <ModalBody>
            <FactForm 
              fact={selectedFact || undefined} 
              onSubmit={selectedFact ? handleUpdate : handleCreate}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={!!factToDelete} onClose={() => setFactToDelete(null)}>
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this fact? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={() => setFactToDelete(null)}>Cancel</Button>
            <Button color="danger" onClick={confirmDelete}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
    </>
  );
}