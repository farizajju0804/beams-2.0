'use client';
import React, { useEffect, useState } from "react";
import BeamsTodayCard from "@/components/beams-today/BeamsTodayCard";
import SortByFilter from "@/components/beams-today/SortByFilter";
import CustomPagination from "@/components/Pagination";
import { BeamsToday } from "@/types/beamsToday";
import { Spinner, Button, Chip } from "@nextui-org/react";
import { Filter } from 'iconsax-react';
import FilterDrawer from "@/components/beams-today/FilterDrawer";
import { DateValue } from "@internationalized/date";

interface SearchResultsProps {
  completedTopics: string[];
  categories: any;
  user: any;
  searchQuery: string;
  searchDate: string | null;
  topics: BeamsToday[];
}

const SearchResults: React.FC<SearchResultsProps> = ({
  completedTopics,
  user,
  categories,
  searchQuery,
  searchDate,
  topics
}) => {
  const [filteredTopics, setFilteredTopics] = useState<BeamsToday[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("dateDesc");
  const [beamedStatus, setBeamedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const itemsPerPage = 9;

  useEffect(() => {
    const applyFiltersAndSorting = () => {
      setIsLoading(true);
      let filteredUploads = topics;

      if (searchQuery) {
        filteredUploads = filteredUploads.filter(topic =>
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (searchDate) {
        filteredUploads = filteredUploads.filter(
          (topic) =>
            new Date(topic.date).toISOString().split("T")[0] === searchDate
        );
      }

      if (beamedStatus === "beamed") {
        filteredUploads = filteredUploads.filter((topic) =>
          completedTopics.includes(topic.id)
        );
      } else if (beamedStatus === "unbeamed") {
        filteredUploads = filteredUploads.filter((topic) =>
          !completedTopics.includes(topic.id)
        );
      }

      if (selectedCategories.length > 0) {
        filteredUploads = filteredUploads.filter((topic) =>
          selectedCategories.includes(topic.category.id)
        );
      }

      switch (sortBy) {
        case "nameAsc":
          filteredUploads = filteredUploads.sort((a, b) =>
            a.title.localeCompare(b.title)
          );
          break;
        case "nameDesc":
          filteredUploads = filteredUploads.sort((a, b) =>
            b.title.localeCompare(a.title)
          );
          break;
        case "dateAsc":
          filteredUploads = filteredUploads.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          break;
        case "dateDesc":
        default:
          filteredUploads = filteredUploads.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          break;
      }

      setFilteredTopics(
        filteredUploads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      );
      setIsLoading(false);
    };

    applyFiltersAndSorting();
  }, [topics, searchQuery, searchDate, sortBy, beamedStatus, selectedCategories, currentPage]);

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReset = () => {
    setSortBy("dateDesc");
    setBeamedStatus("all");
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const removeCategoryFilter = (categoryId: string) => {
    setSelectedCategories(prevSelected =>
      prevSelected.filter(id => id !== categoryId)
    );
  };

  const removeBeamedStatusFilter = () => {
    setBeamedStatus("all");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl pb-8 lg:mt-4  px-6 md:px-12">
      <h1 className="text-xl md:text-3xl font-display font-bold mb-1">Search Results</h1>
      <div className="border-b-2 border-brand-950 mb-2 w-full" style={{ maxWidth: '13%' }}></div>
      <div className="">
        <div className="flex flex-wrap gap-2 my-4 lg:flex">
          {selectedCategories.map((categoryId) => {
            const category = categories.find((cat: any) => cat.id === categoryId);
            return (
              <Chip key={categoryId} onClose={() => removeCategoryFilter(categoryId)}>
                {category?.name}
              </Chip>
            );
          })}
          {beamedStatus !== "all" && (
            <Chip onClose={removeBeamedStatusFilter}>
              {beamedStatus === "beamed" ? "Beamed" : "Unbeamed"}
            </Chip>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 items-end justify-end w-full mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between min-w-full">
          <div className="flex flex-row gap-4">
            <Button
              startContent={<Filter className="text-gray-600 w-full" size={24} />}
              onPress={() => setIsFilterModalOpen(true)}
              className="bg-gray-200"
            >
              Filters
            </Button>
            <SortByFilter
              sortBy={sortBy}
              setSortBy={handleSortChange}
            />
          </div>
        </div>
        <button
          onClick={handleReset}
          className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md"
        >
          Reset
        </button>
      </div>
      
      <FilterDrawer
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        beamedStatus={beamedStatus}
        setBeamedStatus={setBeamedStatus}
        handleReset={handleReset}
        applyFilters={() => {
          setIsFilterModalOpen(false);
        }}
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredTopics.map((topic) => (
          <BeamsTodayCard key={topic.id} topic={topic} />
        ))}
      </div>
      <div className="mt-12">
        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredTopics.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default SearchResults;
