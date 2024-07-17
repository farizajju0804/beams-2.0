'use client'
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@nextui-org/react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  genres: any[];
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
  handleReset: () => void;
  applyFilters: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  genres,
  selectedGenres,
  setSelectedGenres,
  handleReset,
  applyFilters,
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>("genre");

  const handleGenreClick = (genreId: string) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreId)
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId]
    );
  };

  const handleApplyFilters = () => {
    applyFilters();
    onClose(); // Close the modal when filters are applied
  };

  const renderFilterOptions = () => {
    if (activeFilter === "genre") {
      return (
        <div className="flex flex-col gap-2">
          {genres.map((genre: any) => (
            <Chip
              key={genre.id}
              className={`cursor-pointer ${selectedGenres.includes(genre.id) ? 'bg-yellow-900 text-black' : 'bg-gray-200 text-black'}`}
              onClick={() => handleGenreClick(genre.id)}
            >
              {genre.name}
            </Chip>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Modal
      backdrop="blur"
      size="full"
      isOpen={isOpen}
      onClose={onClose}
      placement="auto"
      className="max-w-lg rounded-3xl"
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <span>Filter</span>
        </ModalHeader>
        <ModalBody className="flex flex-row">
          <div className="w-1/3 pr-2 border-r">
            <div className="flex flex-col gap-4">
              <Button
                size="sm"
                className={` ${activeFilter === "genre" ? 'bg-yellow-900' : 'bg-transparent'}`}
                onPress={() => setActiveFilter("genre")}
              >
                Genre
              </Button>
            </div>
          </div>
          <div className="w-2/3 pl-4 flex">
            {renderFilterOptions()}
          </div>
        </ModalBody>
        <ModalFooter className="flex items-center justify-between">
          <Button className="bg-transparent text-gray-500" onPress={handleReset}>Clear All</Button>
          <Button className="text-white bg-black" onPress={handleApplyFilters}>
            Show Items
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FilterDrawer;
