'use client'

import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
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
  Switch,
  Chip,
} from "@nextui-org/react";
import { Add, Edit2, Minus, Trash } from "iconsax-react";
import { ConnectionGame } from '@prisma/client';
import FormattedDate from '@/app/beams-today/_components/FormattedDate';
import { createConnectionGame, deleteConnectionGame, updateConnectionGame } from '../admin/connectionGame';
import toast, { Toaster } from 'react-hot-toast';

// API Interfaces
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form Interface
interface ConnectionGameFormData {
  id?: string;
  title: string;
  answer: string;
  hint: string;
  firstImage: string;
  secondImage: string;
  thirdImage: string;
  referenceLink: string;
  letterChoiceStudent: string[];
  letterChoiceNonStudent: string[];
  answerExplanation: string;
  thumbnail: string;
  solutionPoints: string[];
  date: Date;
  published: boolean;
}

// Props Interface
interface ConnectionGameAdminProps {
  initialGames: ConnectionGame[];
}




const setDateToUTCMidnight = (date: Date): Date => {
  const utcDate = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  ));
  return utcDate;
};

const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const ConnectionGameAdmin: React.FC<ConnectionGameAdminProps> = ({ initialGames }) => {
  // State
  const [games, setGames] = useState<ConnectionGame[]>(initialGames);
  const [formData, setFormData] = useState<ConnectionGameFormData>({
    title: '',
    answer: '',
    hint: '',
    firstImage: '',
    secondImage: '',
    thirdImage: '',
    referenceLink: '',
    answerExplanation: '',
    thumbnail: '',
    letterChoiceStudent: [''],  // Initialize with one empty string
    letterChoiceNonStudent: [''],  // Initialize with one empty string
    solutionPoints: ['', '', ''],
    date: setDateToUTCMidnight(new Date()), 
    published: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ConnectionGameFormData, string>>>({});

  // Form Validation
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ConnectionGameFormData, string>> = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.answer.trim()) errors.answer = 'Answer is required';
    if (!formData.hint.trim()) errors.hint = 'Hint is required';
    if (!formData.firstImage.trim()) errors.firstImage = 'First Image URL is required';
    if (!formData.secondImage.trim()) errors.secondImage = 'Second Image URL is required';
    if (!formData.thirdImage.trim()) errors.thirdImage = 'Third Image URL is required';
    if (!formData.thumbnail.trim()) errors.thumbnail = 'Thumbnail URL is required';
    if (!formData.answerExplanation.trim()) errors.answerExplanation = 'Answer explanation is required';
    if (!formData.referenceLink.trim()) errors.referenceLink = 'Reference Link is required';
    if (!formData.solutionPoints.some(point => point.trim())) {
      errors.solutionPoints = 'At least one solution point is required';
    }
    if (!formData.letterChoiceStudent.some(choice => choice.trim())) {
      errors.letterChoiceStudent = 'At least one letter choice for students is required';
    }
    if (!formData.letterChoiceNonStudent.some(choice => choice.trim())) {
      errors.letterChoiceNonStudent = 'At least one letter choice for non-students is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const resetForm = () => {
    setFormData({
      title: '',
      answer: '',
      hint: '',
      firstImage: '',
      secondImage: '',
      thirdImage: '',
      thumbnail: '',
      answerExplanation: '',
      referenceLink: '',
      solutionPoints: ['', '', ''],
      letterChoiceStudent: [''], 
      letterChoiceNonStudent: [''],
      date: setDateToUTCMidnight(new Date()),
      published: false
    });
    setIsEditing(false);
    setFormErrors({});
  };

  const addLetterChoice = (type: 'student' | 'nonStudent') => {
    const field = type === 'student' ? 'letterChoiceStudent' : 'letterChoiceNonStudent';
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeLetterChoice = (index: number, type: 'student' | 'nonStudent') => {
    const field = type === 'student' ? 'letterChoiceStudent' : 'letterChoiceNonStudent';
    if (formData[field].length > 1) {  // Prevent removing the last input
      const newChoices = [...formData[field]];
      newChoices.splice(index, 1);
      setFormData({
        ...formData,
        [field]: newChoices
      });
    }
  };
  const handleLetterChoiceChange = (index: number, value: string, type: 'student' | 'nonStudent') => {
    const field = type === 'student' ? 'letterChoiceStudent' : 'letterChoiceNonStudent';
    const newChoices = [...formData[field]];

    newChoices[index] = value.toUpperCase();
    setFormData({ ...formData, [field]: newChoices });
  }
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const utcDate = setDateToUTCMidnight(selectedDate);
    setFormData({ ...formData, date: utcDate });
  };


  const handleEdit = (game: ConnectionGame) => {
    setFormData({
      id: game.id,
      title: game.title,
      answer: game.answer,
      hint: game.hint,
      firstImage: game.firstImage,
      secondImage: game.secondImage,
      thirdImage : game.thirdImage,
      thumbnail: game.thumbnail,
      answerExplanation: game.answerExplanation,
      referenceLink: game.referenceLink,
      solutionPoints: game.solutionPoints,
      letterChoiceStudent: game.letterChoiceStudent.map(choice => choice.toUpperCase()),
      letterChoiceNonStudent: game.letterChoiceNonStudent.map(choice => choice.toUpperCase()),
      date: setDateToUTCMidnight(new Date(game.date)),
      published: game.published
    });
    setIsEditing(true);
    setFormErrors({});
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    onOpen();
  };

  const handlePublishToggle = async (gameId: string, currentStatus: boolean) => {
    try {
      setIsLoading(true);
      const result = await updateConnectionGame(gameId, { published: !currentStatus });
      if (result.success) {
        setGames(games.map(game => game.id === gameId ? result.data! : game));
        toast.success(`Game ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      } else {
        toast.error(result.error || 'Failed to update game status');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsLoading(true);
      const result = await deleteConnectionGame(deleteId);
      if (result.success) {
        setGames(games.filter(game => game.id !== deleteId));
        toast.success('Game deleted successfully');
        onClose();
      } else {
        toast.error(result.error || 'Failed to delete game');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      const cleanedFormData = {
        ...formData,
        solutionPoints: formData.solutionPoints
          .filter(point => point.trim())
          .map(point => point.trim())
      };
      
      if (isEditing && formData.id) {
        const { id, ...updateData }:any = cleanedFormData;
        const result = await updateConnectionGame(id, updateData);
        if (result.success) {
          setGames(games.map(game => game.id === result.data?.id ? result.data : game));
          toast.success('Game updated successfully');
          resetForm();
        } else {
          toast.error(result.error || 'Failed to update game');
        }
      } else {
        const { id, ...createData } = cleanedFormData;
        const result = await createConnectionGame(createData);
        if (result.success) {
          setGames([result.data!, ...games]);
          toast.success('Game created successfully');
          resetForm();
        } else {
          toast.error(result.error || 'Failed to create game');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolutionPointChange = (index: number, value: string) => {
    const newSolutionPoints = [...formData.solutionPoints];
    newSolutionPoints[index] = value;
    setFormData({ ...formData, solutionPoints: newSolutionPoints });
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ 
      ...formData, 
      answer: e.target.value.toUpperCase() 
    });
  };
 

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Toaster position='top-center'/>
      <Card className="p-4">
        <CardHeader className="flex flex-col gap-3 items-center">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Edit Connection Game' : 'Create Connection Game'}
          </h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title"
              placeholder="Enter game title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              variant="bordered"
              isInvalid={!!formErrors.title}
              errorMessage={formErrors.title}
            />

            <Input
              label="Answer"
              placeholder="Enter correct answer"
              value={formData.answer}
              onChange={handleAnswerChange}
              variant="bordered"
              isInvalid={!!formErrors.answer}
              errorMessage={formErrors.answer}
            />

            <Textarea
              label="Hint"
              placeholder="Enter hint for players"
              value={formData.hint}
              onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
              variant="bordered"
              minRows={2}
              isInvalid={!!formErrors.hint}
              errorMessage={formErrors.hint}
            />

            <Input
              label="First Image URL"
              placeholder="Enter first image URL"
              value={formData.firstImage}
              onChange={(e) => setFormData({ ...formData, firstImage: e.target.value })}
              variant="bordered"
              isInvalid={!!formErrors.firstImage}
              errorMessage={formErrors.firstImage}
            />

              <Input
              label="Second Image URL"
              placeholder="Enter second image URL"
              value={formData.secondImage}
              onChange={(e) => setFormData({ ...formData, secondImage: e.target.value })}
              variant="bordered"
              isInvalid={!!formErrors.secondImage}
              errorMessage={formErrors.secondImage}
            />
            
            <Input
              label="Third Image URL"
              placeholder="Enter third image URL"
              value={formData.thirdImage}
              onChange={(e) => setFormData({ ...formData, thirdImage: e.target.value })}
              variant="bordered"
              isInvalid={!!formErrors.thirdImage}
              errorMessage={formErrors.thirdImage}
            />
            <Input
              label="Thumbnail URL"
              placeholder="Enter thumbnail URL"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              variant="bordered"
              isInvalid={!!formErrors.thumbnail}
              errorMessage={formErrors.thumbnail}
            />
             <Input
              label="Reference link"
              placeholder="Enter reference link"
              value={formData.referenceLink}
              onChange={(e) => setFormData({ ...formData, referenceLink: e.target.value })}
              variant="bordered"
              isInvalid={!!formErrors.referenceLink}
              errorMessage={formErrors.referenceLink}
            />
              <Input
              type="date"
              label="Schedule Date"
              value={formatDateForInput(formData.date)}
              onChange={handleDateChange}
              variant="bordered"
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Solution Points</h3>
              {formData.solutionPoints.map((point, index) => (
                <Textarea
                  key={index}
                  label={`Solution Point ${index + 1}`}
                  placeholder={`Enter solution point ${index + 1}`}
                  value={point}
                  onChange={(e) => handleSolutionPointChange(index, e.target.value)}
                  variant="bordered"
                  minRows={2}
                  isInvalid={!!formErrors.solutionPoints}
                  errorMessage={index === 0 ? formErrors.solutionPoints : undefined}
                />
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Letter Choices for Students</h3>
                <Button
                  isIconOnly
                  size="sm"
                  color="primary"
                  variant="flat"
                  onClick={() => addLetterChoice('student')}
                >
                  <Add />
                </Button>
              </div>
              {formData.letterChoiceStudent.map((choice, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    className="flex-1"
                    label={`Letter Choice ${index + 1}`}
                    placeholder={`Enter letter choice ${index + 1} for students`}
                    value={choice}
                    classNames={{
                      input: "uppercase" // Add CSS class for uppercase display
                    }}
                    onChange={(e) => handleLetterChoiceChange(index, e.target.value, 'student')}
                    variant="bordered"
                    isInvalid={!!formErrors.letterChoiceStudent && !choice.trim()}
                    errorMessage={index === 0 && formErrors.letterChoiceStudent}
                  />
                  {formData.letterChoiceStudent.length > 1 && (
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="flat"
                      onClick={() => removeLetterChoice(index, 'student')}
                    >
                      <Minus />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Letter Choices for Non-Students</h3>
                <Button
                  isIconOnly
                  size="sm"
                  color="primary"
                  variant="flat"
                  onClick={() => addLetterChoice('nonStudent')}
                >
                  <Add />
                </Button>
              </div>
              {formData.letterChoiceNonStudent.map((choice, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    className="flex-1"
                    label={`Letter Choice ${index + 1}`}
                    placeholder={`Enter letter choice ${index + 1} for non-students`}
                    value={choice}
                    onChange={(e) => handleLetterChoiceChange(index, e.target.value, 'nonStudent')}
                    variant="bordered"
                    classNames={{
                      input: "uppercase" // Add CSS class for uppercase display
                    }}
                    isInvalid={!!formErrors.letterChoiceNonStudent && !choice.trim()}
                    errorMessage={index === 0 && formErrors.letterChoiceNonStudent}
                  />
                  {formData.letterChoiceNonStudent.length > 1 && (
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="flat"
                      onClick={() => removeLetterChoice(index, 'nonStudent')}
                    >
                      <Minus />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Textarea
              label="Answer Explanation"
              placeholder="Enter detailed explanation about the answer"
              value={formData.answerExplanation}
              onChange={(e) => setFormData({ ...formData, answerExplanation: e.target.value })}
              variant="bordered"
              minRows={4}
              isInvalid={!!formErrors.answerExplanation}
              errorMessage={formErrors.answerExplanation}
            />

            <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
              <span className="text-sm font-semibold">Game Status</span>
              <Switch
                isSelected={formData.published}
                onValueChange={(value) => setFormData({ ...formData, published: value })}
                color="success"
                size="lg"
              >
                <span className={formData.published ? "text-success" : "text-gray-500"}>
                  {formData.published ? 'Published' : 'Draft'}
                </span>
              </Switch>
            </div>

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

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Connection Games</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Connection games table">
            <TableHeader>
              <TableColumn>TITLE</TableColumn>
              <TableColumn>ANSWER</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="max-w-xs truncate">{game.title}</TableCell>
                  <TableCell>{game.answer}</TableCell>
                  <TableCell><FormattedDate date={game.date.toISOString().split('T')[0]}/></TableCell>
                  <TableCell>
                    <Switch
                      isSelected={game.published}
                      onValueChange={() => handlePublishToggle(game.id, game.published)}
                      color="success"
                      size="sm"
                      isDisabled={isLoading}
                    >
                      <Chip
                        color={game.published ? "success" : "default"}
                        variant="flat"
                        size="sm"
                      >
                        {game.published ? 'Published' : 'Draft'}
                      </Chip>
                    </Switch>
                  </TableCell>
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

export default ConnectionGameAdmin;