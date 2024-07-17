'use client'
import React, { useState, useEffect } from 'react';
import BeamsTheatreCard from './BeamsTheatreCard';
import CustomPagination from '@/components/Pagination';
import FilterDrawer from './FilterDrawer';
import { Button } from '@nextui-org/react';
import { Filter } from 'iconsax-react'; // Import the Filter icon
import SortBy from '@/components/SortBy'; // Import the SortBy component

interface BeamsTheatreListSectionProps {
  initialData: any[];
  genres: any[];
}

const BeamsTheatreListSection: React.FC<BeamsTheatreListSectionProps> = ({ initialData, genres }) => {
  const [theatreData, setTheatreData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [theatreData, selectedGenres, sortBy]);

  const applyFilters = () => {
    let data = [...theatreData];

    if (selectedGenres.length > 0) {
      data = data.filter(item => selectedGenres.includes(item.genre.id));
    }

    if (sortBy === 'name-asc') {
      data = data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'name-desc') {
      data = data.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'date-asc') {
      data = data.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sortBy === 'date-desc') {
      data = data.sort((a, b) => b.createdAt - a.createdAt);
    }

    setFilteredData(data);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReset = () => {
    setSelectedGenres([]);
    setSortBy('name-asc');
    applyFilters();
  };

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'date-asc', label: 'Date (Asc)' },
    { value: 'date-desc', label: 'Date (Desc)' }
  ];

  return (
    <div className="flex items-center flex-col justify-center max-w-5xl w-full 6 gap-12 relative mx-2 lg:mx-4">
      <div className="flex items-center justify-between w-full">
      
        <Button   className="bg-gray-200" onPress={() => setIsFilterOpen(true)} startContent={<Filter className='text-gray-600' size="20" />}>
          Filter
        </Button>
        <div className="flex items-center gap-4">
          <SortBy sortBy={sortBy} setSortBy={setSortBy} options={sortOptions} disabled={false} />
        </div>
      </div>
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {paginatedData.map((theatre) => (
            <BeamsTheatreCard key={theatre.id} data={theatre} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">No results found</div>
      )}
      <div className='mt-8'>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      </div>
      
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        genres={genres}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        handleReset={handleReset}
        applyFilters={applyFilters}
      />
    </div>
  );
};

export default BeamsTheatreListSection;
