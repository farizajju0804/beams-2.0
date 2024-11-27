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
  Select,
  SelectItem,
  Chip,
  Switch,
  Textarea
} from "@nextui-org/react";
import { FactOfTheday, FactCategory } from '@prisma/client';
import { getFacts, createFact, updateFact, deleteFact, getCategories, createCategory } from './_actions/facts';
import { toast, Toaster } from 'react-hot-toast';
import { Calendar } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";


interface FactFormProps {
  fact?: FactOfTheday & { category: FactCategory };
  onSubmit: (data: Omit<FactOfTheday, 'id'>) => void;
  onCancel: () => void;
}


function CategoryForm({ onSubmit, onClose }: any) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    color: ''
  });

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    setErrors(prev => ({ ...prev, color: '' }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setErrors(prev => ({ ...prev, name: '' }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      name: '',
      color: ''
    };

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Category name is required';
      isValid = false;
    } else if (name.length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
      isValid = false;
    }

    // Validate color
    if (!color.trim()) {
      newErrors.color = 'Color code is required';
      isValid = false;
    } else if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
      newErrors.color = 'Invalid color format (use #RRGGBB)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({ 
        name: name.trim(), 
        color: color.trim().toLowerCase() 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Category Name"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter category name"
          isRequired
          isInvalid={!!errors.name}
          errorMessage={errors.name}
          classNames={{
            errorMessage: "text-red-500 text-xs mt-1"
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Input
          label="Color Code"
          value={color}
          onChange={handleColorChange}
          placeholder="#000000"
          description="Enter color in hex format (e.g., #FF0000 for red)"
          isRequired
          isInvalid={!!errors.color}
          errorMessage={errors.color}
          classNames={{
            errorMessage: "text-red-500 text-xs mt-1"
          }}
        />
        {color && (
          <div className="flex items-center gap-2">
            <div 
              className="h-6 w-6 rounded border"
              style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(color) ? color : 'transparent' }}
            />
            <span className="text-sm">Color Preview</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Button 
          color="primary" 
          className="text-white font-medium" 
          type="submit"
        >
          Create Category
        </Button>
        <Button 
          onClick={onClose}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
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
  const [thumbnail, setThumbnail] = useState(fact?.thumbnail || '');
  const [referenceLink1, setReferenceLink1] = useState(fact?.referenceLink1 || '');
  const [referenceLink2, setReferenceLink2] = useState(fact?.referenceLink2 || '');
  const [hashtags, setHashtags] = useState<string[]>(fact?.hashtags || []);
  const [categoryId, setCategoryId] = useState(fact?.categoryId || '');
  const [categories, setCategories] = useState<FactCategory[]>([]);
  const [newHashtag, setNewHashtag] = useState('');
  const [published, setPublished] = useState(fact?.published ?? false);
  const [factContent, setFactContent] = useState(fact?.factContent || '');
  const { isOpen: isCategoryModalOpen, onOpen: onCategoryModalOpen, onClose: onCategoryModalClose } = useDisclosure();

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    };
    loadCategories();
  }, []);

  const handleDateChange = (value: CalendarDate) => {
    setDate(value);
  };

  const handleAddHashtag = () => {
    if (newHashtag && !hashtags.includes(newHashtag)) {
      setHashtags([...hashtags, newHashtag]);
      setNewHashtag('');
    }
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  const handleCreateCategory = async (categoryData: { name: string; color: string }) => {
    try {
      const newCategory = await createCategory(categoryData);
      setCategories([...categories, newCategory]);
      setCategoryId(newCategory.id);
      onCategoryModalClose();
      toast.success('Category created successfully');
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!date || !title || !finalImage || !thumbnail || !categoryId || !factContent) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formattedDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
    const data: any = {
      date: formattedDate,
      title,
      finalImage,
      thumbnail,
      referenceLink1: referenceLink1 || null,
      referenceLink2: referenceLink2 || null,
      hashtags,
      categoryId,
      published,
      factContent 
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
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          isRequired
        />
        <Input
          label="Final Image URL"
          value={finalImage}
          onChange={(e) => setFinalImage(e.target.value)}
          isRequired
        />
        <Input
          label="Thumbnail URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          isRequired
        />
        <Input
          label="Reference Link 1"
          value={referenceLink1}
          onChange={(e) => setReferenceLink1(e.target.value)}
        />
        <Input
          label="Reference Link 2"
          value={referenceLink2}
          onChange={(e) => setReferenceLink2(e.target.value)}
        />
         <div className="w-full">
          <Textarea
            label="Fact Content"
            placeholder="Enter the fact content here..."
            value={factContent}
            onChange={(e) => setFactContent(e.target.value)}
            minRows={4}
            isRequired
            classNames={{
              base: "w-full",
              input: "resize-y min-h-[100px]"
            }}
          />
        </div>
        
        <div>
          <div className="flex gap-2 mb-2">
            <Input
              label="Add Hashtag"
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value)}
              placeholder="Enter hashtag"
            />
            <Button onClick={handleAddHashtag}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <Chip key={tag} onClose={() => handleRemoveHashtag(tag)}>
                {tag}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <Select
            label="Category"
            selectedKeys={categoryId ? [categoryId] : []}
            onChange={(e) => setCategoryId(e.target.value)}
            isRequired
          >
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </Select>
          <Button onClick={onCategoryModalOpen}>
            New Category
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            isSelected={published}
            onValueChange={setPublished}
            size="lg"
            color="success"
          />
          <span className="text-sm">
            {published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
       
    
      <div className='mt-4 flex gap-4'>
        <Button color="primary" className='text-white' type="submit">Submit</Button>
        <Button color="default" onClick={onCancel}>Cancel</Button>
      </div>

      <Modal isOpen={isCategoryModalOpen} onClose={onCategoryModalClose}>
        <ModalContent>
          <ModalHeader>Create New Category</ModalHeader>
          <ModalBody>
            <CategoryForm onSubmit={handleCreateCategory} onClose={onCategoryModalClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </form>
  );
}


export default function AdminPage() {
  const [facts, setFacts] = useState<(FactOfTheday & { category: FactCategory })[]>([]);
  const [selectedFact, setSelectedFact] = useState<(FactOfTheday & { category: FactCategory }) | null>(null);
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
          <TableColumn>Category</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Hashtags</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {facts.map((fact) => (
            <TableRow key={fact.id}>
              <TableCell>{new Date(fact.date).toLocaleDateString()}</TableCell>
              <TableCell>{fact.title}</TableCell>
              <TableCell>
                <Chip
                  className="text-xs"
                  style={{ 
                    backgroundColor: fact.category.color,
                    color: '#fff'
                  }}
                >
                  {fact.category.name}
                </Chip>
              </TableCell>
              <TableCell>
              <Chip
                className="text-xs text-white"
                color={fact.published ? "success" : "warning"}
               
              >
                {fact.published ? "Published" : "Draft"}
              </Chip>
            </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {fact.hashtags.map((tag, index) => (
                    <Chip key={index} size="sm" variant="flat">
                      {tag}
                    </Chip>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    color="warning" 
                    size="sm" 
                    onClick={() => { 
                      setSelectedFact(fact); 
                      onOpen(); 
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    color="danger" 
                    size="sm" 
                    onClick={() => handleDelete(fact.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="3xl" // Made modal larger to accommodate the form
        scrollBehavior="inside" // Allows scrolling within the modal
      >
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
            <Button color="default" onClick={() => setFactToDelete(null)}>
              Cancel
            </Button>
            <Button color="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
    </>
  );
}