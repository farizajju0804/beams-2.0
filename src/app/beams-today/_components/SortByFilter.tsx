// components/beams-today/SortByFilter.tsx

import React from "react"; // Import React library
import SortBy from "@/components/SortBy"; // Import the SortBy component

// Define the interface for the props that SortByFilter will receive
interface SortByFilterProps {
  sortBy: string; // The current sorting method
  setSortBy: (value: string) => void; // Function to update the sorting method
  disabled?: boolean; // Optional prop to disable sorting
}

// Define the SortByFilter component using functional component syntax
const SortByFilter: React.FC<SortByFilterProps> = ({ sortBy, setSortBy, disabled }) => {
  // Define sorting options available for selection
  const sortOptions = [
    { value: "nameAsc", label: "Name (A-Z)" }, // Sort by name in ascending order
    { value: "nameDesc", label: "Name (Z-A)" }, // Sort by name in descending order
    { value: "dateAsc", label: "Date (Asc)" }, // Sort by date in ascending order
    { value: "dateDesc", label: "Date (Desc)" } // Sort by date in descending order
  ];

  return (
    <div className="flex w-[130px] gap-4"> {/* Flex container for layout */}
      <SortBy sortBy={sortBy} setSortBy={setSortBy} options={sortOptions} disabled={disabled} />
      {/* Render the SortBy component with props passed down for current sort method, update function, options, and disabled state */}
    </div>
  );
};

// Export the SortByFilter component for use in other parts of the application
export default SortByFilter; 
