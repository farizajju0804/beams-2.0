import React from 'react';
import { Chip } from '@nextui-org/react';
import FormattedDate from './FormattedDate';

interface FilterChipsProps {
  filters: { id: string; label: string; type: string }[];
  removeFilter: (filter: { id: string; type: string }) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, removeFilter }) => {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {filters.map(filter => (
        <Chip key={filter.id} onClose={() => removeFilter(filter)}>
          {filter.type === 'date' ? (
            <FormattedDate date={filter.label} />
          ) : (
            filter.label
          )}
        </Chip>
      ))}
    </div>
  );
};

export default FilterChips;
