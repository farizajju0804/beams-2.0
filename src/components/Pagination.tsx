import React from "react";
import { Pagination } from "@nextui-org/react";
import { ArrowRight } from "iconsax-react"; // Ensure this path is correct

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const customStyles = `
    .custom-prev, .custom-next {
      background-color: #333;
      color: #fff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .custom-forwardIcon, .custom-chevronNext {
      fill: #fff;
    }
  `;

  return (
    <div className="w-full mx-auto">
      <style>{customStyles}</style>
      <Pagination
        total={totalPages}
        initialPage={currentPage}
        onChange={onPageChange}
        showShadow
        // showControls
        classNames={{
          wrapper: "gap-4",
          prev: "custom-prev",
          next: "custom-next"
        }}
        className="rounded-lg mx-auto w-full flex items-center justify-center text-white"
        
      />
    </div>
  );
};

export default CustomPagination;
