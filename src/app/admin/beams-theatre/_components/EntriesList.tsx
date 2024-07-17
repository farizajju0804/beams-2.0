import React from "react";
import { Button } from "@nextui-org/react";
import { BeamsTheatre } from "@/types/beamsTheatre";

interface EntriesListProps {
  entries: BeamsTheatre[];
  onEdit: (entry: BeamsTheatre) => void;
  onDelete: (id: string) => void;
}

const EntriesList: React.FC<EntriesListProps> = ({ entries, onEdit, onDelete }) => {
  return (
    <div className="w-full max-w-5xl">
      <h2 className="text-xl font-bold mb-4">Entries</h2>
      {entries.map((entry) => (
        <div key={entry.id} className="flex flex-row justify-between items-center border-b border-gray-200 py-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">{entry.title}</h3>
            <p className="text-sm">{entry.description}</p>
            <p className="text-xs">Date: {new Date(entry.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" color="warning" onClick={() => onEdit(entry)}>
              Edit
            </Button>
            <Button size="sm" color="danger" onClick={() => onDelete(entry.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EntriesList;
