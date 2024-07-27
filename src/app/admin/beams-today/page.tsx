"use client";
import React, { useEffect, useState } from "react";
import { createBeamsToday, updateBeamsToday, deleteBeamsToday, getBeamsTodayEntries } from "@/actions/beams-today/admin/beamsTodayActions";
import { getCategories, createCategory } from "@/actions/beams-today/admin/beamsTodayCategoryActions";
import { BeamsToday, BeamsTodayCreateInput, BeamsTodayUpdateInput, BeamsTodayCategory } from "@/types/beamsToday";
import { Spinner, Button, Input, Textarea, Modal, ModalContent, ModalHeader, ModalFooter, ModalBody } from "@nextui-org/react";

const AdminBeamsToday: React.FC = () => {
  const [entries, setEntries] = useState<BeamsToday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<BeamsTodayCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [form, setForm] = useState<BeamsTodayCreateInput | BeamsTodayUpdateInput>({
    date: "",
    title: "",
    shortDesc: "",
    videoUrl: "",
    thumbnailUrl: "",
    articleUrl: "",
    audioUrl: "",
    categoryId: "",  // Initialize with an empty string
    poll: {
      title: "",
      description: "",
      question: "",
      options: [""],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entriesData, categoriesData] = await Promise.all([getBeamsTodayEntries(), getCategories()]);
        console.log('Fetched entries:', entriesData); // Add log
        console.log('Fetched categories:', categoriesData); // Add log
        setEntries(entriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("poll")) {
      setForm((prevForm) => {
        const updatedPoll: any = { ...prevForm.poll };
        if (name === "pollOption" && index !== undefined) {
          updatedPoll.options[index] = value;
        } else {
          updatedPoll[name.replace("poll", "").toLowerCase()] = value;
        }
        return {
          ...prevForm,
          poll: updatedPoll,
        }
    });      
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value === "add") {
      setIsCategoryModalOpen(true);
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        categoryId: value,
      }));
    }
  };

  const handleAddCategory = async () => {
    try {
      const newCategory = await createCategory(newCategoryName);
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategoryName("");
      setIsCategoryModalOpen(false);
      setForm((prevForm) => ({
        ...prevForm,
        categoryId: newCategory.id,
      }));
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        const updatedEntry = await updateBeamsToday((form as BeamsTodayUpdateInput).id!, form as BeamsTodayUpdateInput);
        setEntries((prevEntries) => {
          const existingIndex = prevEntries.findIndex(entry => entry.id === updatedEntry.id);
          if (existingIndex >= 0) {
            const updatedEntries = [...prevEntries];
            updatedEntries[existingIndex] = updatedEntry;
            return updatedEntries;
          }
          return [updatedEntry, ...prevEntries];
        });
      } else {
        const newEntry = await createBeamsToday(form as BeamsTodayCreateInput);
        setEntries([newEntry, ...entries]);
      }

      setForm({
        date: "",
        title: "",
        shortDesc: "",
        videoUrl: "",
        thumbnailUrl: "",
        articleUrl: "",
        audioUrl: "",
        categoryId: "",  // Initialize with an empty string
        poll: {
          title: "",
          description: "",
          question: "",
          options: [""],
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error creating/updating beamsToday entry:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBeamsToday(id);
      setEntries((prevEntries) => prevEntries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error("Error deleting beamsToday entry:", error);
    }
  };

  const handleEdit = (entry: BeamsToday) => {
    setForm({
      ...entry,
      date: new Date(entry.date).toISOString(), // Convert date to ISO-8601 string
      poll: {
        title: entry.poll?.title || "",
        description: entry.poll?.description || "",
        question: entry.poll?.question || "",
        options: entry.poll?.options.map(option => option.optionText) || [""],
      },
      categoryId: entry.category.id, // Set the category ID from the entry's category
    });
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col items-center w-full p-8 gap-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Admin: Manage Beams Today</h1>
          <div className="w-full max-w-5xl mb-8">
            <div className="flex flex-col gap-4">
              <Input 
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title"
                fullWidth
              />
              <Textarea 
                name="shortDesc"
                value={form.shortDesc}
                onChange={handleChange}
                placeholder="Short Description"
                fullWidth
              />
              <Input 
                name="date"
                value={form.date} // Format date for input
                onChange={handleChange}
                placeholder="Date"
                fullWidth
              />
              <Input 
                name="videoUrl"
                value={form.videoUrl || ""}
                onChange={handleChange}
                placeholder="Video URL"
                fullWidth
              />
              <Input 
                name="thumbnailUrl"
                value={form.thumbnailUrl || ""}
                onChange={handleChange}
                placeholder="Thumbnail URL"
                fullWidth
              />
              <Input 
                name="articleUrl"
                value={form.articleUrl || ""}
                onChange={handleChange}
                placeholder="Article URL"
                fullWidth
              />
              <Input 
                name="audioUrl"
                value={form.audioUrl || ""}
                onChange={handleChange}
                placeholder="Audio URL"
                fullWidth
              />
              {/* Category Dropdown */}
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-sm font-medium text-gray-700">Select Category</label>
                <select
                  id="category"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleCategoryChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                  <option value="add">Add New Category</option>
                </select>
              </div>
              {/* Poll Title */}
              <Input
                name="pollTitle"
                value={form.poll.title}
                onChange={handleChange}
                placeholder="Poll Title"
                fullWidth
              />
              {/* Poll Description */}
              <Textarea
                name="pollDescription"
                value={form.poll.description}
                onChange={handleChange}
                placeholder="Poll Description"
                fullWidth
              />
              {/* Poll Question */}
              <Input
                name="pollQuestion"
                value={form.poll.question}
                onChange={handleChange}
                placeholder="Poll Question"
                fullWidth
              />
              {/* Poll Options */}
              {form.poll.options.map((option, index) => (
                <Input
                  key={index}
                  name={`pollOption${index}`}
                  value={option}
                  onChange={(e) => handleChange(e, index)}
                  placeholder={`Option ${index + 1}`}
                  fullWidth
                />
              ))}
              <Button
                onClick={() =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    poll: {
                      ...prevForm.poll,
                      options: [...prevForm.poll.options, ""],
                    },
                  }))
                }
              >
                Add Option
              </Button>
              <Button onClick={handleSubmit}>{isEditing ? "Update" : "Submit"}</Button>
            </div>
          </div>
          <div className="w-full max-w-5xl">
            <h2 className="text-xl font-bold mb-4">Entries</h2>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <div key={entry.id} className="flex flex-row justify-between items-center border-b border-gray-200 py-4">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold">{entry.title}</h3>
                    <p className="text-sm">{entry.shortDesc}</p>
                    <p className="text-xs">Date: {new Date(entry.date).toLocaleString()}</p>
                    <p className="text-xs">Category: {entry.category.name}</p> {/* Display category name */}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" color="warning" onClick={() => handleEdit(entry)}>Edit</Button>
                    <Button size="sm" color="danger" onClick={() => handleDelete(entry.id)}>Delete</Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No entries found.</p>
            )}
          </div>
        </>
      )}
      {/* Modal to add new category */}
      <Modal isOpen={isCategoryModalOpen} size="3xl" onClose={() => setIsCategoryModalOpen(false)}>
      
        <ModalContent>
        <ModalHeader>
          <h2>Add New Category</h2>
        </ModalHeader>
        <ModalBody>
          <Input
            name="newCategoryName"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category Name"
            fullWidth
          />
        </ModalBody>
            <ModalFooter>
          <Button onClick={() => setIsCategoryModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCategory}>
            Add
          </Button>
        </ModalFooter>
        </ModalContent>
      
      </Modal>
    </div>
  );
};

export default AdminBeamsToday;
