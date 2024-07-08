"use client";
import React, { useEffect, useState } from "react";
import { createBeamsToday, updateBeamsToday, deleteBeamsToday, getBeamsTodayEntries } from "@/actions/beams-today/admin/beamsTodayActions";
import { BeamsToday, BeamsTodayCreateInput, BeamsTodayUpdateInput } from "@/types/beamsToday";
import { Spinner, Button, Input, Textarea } from "@nextui-org/react";

const AdminBeamsToday: React.FC = () => {
  const [entries, setEntries] = useState<BeamsToday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<BeamsTodayCreateInput | BeamsTodayUpdateInput>({
    date: "",
    title: "",
    shortDesc: "",
    videoUrl: "",
    thumbnailUrl: "",
    articleUrl: "",
    audioUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entriesData = await getBeamsTodayEntries();
        setEntries(entriesData);
      } catch (error) {
        console.error("Error fetching beamsToday entries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
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
        categoryId: "",
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
              <Input 
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                placeholder="Category ID"
                fullWidth
              />
              <Button onClick={handleSubmit}>{isEditing ? "Update" : "Submit"}</Button>
            </div>
          </div>
          <div className="w-full max-w-5xl">
            <h2 className="text-xl font-bold mb-4">Entries</h2>
            {entries.map((entry) => (
              <div key={entry.id} className="flex flex-row justify-between items-center border-b border-gray-200 py-4">
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold">{entry.title}</h3>
                  <p className="text-sm">{entry.shortDesc}</p>
                  <p className="text-xs">Date: {new Date(entry.date).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" color="warning" onClick={() => handleEdit(entry)}>Edit</Button>
                  <Button size="sm" color="danger" onClick={() => handleDelete(entry.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBeamsToday;
