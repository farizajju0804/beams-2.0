// app/components/search/GlobalSearch.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, Select, SelectItem } from '@nextui-org/react';
import { CloseCircle, Filter } from 'iconsax-react';
import CustomPagination from '@/components/Pagination';
import { NoResultsState } from '@/components/ui/NoResultsState';

import SearchLoader from '@/components/SearchLoader';
import { CiSearch } from "react-icons/ci";
import { globalSearch } from '@/actions/home/search';
import SortByFilter from '@/app/beams-today/_components/SortByFilter';
import FilterChips from '@/app/beams-today/_components/FilterChips';
import FilterDrawer from '@/app/beams-today/_components/FilterDrawer';
import { SearchResult, SearchResultCard } from './SearchResultCard';
import { FactModal } from '@/app/beams-facts/_components/FactModal';
export type SortByValue = 'dateDesc' | 'dateAsc' | 'nameAsc' | 'nameDesc';
interface Category {
  id: string;
  name: string;
  color: string;
}

interface GlobalSearchProps {
  categories: Category[];
  userId: string;
}

const contentTypes = [
  { value: "all", label: "All" },
  { value: "beamsToday", label: "Beams Today" },
  { value: "fact", label: "Beams Facts" },
  { value: "connectionGame", label: "Beams Connect" }
];

const stopwords = [
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
  "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
  "to", "was", "were", "will", "with", "the", "this", "but", "they",
  "have", "had", "what", "when", "where", "who", "which", "why", "how"
];


  
const containsOnlyStopwords = (query: string): boolean => {
  const words = query.toLowerCase().trim().split(/\s+/);
  return words.every(word => stopwords.includes(word));
};

const getNoResultsMessage = (query: string): string => {
  if (!query.trim()) {
    return "Please enter a search term";
  }
  if (query.length < 3) {
    return "Please enter at least 3 characters";
  }
  if (containsOnlyStopwords(query)) {
    return "Please enter more specific search terms";
  }
  return `No results found for "${query}"`;
};

const isValidQuery = (query: string): boolean => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return false;
  if (trimmedQuery.length < 3) return false;
  if (containsOnlyStopwords(trimmedQuery)) return false;
  return true;
};

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  categories,
  userId
}) => {
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<SortByValue>("dateDesc");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedContentType, setSelectedContentType] = useState<any>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [beamedStatus, setBeamedStatus] = useState<any>("all");
  const [error, setError] = useState<string | null>(null);
  const [selectedFact, setSelectedFact] = useState<any | null>(null);
  const ITEMS_PER_PAGE = 9;

  const getActiveFilters = () => {
    const filters = [];

    if (selectedContentType !== 'all') {
      filters.push({
        id: selectedContentType,
        label: contentTypes.find(t => t.value === selectedContentType)?.label || '',
        type: 'contentType'
      });
    }

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
    return `${start}-${end} of ${totalItems}`;
  };

  const performSearch = async () => {
   
    if (!isValidQuery(query)) return;

    setIsLoading(true);
    setError(null);

    try {
       
      const response = await globalSearch({
        query: query.trim(),
        page: currentPage,
        contentType: selectedContentType !== 'all' ? selectedContentType : undefined,
        sortBy,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        beamedStatus: beamedStatus !== 'all' ? beamedStatus as 'beamed' | 'unbeamed' : undefined,
        userId,
        itemsPerPage: ITEMS_PER_PAGE
      });
     
      setSearchResults(response);
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setQuery("");
    setCurrentPage(1);
    setSortBy("dateDesc");
    setSearchResults(null);
    setSelectedContentType("all");
    setSelectedCategories([]);
    setBeamedStatus("all");
    setError(null);
  };

  const removeFilter = async (filter: { id: string; type: string }) => {
    if (filter.type === 'contentType') {
      setSelectedContentType('all');
    } else if (filter.type === 'category') {
      setSelectedCategories(prev => prev.filter(id => id !== filter.id));
    } else if (filter.type === 'beamedStatus') {
      setBeamedStatus('all');
    }
    setCurrentPage(1);
    performSearch();
  };

 // In GlobalSearch.tsx, modify the useEffect:
useEffect(() => {
   
    if (typingTimeout) clearTimeout(typingTimeout);
  
    const newTimeout = setTimeout(() => {
      if (query.trim()) {
        // Only reset page to 1 when search parameters change, not when page changes
        if (currentPage === 1) {
          performSearch();
        }
      }
    }, 300);
  
    setTypingTimeout(newTimeout);
  
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [query, selectedContentType, selectedCategories, beamedStatus, sortBy]); // Remove currentPage from dependencies


  const handlePageChange = async (page: number) => {

    
    // Set loading state first
    setIsLoading(true);
    setCurrentPage(page);

    try {
      const response = await globalSearch({
        query: query.trim(),
        page,  // Use the page parameter directly
        contentType: selectedContentType !== 'all' ? selectedContentType : undefined,
        sortBy,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        beamedStatus: beamedStatus !== 'all' ? beamedStatus as 'beamed' | 'unbeamed' : undefined,
        userId,
        itemsPerPage: ITEMS_PER_PAGE
      });

   

      setSearchResults(response);
    } catch (error) {
      console.error('Error during page change:', error);
      setError('An error occurred while changing pages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 my-3 px-6">
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-row gap-2 md:gap-4">
        <Select
  className="w-[80px] text-xs"
  radius='full'
  classNames={{
    base: "text-xs",
    trigger: "text-xs",
    value: "text-xs",
    popoverContent: "min-w-[140px] text-xs",
    listboxWrapper: "text-xs",
     
    // Target items using data attributes for more precise styling
    listbox: "text-xs [&_[role=option]_[data-label=true]]:text-xs flex-0",
  }}
  variant='faded'
  selectedKeys={[selectedContentType]}
  onChange={(e) => setSelectedContentType(e.target.value)}
>
  {contentTypes.map((type) => (
    <SelectItem 
      key={type.value} 
      value={type.value}
    >
      {type.label}
    </SelectItem>
  ))}
</Select>
          <div className="flex-1">
            <Input
              classNames={{
                input: ["placeholder:text-grey-2 text-sm"],
              }}
              radius="full"
              
              variant='faded'
              placeholder="Enter your search term here"
              value={query}
              aria-label='search'
              onChange={(e) => setQuery(e.target.value)}
              endContent={
                query ? (
                  <CloseCircle
                    size="20"
                    className="text-default-500 cursor-pointer mr-2"
                    onClick={resetSearch}
                  />
                ) : (
                  <CiSearch size="20" className="text-default-500 mr-2" />
                )
              }
            />  
            </div>
          </div>
          {query && searchResults?.results.length > 0 && (
          <div className="flex w-full mt-2 justify-between items-center">
          <Button
            className="bg-transparent"
            startContent={<Filter size="20" />}
            onClick={() => setIsFilterOpen(true)}
          >
            Filter
            {getActiveFilters().length > 0 && (
              <span className="ml-2 text-xs bg-yellow text-black px-2 py-1 rounded-full">
                {getActiveFilters().length}
              </span>
            )}
          </Button>

          <SortByFilter
            sortBy={sortBy}
            setSortBy={(value:any) => setSortBy(value)}
            disabled={isLoading}
          />
          </div>
       
        )}
        {getActiveFilters().length > 0 && (
          <FilterChips
            filters={getActiveFilters()}
            removeFilter={removeFilter}
          />
        )}
         
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
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
          performSearch();
          setIsFilterOpen(false);
        }}
      />

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <SearchLoader />
        </div>
      )}

      {!isLoading && searchResults && query.trim() && (
        <div className="space-y-6">
          {searchResults.results.length > 0 && (
            <div className="pb-2">
              <p className="text-sm text-grey-2">
                Showing{" "}
                <span className="font-semibold text-text">
                  {getResultsRange(
                    searchResults.pagination.currentPage,
                    searchResults.pagination.totalItems,
                    searchResults.results.length
                  )}
                </span>{" "}
                results
                {query && (
                  <span>
                    {" "}
                    for &quot;<span className="font-medium text-brand">{query}</span>&quot;
                  </span>
                )}
              </p>
            </div>
          )}

          {searchResults.results.length === 0 && (
            <NoResultsState 
              query={query} 
              message={getNoResultsMessage(query)}
            />
          )}

          {searchResults.results.length > 0 && (
            <div className="flex flex-col gap-10">
              {searchResults.results.map((result: any) => (
                <SearchResultCard
                  key={`${result.type}-${result.id}`}
                  result={result}
                  onSelect={(result) => setSelectedFact(result)}
                />
              ))}
            </div>
          )}
          {selectedFact && (
        <FactModal
          isOpen={!!selectedFact}
          onClose={() => setSelectedFact(null)}
          fact={selectedFact}
          userId={userId}
        />
      )}

            {searchResults?.pagination.totalPages > 1 && (
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

export default GlobalSearch;