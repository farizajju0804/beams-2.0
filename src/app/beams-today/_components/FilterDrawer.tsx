'use client'; // Ensures this component is rendered on the client side in a Next.js environment.

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@nextui-org/react"; // Import UI components from NextUI.

interface FilterOption {
  id: string; // Unique identifier for each filter option.
  label: string; // Label to be displayed for each filter option.
}

interface FilterType {
  type: string; // The type of filter (e.g., "category", "beamedStatus").
  label: string; // The label displayed for the filter type.
  options: FilterOption[]; // The available filter options.
}

interface FilterDrawerProps {
  isOpen: boolean; // Boolean flag to control the visibility of the modal.
  onClose: () => void; // Function to close the modal.
  categories: any[]; // List of category options.
  selectedCategories: string[]; // Currently selected categories.
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>; // Function to update selected categories.
  beamedStatus: string; // Current "beamed" status (all, beamed, or unbeamed).
  setBeamedStatus: (status: string) => void; // Function to set the "beamed" status filter.
  handleReset: () => void; // Function to reset all filters.
  applyFilters: () => void; // Function to apply the selected filters.
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen, // Modal visibility state.
  onClose, // Function to close the modal.
  categories, // List of categories to display.
  selectedCategories, // Currently selected categories for filtering.
  setSelectedCategories, // Function to update the selected categories.
  beamedStatus, // Current selected beamed status (all, beamed, unbeamed).
  setBeamedStatus, // Function to update beamed status.
  handleReset, // Function to clear all selected filters.
  applyFilters, // Function to apply the selected filters.
}) => {
  // State to track which filter type is currently active.
  const [activeFilter, setActiveFilter] = useState<string | null>("beamedStatus");

  // Function to handle selection and deselection of categories.
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId) // Deselect category if already selected.
        : [...prevSelected, categoryId] // Add category to selection if not already selected.
    );
  };

  // Function to render the options for the currently active filter type (either categories or beamed status).
  const renderFilterOptions = () => {
    if (activeFilter === "category") {
      return (
        <div className="flex flex-col gap-2">
          {/* Render each category as a selectable chip. */}
          {categories.map((category: any) => (
            <Chip
              key={category.id}
              className={`cursor-pointer ${selectedCategories.includes(category.id) ? 'bg-yellow text-black' : 'bg-grey-1 text-grey-2'}`}
              onClick={() => handleCategoryClick(category.id)} // Toggle category selection on click.
            >
              {category.name}
            </Chip>
          ))}
        </div>
      );
    } else if (activeFilter === "beamedStatus") {
      return (
        <div className="flex flex-col gap-2">
          {/* Render beamed status options as chips (All, Beamed, Unbeamed). */}
          <Chip
            className={`cursor-pointer ${beamedStatus === "all" ? 'bg-yellow text-black' : 'bg-grey-1 text-grey-2'}`}
            onClick={() => setBeamedStatus("all")} // Set status to "all".
          >
            All
          </Chip>
          <Chip
            className={`cursor-pointer ${beamedStatus === "beamed" ? 'bg-yellow text-black' : 'bg-grey-1 text-grey-2'}`}
            onClick={() => setBeamedStatus("beamed")} // Set status to "beamed".
          >
            Beamed
          </Chip>
          <Chip
            className={`cursor-pointer ${beamedStatus === "unbeamed" ? 'bg-yellow text-black' : 'bg-grey-1 text-grey-2'}`}
            onClick={() => setBeamedStatus("unbeamed")} // Set status to "unbeamed".
          >
            Unbeamed
          </Chip>
        </div>
      );
    }
    return null; // Return null if no active filter is set.
  };

  return (
    <Modal
      backdrop="blur" // Adds a blurred background effect when the modal is open.
      size="lg" // Set modal size to large.
      isOpen={isOpen} // Modal visibility controlled by the `isOpen` prop.
      onClose={onClose} // Close the modal when the `onClose` function is called.
      placement="auto" // Automatically places the modal in the best position.
      className="max-w-lg rounded-3xl" // Custom width and rounded corners for the modal.
    >
      <ModalContent>
        {/* Modal header with the title "Filter". */}
        <ModalHeader className="flex justify-between items-center">
          <span>Filter</span>
        </ModalHeader>
        
        <ModalBody className="flex flex-row">
          {/* Sidebar with buttons to toggle between "Beamed Status" and "Category" filters. */}
          <div className="w-1/3 pr-2 border-r border-grey-1">
            <div className="flex flex-col gap-4">
              <Button
                size="sm"
                className={` ${activeFilter === "beamedStatus" ? 'bg-yellow text-black' : 'bg-transparent'}`} // Highlight active filter.
                onPress={() => setActiveFilter("beamedStatus")} // Switch to beamed status filter.
              >
                Beamed Status
              </Button>
              <Button
                size="sm"
                className={` ${activeFilter === "category" ? ' bg-yellow text-black' : 'bg-transparent'}`} // Highlight active filter.
                onPress={() => setActiveFilter("category")} // Switch to category filter.
              >
                Category
              </Button>
            </div>
          </div>

          {/* Main content area to display filter options based on the active filter. */}
          <div className="w-2/3 pl-4 flex">
            {renderFilterOptions()} {/* Renders the active filter's options (beamed status or categories). */}
          </div>
        </ModalBody>
        
        <ModalFooter className="flex items-center justify-between">
          {/* Button to clear all selected filters. */}
          <Button className="bg-transparent text-grey-2" onPress={handleReset}>Clear All</Button>
          {/* Button to apply the selected filters. */}
          <Button className="text-background bg-text" onPress={applyFilters}>
            Show Items
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FilterDrawer; // Export the FilterDrawer component for use in other parts of the app.
