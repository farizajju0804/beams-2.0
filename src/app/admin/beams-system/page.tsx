    // File: /app/admin/levels-achievements/page.tsx
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
    Checkbox,
    } from "@nextui-org/react";
    import { Level, Achievement } from '@prisma/client';
    import { createAchievement, createLevel, deleteAchievement, deleteLevel, getAchievements, getLevels, updateAchievement, updateLevel } from './_actions/beams-system';
import toast, { Toaster } from 'react-hot-toast';

    // Server actions


    // Client components
    interface LevelFormProps {
    level?: Level;
    onSubmit: (data: Omit<Level, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
    }

    function LevelForm({ level, onSubmit, onCancel }: LevelFormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData:any = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as Omit<Level, 'id' | 'createdAt' | 'updatedAt'>;
        data.levelNumber = parseInt(data.levelNumber as any);
        data.minPoints = parseInt(data.minPoints as any);
        data.maxPoints = parseInt(data.maxPoints as any);
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit}>
        <div className='space-y-4'>
        <Input name="levelNumber" label="Level Number" defaultValue={level?.levelNumber.toString()} />
        <Input name="minPoints" label="Min Points" defaultValue={level?.minPoints.toString()} />
        <Input name="maxPoints" label="Max Points" defaultValue={level?.maxPoints.toString()} />
        <Input name="name" label="Name" defaultValue={level?.name} />
        <Input name="caption" label="Caption" defaultValue={level?.caption} />
        <Input name="icon" label="Icon" defaultValue={level?.icon} />
        <Input name="bgColor" label="Background Color" defaultValue={level?.bgColor} />
        </div>
        <div className='my-4 flex gap-4'>
        <Button className='bg-brand text-white' type="submit">Submit</Button>
        <Button color='primary' variant='light' onClick={onCancel}>Cancel</Button>
        </div>
        </form>
    );
    }

    interface AchievementFormProps {
    achievement?: Achievement;
    onSubmit: (data: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
    }

    function AchievementForm({ achievement, onSubmit, onCancel }: AchievementFormProps) {
      const [isPublished, setIsPublished] = useState(achievement?.published || false);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData:any = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>;
        data.totalCount = parseInt(data.totalCount as any);
        data.beamsToGain = parseInt(data.beamsToGain as any);
        data.published = isPublished; 
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit}>
        <div className='space-y-4'>
        <Input name="name" label="Name" defaultValue={achievement?.name} />
        <Input name="badgeImageUrl" label="Badge Image URL" defaultValue={achievement?.badgeImageUrl} />
        <Input name="task" label="Task" defaultValue={achievement?.task} />
        <Input name="color" label="Color" defaultValue={achievement?.color} />
        <Input name="actionText" label="Action Text" defaultValue={achievement?.actionText} />
        <Input name="totalCount" label="Total Count" defaultValue={achievement?.totalCount.toString()} />
        <Input name="beamsToGain" label="Beams to Gain" defaultValue={achievement?.beamsToGain.toString()} />
        <Input name="personalizedMessage" label="Personalized Message" defaultValue={achievement?.personalizedMessage} />
        <Input name="actionUrl" label="Action URL" defaultValue={achievement?.actionUrl || ''} />
        <Checkbox
        defaultSelected={isPublished}
          isSelected={isPublished}
          onValueChange={setIsPublished}
          color="primary"
        >
          Published
        </Checkbox>
        </div>
        <div className='my-4 flex gap-4'>
        <Button className='bg-brand text-white' type="submit">Submit</Button>
        <Button color='primary' variant='light' onClick={onCancel}>Cancel</Button>
        </div>
        </form>
    );
    }

    export default function AdminPage() {
    const [levels, setLevels] = useState<Level[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [selectedItem, setSelectedItem] = useState<Level | Achievement | null>(null);
    const [isLevel, setIsLevel] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
   
    const fetchData = async () => {
        const fetchedLevels = await getLevels();
        const fetchedAchievements = await getAchievements();
        setLevels(fetchedLevels);
        setAchievements(fetchedAchievements);
    };

    useEffect(() => {
        fetchData();
    }, []);

      
    const handleCreate = async (data: Omit<Level | Achievement, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        console.log('Creating new item:', data);
        if (isLevel) {
          await createLevel(data as Omit<Level, 'id' | 'createdAt' | 'updatedAt'>);
          toast.success('Level created successfully');
        } else {
          await createAchievement(data as Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>);
          toast.success('Achievement created successfully');
        }
        onClose();
        fetchData();
      } catch (error) {
        console.error('Error creating item:', error);
        toast.error('Failed to create item');
      }
    };
      
        const handleUpdate = async (data: Partial<Omit<Level | Achievement, 'id' | 'createdAt' | 'updatedAt'>>) => {
          if (!selectedItem) return;
          try {
            console.log('Updating item:', { id: selectedItem.id, data });
            if (isLevel) {
              await updateLevel(selectedItem.id, data as Partial<Omit<Level, 'id' | 'createdAt' | 'updatedAt'>>);
              toast.success('Level updated successfully');
            } else {
              await updateAchievement(selectedItem.id, data as Partial<Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>>);
              toast.success('Achievement updated successfully');
            }
            onClose();
            fetchData();
          } catch (error) {
            console.error('Error updating item:', error);
            toast.error('Failed to update item');
          }
        };
      
        const handleDelete = async (id: string) => {
          setItemToDelete(id);
        };
      
        const confirmDelete = async () => {
          if (!itemToDelete) return;
          try {
            console.log('Deleting item:', itemToDelete);
            if (isLevel) {
              await deleteLevel(itemToDelete);
              toast.success('Level deleted successfully');
            } else {
              await deleteAchievement(itemToDelete);
              toast.success('Achievement deleted successfully');
            }
            setItemToDelete(null);
            fetchData();
          } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Failed to delete item');
          }
        };
      
        return (
          <div className="container mx-auto p-4">
            <Toaster position="top-right" />
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            
            <div className="flex items-center gap-4 flex-col md:flex-row mb-6">
              <Button color="success" className='text-white' onClick={() => { setIsLevel(true); setSelectedItem(null); onOpen(); }}>
                Create New Level
              </Button>
              <Button color="success" className='text-white' onClick={() => { setIsLevel(false); setSelectedItem(null); onOpen(); }}>
                Create New Achievement
              </Button>
            </div>
      
            <h2 className="text-xl font-semibold mb-4">Levels</h2>
            <Table>
              <TableHeader>
                <TableColumn>Level Number</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {levels.map((level) => (
                  <TableRow key={level.id} className='border-1'>
                    <TableCell>{level.levelNumber}</TableCell>
                    <TableCell>{level.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col md:flex-row md:justify-start items-center justify-center gap-4">
                        <Button color="warning" size="sm" onClick={() => { setIsLevel(true); setSelectedItem(level); onOpen(); }}>Edit</Button>
                        <Button color="danger" size="sm" onClick={() => handleDelete(level.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
      
            <h2 className="text-xl font-semibold mb-4 mt-12">Achievements</h2>
            <Table>
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Task</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {achievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell>{achievement.name}</TableCell>
                    <TableCell>{achievement.task}</TableCell>
                    <TableCell>
                    <div className="flex flex-col md:flex-row md:justify-start items-center justify-center gap-4">
                        <Button color="warning" size="sm" onClick={() => { setIsLevel(false); setSelectedItem(achievement); onOpen(); }}>Edit</Button>
                        <Button color="danger" size="sm" onClick={() => handleDelete(achievement.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
      
            <Modal scrollBehavior='inside' isOpen={isOpen} onClose={onClose}>
              <ModalContent>
                <ModalHeader>{selectedItem ? 'Edit' : 'Create'} {isLevel ? 'Level' : 'Achievement'}</ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    {isLevel ? (
                      <LevelForm 
                        level={selectedItem as Level} 
                        onSubmit={selectedItem ? handleUpdate : handleCreate}
                        onCancel={onClose}
                      />
                    ) : (
                      <AchievementForm 
                        achievement={selectedItem as Achievement} 
                        onSubmit={selectedItem ? handleUpdate : handleCreate}
                        onCancel={onClose}
                      />
                    )}
                  </div>
                </ModalBody>
              </ModalContent>
            </Modal>
      
            <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)}>
              <ModalContent>
                <ModalHeader>Confirm Deletion</ModalHeader>
                <ModalBody>
                  Are you sure you want to delete this item? This action cannot be undone.
                </ModalBody>
                <ModalFooter>
                  <Button color="default" onClick={() => setItemToDelete(null)}>Cancel</Button>
                  <Button color="danger" onClick={confirmDelete}>Delete</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        );
      }