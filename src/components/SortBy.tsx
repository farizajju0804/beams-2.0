"úse client"
import React, { ChangeEvent, useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface Option {
  value: string;
  label: string;
}

interface SortByProps {
  sortBy: string;
  disabled? : boolean;
  setSortBy: (value: string) => void;
  options: Option[];
}

const SortBy: React.FC<SortByProps> = ({ sortBy, setSortBy, options,disabled }) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };

  
    handleResize();

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <Select
      color="primary"
      isDisabled={disabled}
      placeholder="Sort by"
      value={sortBy}
      variant="bordered"
      radius="lg"
      onChange={handleChange}
      aria-label="Sort topics"
      fullWidth={false}
      classNames={{base : "w-[130px]"}}
     
    >
      {options.map((option,index) => (
        <SelectItem key={option.value} value={option.value} className={index < options.length - 1 ? 'border-b rounded-none' : ''}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default SortBy;
