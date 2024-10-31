'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button } from '@nextui-org/react';
import { CloseCircle, Filter } from 'iconsax-react';
import { searchTopics, TransformedBeamsToday } from '@/actions/beams-today/search';
import BeamsTodaySearchCard from './BeamsTodaySearchCard';
import { DateValue } from '@internationalized/date';
import CustomPagination from '@/components/Pagination';
import SortByFilter from './SortByFilter';
import FilterDrawer from './FilterDrawer';
import FilterChips from './FilterChips';
import Image from 'next/image';
import SearchLoader from '@/components/SearchLoader';
import { FaSearch } from 'react-icons/fa';

// Type definitions for the component's data structures
interface Category {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  category: Category;
  createdAt: string;
}

interface SearchResponse {
  topics: TransformedBeamsToday[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

interface TopicSearchProps {
  // minDateString: string;
  // maxDateString: string;
  categories: Category[];
  userId: string;
}

interface Filter {
  id: string;
  label: string;
  type: string;
}

// Component to display when no search results are found
const NoResultsState = ({ query }: { query: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-40 h-40 mb-6">
      <Image 
        width={200} 
        height={200} 
        src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1729587896/achievements/search-empty_wzzuq9.webp" 
        className="" 
        alt="search"
      />
    </div>
    <h3 className="text-xl font-medium text-grey-4 mb-2">
      Uh-oh! No results for &quot;<span className="font-semibold">{query}</span>&quot;
    </h3>
    <p className="text-grey-2 max-w-sm">
      Try adjusting your filters or search terms to find what you&apos;re looking for!
    </p>
  </div>
);

const TopicSearch: React.FC<TopicSearchProps> = ({
  categories,
  userId
}) => {
  // State management for search functionality
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("dateDesc");
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [beamedStatus, setBeamedStatus] = useState<string>("all");
  // New state for error handling
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 9;


  

  /**
   * Generates an array of active filters based on selected categories and beamed status
   * @returns Array of Filter objects representing active filters
   */
  const getActiveFilters = (): Filter[] => {
    const filters: Filter[] = [];

    // Add category filters
    selectedCategories.forEach(categoryId => {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        filters.push({
          id: categoryId,
          label: category.name,
          type: 'category'
        });
      }
    });

    // Add beamed status filter
    if (beamedStatus !== 'all') {
      filters.push({
        id: beamedStatus,
        label: beamedStatus === 'beamed' ? 'Beamed' : 'Unbeamed',
        type: 'beamedStatus'
      });
    }

    return filters;
  };

  /**
   * Calculates the range of results being displayed
   * @param currentPage Current page number
   * @param totalItems Total number of items in search results
   * @param currentPageItems Number of items on current page
   * @returns Formatted string showing results range
   */
const getResultsRange = (currentPage: number, totalItems: number, currentPageItems: number) => {
    if (totalItems === 0) return "0 of 0";
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = start + currentPageItems - 1;
    if (start === end) {
      return `${start} result of ${totalItems}`;
    }
    return `${start}-${end} of ${totalItems}`;
  };

  /**
   * Resets all search parameters to their default values
   */
  const resetSearch = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setQuery("");
    setCurrentPage(1);
    setSortBy("dateDesc");
    setSearchResults(null);
    setSelectedDate(null);
    setSelectedCategories([]);
    setBeamedStatus("all");
    setError(null);
  };

  /**
   * Handles the removal of a filter chip
   * @param filter Filter object to be removed
   */
  const removeFilter = async (filter: Filter) => {
   

    try {
      if (filter.type === 'category') {
        const newCategories = selectedCategories.filter(id => id !== filter.id);
        setSelectedCategories(newCategories);
        
        await performSearch({
          categories: newCategories,
          page: 1,
          useCurrentBeamedStatus: true
        });
      } else if (filter.type === 'beamedStatus') {
        setBeamedStatus('all');
        
        await performSearch({
          categories: selectedCategories,
          page: 1,
          useCurrentBeamedStatus: false
        });
      }
    } catch (error) {
      handleSearchError(error);
    }
  };

  /**
   * Performs the search operation with error handling
   * @param options Search options including query and filters
   */
  const performSearch = async ({
    categories = selectedCategories,
    page = currentPage,
    useCurrentBeamedStatus = true,
    sortBy: sortValue = sortBy 
  }) => {


    setIsLoading(true);
    setError(null);

    try {
      const response = await searchTopics({
        query: query.trim(),
        page,
        sortBy: sortValue,
        selectedDate: selectedDate?.toString(),
        categories: categories.length > 0 ? categories : undefined,
        beamedStatus: useCurrentBeamedStatus && beamedStatus !== 'all' 
          ? beamedStatus as 'beamed' | 'unbeamed' 
          : undefined,
        userId: userId,
      });
      // console.log(response)
      setSearchResults(response);
      setCurrentPage(page);
    } catch (error) {
      handleSearchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles various types of search errors
   * @param error Error object from the search operation
   */
  const handleSearchError = (error: any) => {
    console.error("Search failed:", error);
    
    if (!navigator.onLine) {
      setError("You are currently offline. Please check your internet connection.");
    } else if (error.name === 'AbortError') {
      setError("The search request was cancelled. Please try again.");
    } else if (error.response?.status === 429) {
      setError("Too many requests. Please wait a moment and try again.");
    } else {
      setError("An error occurred while searching. Please try again later.");
    }

    setSearchResults({
      topics: [],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
    });
  };

  /**
   * Handles the search input change with debouncing
   * @param e Change event from the search input
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (!newQuery.trim()) {
      setSearchResults(null);
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      if (newQuery.trim()) {
        setCurrentPage(1);
        performSearch({ page: 1 });
      }
    }, 800);

    setTypingTimeout(newTimeout);
  };

    const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    performSearch({ page: page });
  };
  // Clean up the typing timeout on component unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-6">
      {/* Search input and filters section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 max-w-2xl mx-auto w-full">
            <Input
              classNames={{
                input: ["placeholder:text-grey-2 md:text-lg"],
              }}
              radius="full"
              placeholder="Search topics"
              value={query}
              aria-label="Search topics"
              onChange={handleInputChange}
              endContent={
                query ? (
                  <CloseCircle
                    size="20"
                    variant="Bold"
                    className="text-grey-2 cursor-pointer mr-2"
                    onClick={resetSearch}
                  />
                ) : (
                  <FaSearch size="20" className="text-grey-2 mr-2" />
                )
              }
            />
          </div>
        </div>

        {/* Error message display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Filter and sort controls */}
        {((searchResults?.topics?.length ?? 0) > 0 || selectedCategories.length > 0 || beamedStatus !== "all") && (
          <div className="flex mt-2 justify-between items-center">
            <Button
              className="bg-transparent"
              aria-label="Filter"
              startContent={<Filter size="20" />}
              onClick={() => setIsFilterOpen(true)}
            >
              Filter
              {(selectedCategories.length > 0 || beamedStatus !== "all") && (
                <span className="ml-2 text-xs bg-yellow text-black px-2 py-1 rounded-full">
                  {selectedCategories.length + (beamedStatus !== "all" ? 1 : 0)}
                </span>
              )}
            </Button>
            <SortByFilter
              sortBy={sortBy}
              setSortBy={(value) => {
                setSortBy(value);
                setCurrentPage(1);
                performSearch({ page: 1, sortBy: value });
              }}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Active filter chips */}
        {getActiveFilters().length > 0 && (
          <FilterChips
            filters={getActiveFilters()}
            removeFilter={removeFilter}
          />
        )}
      </div>

      {/* Filter drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => {
          setIsFilterOpen(false);
          performSearch({ page: 1 });
        }}
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        beamedStatus={beamedStatus}
        setBeamedStatus={setBeamedStatus}
        handleReset={() => {
          setSelectedCategories([]);
          setBeamedStatus("all");
        }}
        applyFilters={() => {
          setCurrentPage(1);
          performSearch({ page: 1 });
          setIsFilterOpen(false);
        }}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <SearchLoader />
        </div>
      )}

      {/* Search results */}
      {!isLoading && searchResults && (
        <div className="space-y-6">
          {/* Results count */}
          {(searchResults.topics?.length ?? 0) > 0 && (
            <div className="pb-2">
              <p className="text-sm text-grey-2">
                Showing{" "}
                <span className="font-semibold text-text">
                  {getResultsRange(
                    searchResults.pagination.currentPage,
                    searchResults.pagination.totalItems,
                    searchResults.topics?.length ?? 0
                  )}
                </span>{" "}
                results
                {query && (
                  <span>
                    {" "}
                    for &quot;<span className="font-medium text-text">{query}</span>&quot;
                  </span>
                )}
              </p>
            </div>
          )}

          {/* No results state */}
          {(searchResults.topics?.length ?? 0) === 0 && <NoResultsState query={query} />}

          {/* Results grid */}
          {(searchResults.topics?.length ?? 0) > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.topics.map((topic: TransformedBeamsToday) => (
                <BeamsTodaySearchCard 
                  key={topic.id} 
                  topic={topic}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {searchResults.pagination.totalPages > 1 && (
            <CustomPagination
              currentPage={searchResults.pagination.currentPage}
              totalPages={searchResults.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TopicSearch;