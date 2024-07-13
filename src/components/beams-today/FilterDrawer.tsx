'use client'
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@nextui-org/react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  beamedStatus: string;
  setBeamedStatus: (status: string) => void;
  handleReset: () => void;
  applyFilters: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategories,
  setSelectedCategories,
  beamedStatus,
  setBeamedStatus,
  handleReset,
  applyFilters,
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>("beamedStatus");

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const renderFilterOptions = () => {
    if (activeFilter === "category") {
      return (
        <div className="flex flex-col gap-2">
          {categories.map((category: any) => (
            <Chip
              key={category.id}
              className={`cursor-pointer ${selectedCategories.includes(category.id) ? 'bg-yellow-900 text-black' : 'bg-gray-200 text-black'}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Chip>
          ))}
        </div>
      );
    } else if (activeFilter === "beamedStatus") {
      return (
        <div className="flex flex-col gap-2">
          <Chip
            className={`cursor-pointer ${beamedStatus === "all" ? 'bg-yellow-900 text-black' : 'bg-gray-200 text-black'}`}
            onClick={() => setBeamedStatus("all")}
          >
            All
          </Chip>
          <Chip
            className={`cursor-pointer ${beamedStatus === "beamed" ? 'bg-yellow-900 text-black' : 'bg-gray-200 text-black'}`}
            onClick={() => setBeamedStatus("beamed")}
          >
            Beamed
          </Chip>
          <Chip
            className={`cursor-pointer ${beamedStatus === "unbeamed" ? 'bg-yellow-900 text-black' : 'bg-gray-200 text-black'}`}
            onClick={() => setBeamedStatus("unbeamed")}
          >
            Unbeamed
          </Chip>
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
                className={` ${activeFilter === "beamedStatus" ? 'bg-yellow-900' : 'bg-transparent'}`}
                onPress={() => setActiveFilter("beamedStatus")}
              >
                Beamed Status
              </Button>
              <Button
                size="sm"
                className={` ${activeFilter === "category" ? ' bg-yellow-900' : 'bg-transparent'}`}
                onPress={() => setActiveFilter("category")}
              >
                Category
              </Button>
            </div>
          </div>
          <div className="w-2/3 pl-4 flex">
            {renderFilterOptions()}
          </div>
        </ModalBody>
        <ModalFooter className="flex items-center justify-between">
          <Button className="bg-transparent text-gray-500" onPress={handleReset}>Clear All</Button>
          <Button  className="text-white bg-black" onPress={applyFilters}>
            Show Items
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FilterDrawer;
