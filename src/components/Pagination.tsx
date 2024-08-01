import React from "react";
import { Pagination, Button } from "@nextui-org/react";
import { ArrowRight, ArrowLeft } from "iconsax-react"; // Ensure this path is correct

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const isMobile = window.innerWidth < 767
const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="w-full mx-auto flex flex-col items-center">
      <Pagination
        total={totalPages}
        page={currentPage}
        showControls={!isMobile}
        onChange={(page) => onPageChange(page)}
        classNames={{
          wrapper: "gap-4 mx-4",
          prev: "bg-gray-1",
          next: "bg-gray-1",
          item: "text-sm bg-transparent",
          cursor: "bg-text text-background",
          base: "lg:w-full lg:mx-auto lg:flex items-center justify-center",
        }}
        className=""
      />
      {isMobile  && (
         <div className="flex gap-4 mt-4">
         <Button
           size="sm"
           isDisabled={currentPage === 1}
           onPress={() => onPageChange(currentPage - 1)}
           className="flex items-center"
         >
           <ArrowLeft size="16" />
           Previous
         </Button>
         <Button
           size="sm"
           isDisabled={currentPage === totalPages}
           onPress={() => onPageChange(currentPage + 1)}
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
