'use client'
import React, { useEffect, useState } from "react";
import { Pagination, Button } from "@nextui-org/react";
import { ArrowRight, ArrowLeft } from "iconsax-react"; 

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation(); // Stop event propagation for Previous button
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation(); // Stop event propagation for Next button
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      <div
        onClick={(e) => e.stopPropagation()} // Stop event propagation for the entire container
        className="w-full flex items-center justify-center"
      >
        <Pagination
          total={totalPages}
          page={currentPage}
          showControls={!isMobile}
          onClick={(e) => e.stopPropagation()}
          onChange={(page) => onPageChange(page)} // Only handle page change, no need for event handling
          classNames={{
            wrapper: "gap-4 mx-4",
            prev: "bg-gray-1",
            next: "bg-gray-1",
            item: "text-sm bg-transparent",
            cursor: "bg-text text-background",
            base: "lg:w-full lg:mx-auto lg:flex items-center justify-center",
          }}
        />
      </div>
      {isMobile && (
        <div className="flex gap-4 mt-4">
          <Button
            size="sm"
            isDisabled={currentPage === 1}
            onClick={handlePrevious} // Handle previous button press with stopPropagation
            className="flex items-center"
          >
            <ArrowLeft size="16" />
            Previous
          </Button>
          <Button
            size="sm"
            isDisabled={currentPage === totalPages}
            onClick={handleNext} // Handle next button press with stopPropagation
            className="flex items-center"
          >
            Next
            <ArrowRight size="16" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomPagination;
