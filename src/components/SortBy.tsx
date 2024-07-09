import React, { ChangeEvent } from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface Option {
  value: string;
  label: string;
}

interface SortByProps {
  sortBy: string;
  disabled : boolean;
  setSortBy: (value: string) => void;
  options: Option[];
}

const SortBy: React.FC<SortByProps> = ({ sortBy, setSortBy, options,disabled }) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  return (
    <Select
      isDisabled={disabled}
      placeholder="Sort by"
      value={sortBy}
      onChange={handleChange}
      className="shadow-lg rounded-lg"
    >
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default SortBy;
