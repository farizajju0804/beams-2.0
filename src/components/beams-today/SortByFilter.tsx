import React, { useState } from "react";
import SortBy from "@/components/SortBy";

const SortByFilter: React.FC<{ sortBy: string; setSortBy: (value: string) => void }> = ({ sortBy, setSortBy }) => {
  const sortOptions = [
    { value: "nameAsc", label: "Name (A-Z)" },
    { value: "nameDesc", label: "Name (Z-A)" },
    { value: "dateAsc", label: "Date (Asc)" },
    { value: "dateDesc", label: "Date (Desc)" }
  ];

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <SortBy sortBy={sortBy} setSortBy={setSortBy} options={sortOptions} />
    </div>
  );
};

export default SortByFilter;
