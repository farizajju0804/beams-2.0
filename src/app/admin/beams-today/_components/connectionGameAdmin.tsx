'use client'

import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
  Spinner,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Edit2, Trash } from "iconsax-react";
import { ConnectionGame, BeamsToday } from '@prisma/client';
import { 
  createConnectionGame, 
  updateConnectionGame, 
  deleteConnectionGame 
} from '../_actions/admin/connectionGame';

interface ConnectionGameFormData {
  id?: string;
  title: string;
  answer: string;
  hint: string;
  image: string;
  beamsTodayId: string;
}

interface BeamsTodayTopic {
  id: string;
  title: string;
}

interface ConnectionGameAdminProps {
  initialGames: ConnectionGame[];
  beamsTodayTopics: BeamsTodayTopic[];
}

export const ConnectionGameAdmin: React.FC<ConnectionGameAdminProps> = ({ 
  initialGames,
  beamsTodayTopics 
}) => {
  const [games, setGames] = useState<ConnectionGame[]>(initialGames);
  const [formData, setFormData] = useState<ConnectionGameFormData>({
    title: '',
    answer: '',
    hint: '',
    image: '',
    beamsTodayId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      title: '',
      answer: '',
      hint: '',
      image: '',
      beamsTodayId: ''
    });
    setIsEditing(false);
  };

  const handleEdit = (game: ConnectionGame) => {
    setFormData({
      id: game.id,
      title: game.title,
      answer: game.answer,
      hint: game.hint,
      image: game.image,
      beamsTodayId: game.beamsTodayId
    });
    setIsEditing(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsLoading(true);
      await deleteConnectionGame(deleteId);
      setGames(games.filter(game => game.id !== deleteId));
      onClose();
    } catch (error) {
      console.error("Failed to delete connection game:", error);
    } finally {
      setIsLoading(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isEditing && formData.id) {
        const { id, ...updateData } = formData;
        const updatedGame = await updateConnectionGame(id, updateData);
        setGames(games.map(game => game.id === updatedGame.id ? updatedGame : game));
      } else {
        const { id, ...createData } = formData;
        const newGame = await createConnectionGame(createData);
        setGames([newGame, ...games]);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save connection game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, beamsTodayId: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="p-4">
        <CardHeader className="flex flex-col gap-3 items-center">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Edit Connection Game' : 'Create Connection Game'}
          </h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              label="Select Beams Today Topic"
              placeholder="Select a topic"
              selectedKeys={formData.beamsTodayId ? [formData.beamsTodayId] : []}
              onChange={handleSelectChange}
              className="w-full"
            >
              {beamsTodayTopics?.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.title}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Title"
              placeholder="Enter game title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              variant="bordered"
            />

            <Input
              label="Answer"
              placeholder="Enter correct answer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              variant="bordered"
            />

            <Textarea
              label="Hint"
              placeholder="Enter hint for players"
              value={formData.hint}
              onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
              variant="bordered"
              minRows={3}
            />

            <Input
              label="Image URL"
              placeholder="Enter image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              variant="bordered"
            />

            <Button
              type="submit"
              color="primary"
              className="w-full text-white text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                isEditing ? 'Update Connection Game' : 'Create Connection Game'
              )}
            </Button>

            {isEditing && (
              <Button
                color="default"
                className="w-full"
                onClick={resetForm}
              >
                Cancel Edit
              </Button>
            )}
          </form>
        </CardBody>
      </Card>

      {/* Games Table */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Connection Games</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Connection games table">
            <TableHeader>
              <TableColumn>TITLE</TableColumn>
              <TableColumn>ANSWER</TableColumn>
              <TableColumn>HINT</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>{game.title}</TableCell>
                  <TableCell>{game.answer}</TableCell>
                  <TableCell>{game.hint}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => handleEdit(game)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        onClick={() => handleDeleteClick(game.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this connection game?
          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              color="danger" 
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : 'Delete'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};