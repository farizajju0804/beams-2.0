'use client'; // Indicates that this component uses client-side rendering

import React, { useState } from "react"; // Importing React and useState hook
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@nextui-org/react"; // Importing UI components from NextUI

// Interface for the category structure
export interface Category {
  id: string;
  name: string;
}

// Props interface for the FilterDrawer component
interface FilterDrawerProps {
  isOpen: boolean; // State to control if the modal is open
  onClose: () => void; // Function to close the modal
  categories: Category[]; // Array of category objects
  selectedCategories: string[]; // Array of selected category IDs
  setSelectedCategories: (categories: string[]) => void; // Function to update selected categories
  beamedStatus: string; // Current beamed status
  setBeamedStatus: (status: string) => void; // Function to update beamed status
  handleReset: () => void; // Function to reset filters
  applyFilters: () => void; // Function to apply selected filters
}

// FilterDrawer functional component
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
  const [activeFilter, setActiveFilter] = useState<string>("beamedStatus"); // State for tracking the active filter

  // Function to handle category chip clicks
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategories(
      selectedCategories.includes(categoryId) // Check if category is already selected
        ? selectedCategories.filter((id) => id !== categoryId) // Remove if already selected
        : [...selectedCategories, categoryId] // Add if not selected
    );
  };

  // Function to render filter options based on the active filter
  const renderFilterOptions = () => {
    if (activeFilter === "category") {
      return (
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <Chip
              key={category.id} // Unique key for each chip
              className={`cursor-pointer ${
                selectedCategories.includes(category.id)
                  ? "bg-yellow text-black" // Highlight if selected
                  : "bg-grey-1 text-grey-2"
              }`}
              onClick={() => handleCategoryClick(category.id)} // Click handler for category chips
            >
              {category.name} {/* Display category name */}
            </Chip>
          ))}
        </div>
      );
    } else if (activeFilter === "beamedStatus") {
      return (
        <div className="flex flex-col gap-2">
          {/* Chips for beamed status options */}
          <Chip
            className={`cursor-pointer ${
              beamedStatus === "all" ? "bg-yellow text-black" : "bg-grey-1 text-grey-2"
            }`}
            onClick={() => setBeamedStatus("all")} // Set status to 'all'
          >
            All
          </Chip>
          <Chip
            className={`cursor-pointer ${
              beamedStatus === "beamed" ? "bg-yellow text-black" : "bg-grey-1 text-grey-2"
            }`}
            onClick={() => setBeamedStatus("beamed")} // Set status to 'beamed'
          >
            Beamed
          </Chip>
          <Chip
            className={`cursor-pointer ${
              beamedStatus === "unbeamed" ? "bg-yellow text-black" : "bg-grey-1 text-grey-2"
            }`}
            onClick={() => setBeamedStatus("unbeamed")} // Set status to 'unbeamed'
          >
            Unbeamed
          </Chip>
        </div>
      );
    }
    return null; // Return null if no active filter
  };

  return (
    <Modal
      backdrop="blur" // Blurs the backdrop when the modal is open
      size="lg" // Sets the size of the modal
      isOpen={isOpen} // Controls modal visibility
      onClose={onClose} // Function to close the modal
      placement="center" // Center the modal on the screen
      className="max-w-lg rounded-3xl" // Custom styles for the modal
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <span>Filter</span> {/* Header title */}
        </ModalHeader>

        <ModalBody className="flex flex-row">
          <div className="w-1/3 pr-2 border-r border-grey-1"> {/* Sidebar for filter categories */}
            <div className="flex flex-col gap-4">
              <Button
                size="sm"
                className={`${
                  activeFilter === "beamedStatus" ? "bg-yellow text-black" : "bg-transparent"
                }`}
                onPress={() => setActiveFilter("beamedStatus")} // Set active filter to 'beamedStatus'
              >
                Beamed Status
              </Button>
              <Button
                size="sm"
                className={`${
                  activeFilter === "category" ? "bg-yellow text-black" : "bg-transparent"
                }`}
                onPress={() => setActiveFilter("category")} // Set active filter to 'category'
              >
                Category
              </Button>
            </div>
          </div>

          <div className="w-2/3 pl-4 flex">
            {renderFilterOptions()} {/* Render the filter options based on active filter */}
          </div>
        </ModalBody>

        <ModalFooter className="flex items-center justify-between">
          <Button className="bg-transparent text-grey-2" onPress={handleReset}>
            Clear All {/* Button to clear all filters */}
          </Button>
          <Button className="text-background bg-text" onPress={applyFilters}>
            Show Items {/* Button to apply selected filters */}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FilterDrawer; // Export the component for use in other parts of the application
