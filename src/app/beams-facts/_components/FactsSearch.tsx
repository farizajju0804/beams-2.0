'use client';
import React, { useState, useEffect } from 'react';
import { Input, Button } from '@nextui-org/react';
import { CloseCircle, Filter } from 'iconsax-react';
import CustomPagination from '@/components/Pagination';
import { NoResultsState } from '@/components/ui/NoResultsState';
import { searchFacts, TransformedFact } from '@/actions/fod/search';
import SortByFilter from '@/app/beams-today/_components/SortByFilter';
import FilterChips from '@/app/beams-today/_components/FilterChips';
import FilterDrawer from '@/app/beams-today/_components/FilterDrawer';
import SearchLoader from '@/components/SearchLoader';
import { FactCard } from './FactCard';
import { CiSearch } from "react-icons/ci";
import { FactModal } from './FactModal';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface SearchResponse {
  facts: TransformedFact[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

interface FactSearchProps {
  categories: Category[];
  userId: string;
}

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


export const getNoResultsMessage = (query: string): string => {
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

   // Function to check if query contains only stopwords
 
   export const isValidQuery = (query: string): boolean => {
    const trimmedQuery = query.trim();
    
    // Check if query is empty
    if (!trimmedQuery) return false;
    
    // Check if query is less than 3 characters
    if (trimmedQuery.length < 3) return false;
    
    // Check if query contains only stopwords
    if (containsOnlyStopwords(trimmedQuery)) return false;
    
    return true;
  };

const FactSearch: React.FC<FactSearchProps> = ({
  categories,
  userId
}) => {
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("dateDesc");
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [beamedStatus, setBeamedStatus] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [selectedFact, setSelectedFact] = useState<any>(null);
  
  const ITEMS_PER_PAGE = 9;

 
  const getActiveFilters = () => {
    const filters = [];

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

  const resetSearch = () => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setQuery("");
    setCurrentPage(1);
    setSortBy("dateDesc");
    setSearchResults(null);
    setSelectedCategories([]);
    setBeamedStatus("all");
    setError(null);
  };

  const removeFilter = async (filter: { id: string; type: string }) => {
    try {
      if (filter.type === 'category') {
        const newCategories = selectedCategories.filter(id => id !== filter.id);
        setSelectedCategories(newCategories);
        await performSearch({ categories: newCategories, page: 1, useCurrentBeamedStatus: true });
      } else if (filter.type === 'beamedStatus') {
        setBeamedStatus('all');
        await performSearch({ categories: selectedCategories, page: 1, useCurrentBeamedStatus: false });
      }
    } catch (error) {
      handleSearchError(error);
    }
  };

  const performSearch = async ({
    categories = selectedCategories,
    page = currentPage,
    useCurrentBeamedStatus = true,
    sortBy: sortValue = sortBy
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchFacts({
        query: query.trim(),
        page,
        sortBy: sortValue,
        categories: categories.length > 0 ? categories : undefined,
        beamedStatus: useCurrentBeamedStatus && beamedStatus !== 'all'
          ? beamedStatus as 'beamed' | 'unbeamed'
          : undefined,
        userId: userId,
      });
      
      setSearchResults(response);
      setCurrentPage(page);
    } catch (error) {
      handleSearchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchError = (error: any) => {
    console.error("Search failed:", error);
    setError("An error occurred while searching. Please try again later.");
    setSearchResults({
      facts: [],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (!newQuery.trim()) {
      setSearchResults(null);
      setCurrentPage(1);
      return;
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      if (!isValidQuery(newQuery)) {
        // Only show no results state if there's actually input
        if (newQuery.trim()) {
          setSearchResults({
            facts: [],
            pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
          });
        }
        return;
      }

      setCurrentPage(1);
      performSearch({ page: 1 });
    }, 800);

    setTypingTimeout(newTimeout);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    performSearch({ page: page });
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);


  

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 my-3 px-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 max-w-2xl mx-auto w-full">
            <Input
              classNames={{
                input: ["placeholder:text-grey-2 md:text-lg"],
              }}
              radius="full"
              placeholder="Search facts"
              value={query}
              aria-label="Search facts"
              onChange={handleInputChange}
              endContent={
                query ? (
                  <CloseCircle
                    size="20"
                    variant="Bold"
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {((searchResults?.facts?.length ?? 0) > 0 || selectedCategories.length > 0 || beamedStatus !== "all") && (
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

        {getActiveFilters().length > 0 && (
          <FilterChips
            filters={getActiveFilters()}
            removeFilter={removeFilter}
          />
        )}
      </div>

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

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <SearchLoader />
        </div>
      )}

      {!isLoading && searchResults && query.trim() && (
        <div className="space-y-6">
          {(searchResults.facts?.length ?? 0) > 0 && (
            <div className="pb-2">
              <p className="text-sm text-grey-2">
                Showing{" "}
                <span className="font-semibold text-text">
                  {getResultsRange(
                    searchResults.pagination.currentPage,
                    searchResults.pagination.totalItems,
                    searchResults.facts?.length ?? 0
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

           {(searchResults.facts?.length ?? 0) === 0 && query.trim() && (
            <NoResultsState 
              query={query} 
              message={getNoResultsMessage(query)}
            />
          )}

          {(searchResults.facts?.length ?? 0) > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.facts.map((fact: TransformedFact, index:number) => (
                // <FlipFactCard key={fact.id} userId={userId} index={index} fact={fact} />
                <FactCard
                thumbnail={fact.thumbnail}
                category={fact.category}
                id={fact.id}
                key={fact.id}
                title={fact.title}
                date={fact.date}
                hashtags={fact.hashtags}
                onClick={() => setSelectedFact(fact)}
              />
              ))}
               {selectedFact && (
          <FactModal
            isOpen={!!selectedFact}
            onClose={() => setSelectedFact(null)}
            fact={selectedFact}
            userId={userId}
          />
        )}
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

export default FactSearch;