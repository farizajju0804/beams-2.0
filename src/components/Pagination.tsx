import { Pagination } from "@nextui-org/react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="w-full mx-auto ">
  <Pagination
    total={totalPages}
    initialPage={currentPage}
    onChange={onPageChange}
    className="shadow-lg rounded-lg mx-auto w-full flex items-center justify-center"
  />
  </div>
);

export default CustomPagination;
