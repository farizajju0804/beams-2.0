import React from "react";
import { Chip } from "@nextui-org/react";

interface CategoryChipProps {
  category: { id: string, name: string };
  selectedCategories: string[];
  onCategoryClick: (categoryId: string) => void;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ category, selectedCategories, onCategoryClick }) => {
  const isSelected = selectedCategories.includes(category.id);

  return (
    <Chip
      className={`cursor-pointer ${isSelected ? 'bg-brand-950 text-white' : 'bg-gray-200 text-black'}`}
      onClick={() => onCategoryClick(category.id)}
    >
      {category.name}
    </Chip>
  );
};

export default CategoryChip;
