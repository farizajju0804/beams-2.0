import React from 'react';
import { Chip } from '@nextui-org/react'; // Importing the Chip component from NextUI
import FormattedDate from './FormattedDate'; // Importing the FormattedDate component

// Define the props for the FilterChips component
interface FilterChipsProps {
  filters: { id: string; label: string; type: string }[]; // Array of filter objects with id, label, and type
  removeFilter: (filter: { id: string; type: string; label: string }) => void; // Function to remove a filter
}

// Functional component for displaying filter chips
const FilterChips: React.FC<FilterChipsProps> = ({ filters, removeFilter }) => {
  return (
    <div className="flex flex-wrap gap-2"> {/* Container for the chips with flex layout */}
      {filters.map(filter => ( // Iterate over the filters array
        <Chip key={filter.id} onClose={() => removeFilter(filter)}> {/* Chip component with close functionality */}
          {filter.type === 'date' ? ( // Check if the filter type is 'date'
            <FormattedDate date={filter.label} /> // Display the formatted date
          ) : (
            filter.label // Otherwise, display the label directly
          )}
        </Chip>
      ))}
    </div>
  );
};

export default FilterChips; // Export the component for use in other parts of the application
