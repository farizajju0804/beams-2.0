// components/beams-today/SortByFilter.tsx

import React from "react";
import SortBy from "@/components/SortBy";

interface SortByFilterProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  disabled: boolean;
}

const SortByFilter: React.FC<SortByFilterProps> = ({ sortBy, setSortBy, disabled }) => {
  const sortOptions = [
    { value: "nameAsc", label: "Name (A-Z)" },
    { value: "nameDesc", label: "Name (Z-A)" },
    { value: "dateAsc", label: "Date (Asc)" },
    { value: "dateDesc", label: "Date (Desc)" }
  ];

  return (
    <div className="flex w-[150px] gap-4">
      <SortBy sortBy={sortBy} setSortBy={setSortBy} options={sortOptions} disabled={disabled} />
    </div>
  );
};

export default SortByFilter;
