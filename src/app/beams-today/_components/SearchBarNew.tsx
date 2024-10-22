'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button } from '@nextui-org/react';
import { SearchNormal1, CloseCircle, Filter } from 'iconsax-react';
import { searchTopics } from '@/actions/beams-today/search';
import BeamsTodaySearchCard from './BeamsTodaySearchCard';
import { DateValue, parseDate } from '@internationalized/date';
import CustomPagination from '@/components/Pagination';
import SortByFilter from './SortByFilter';
import FilterDrawer from './FilterDrawer';
import FilterChips from './FilterChips';
import Image from 'next/image';
import SearchLoader from '@/components/SearchLoader';
import { FaSearch } from 'react-icons/fa';

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
  topics: Topic[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

interface TopicSearchProps {
  minDateString: string;
  maxDateString: string;
  categories: Category[];
//   completedTopicIds: string[];
  userId:string;
}

interface Filter {
  id: string;
  label: string;
  type: string;
}

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
      Try adjusting your filters or search terms to find what you're looking for!
    </p>
  </div>
);

const TopicSearch: React.FC<TopicSearchProps> = ({
  categories,
  userId
}) => {
  // State management
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

  const ITEMS_PER_PAGE = 9;

  // Generate active filters for filter chips
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


  const getResultsRange = (currentPage: number, totalItems: number, currentPageItems: number) => {
    if (totalItems === 0) return "0 of 0";
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = start + currentPageItems - 1;
    if (start === end) {
        return `${start} result of ${totalItems}`;
      }
    return `${start}-${end} of ${totalItems}`;
  };

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
  };


  const removeFilter = async (filter: Filter) => {
    if (filter.type === 'category') {
      const newCategories = selectedCategories.filter(id => id !== filter.id);
      setSelectedCategories(newCategories);
      
      // Perform search with updated filters
      const updatedSearch = async () => {
        setIsLoading(true);
        try {
          const response = await searchTopics({
            query: query.trim(),
            page: 1, // Reset to first page when removing filters
            sortBy,
            selectedDate: selectedDate?.toString(),
            categories: newCategories.length > 0 ? newCategories : undefined,
            beamedStatus: beamedStatus !== 'all' ? beamedStatus as 'beamed' | 'unbeamed' : undefined,
            userId: userId,
          });
          setSearchResults(response);
          setCurrentPage(1);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults({
            topics: [],
            pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      updatedSearch();
    } else if (filter.type === 'beamedStatus') {
      setBeamedStatus('all');
      
      // Perform search without beamed status filter
      const updatedSearch = async () => {
        setIsLoading(true);
        try {
          const response = await searchTopics({
            query: query.trim(),
            page: 1,
            sortBy,
            selectedDate: selectedDate?.toString(),
            categories: selectedCategories.length > 0 ? selectedCategories : undefined,
            beamedStatus: undefined,
            userId: undefined,
          });
          setSearchResults(response);
          setCurrentPage(1);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults({
            topics: [],
            pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      updatedSearch();
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await searchTopics({
        query: query.trim(),
        page: currentPage,
        sortBy,
        selectedDate: selectedDate?.toString(),
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        beamedStatus: beamedStatus !== 'all' ? beamedStatus as 'beamed' | 'unbeamed' : undefined,
        userId: userId,
      });
      setSearchResults(response);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults({
        topics: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
      });
    } finally {
      setIsLoading(false);
    }
  };

//   const handleSearch = async () => {
//     setIsLoading(true);
//     try {
//       // Check if a topic is completed before making the API call
//       const getBeamedStatus = (status: string) => {
//         if (status === 'beamed') {
//           return completedTopicIds;
//         } else if (status === 'unbeamed') {
//           return completedTopicIds.length > 0 ? 'unbeamed' : undefined;
//         }
//         return undefined;
//       };

//       const response = await searchTopics({
//         query: query.trim(),
//         page: currentPage,
//         sortBy,
//         selectedDate: selectedDate?.toString(),
//         categories: selectedCategories.length > 0 ? selectedCategories : undefined,
//         beamedStatus: getBeamedStatus(beamedStatus),
//         userId: undefined,
//       });
//       setSearchResults(response);
//     } catch (error) {
//       console.error("Search failed:", error);
//       setSearchResults({
//         topics: [],
//         pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

  const handleClearInput = () => {
    resetSearch();
  };

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
        handleSearch();
      }
    }, 800);

    setTypingTimeout(newTimeout);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    handleSearch();
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    handleSearch();
  };

  const handleFilterReset = () => {
    setSelectedCategories([]);
    setBeamedStatus("all");
  };

  const applyFilters = () => {
    setCurrentPage(1);
    handleSearch();
    setIsFilterOpen(false);
  };

  // Handle filter drawer close
  const handleFilterDrawerClose = () => {
    setIsFilterOpen(false);
    handleSearch(); // Apply filters when drawer closes
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 max-w-2xl mx-auto w-full">
            <Input
              classNames={{
                input: ["placeholder:text-grey-2 md:text-lg"],
                // inputWrapper: ["px-6"],
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
                    onClick={handleClearInput}
                  />
                ) : (
                  <FaSearch size="20" className="text-grey-2 mr-2" />
                )
              }
            />
          </div>
        </div>

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
              setSortBy={handleSortChange}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Filter Chips */}
        {getActiveFilters().length > 0 && (
          <FilterChips
            filters={getActiveFilters()}
            removeFilter={removeFilter}
            
          />
        )}
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={handleFilterDrawerClose}
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        beamedStatus={beamedStatus}
        setBeamedStatus={setBeamedStatus}
        handleReset={handleFilterReset}
        applyFilters={applyFilters}
      />

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <SearchLoader />
        </div>
      )}

      {!isLoading && searchResults && (
        <div className="space-y-6">
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
                    for "<span className="font-medium text-text">{query}</span>"
                  </span>
                )}
              </p>
            </div>
          )}

          {(searchResults.topics?.length ?? 0) === 0 && <NoResultsState query={query} />}

          {(searchResults.topics?.length ?? 0) > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {searchResults.topics.map((topic: Topic) => (
                <BeamsTodaySearchCard 
                  key={topic.id} 
                  topic={topic}
                //   isBeamed={completedTopicIds.includes(topic.id)}
                />
              ))}
            </div>
          )}

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