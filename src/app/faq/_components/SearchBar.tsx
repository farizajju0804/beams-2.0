// Import necessary libraries and components
'use client';
import React, { useState } from 'react';
import Fuse from 'fuse.js'; // Fuzzy search library
import { IoSearch, IoClose } from 'react-icons/io5'; // Icons for search and clear
import { highlightMatches } from './highlightMatches'; // Utility to highlight matches in search results
import { Input } from '@nextui-org/react'; // Input component from NextUI

// Define the FAQ item interface
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

// Define props for the SearchBar component
interface SearchBarProps {
  faqData: FAQItem[]; // Array of FAQ items to be searched
}

// Define the structure for search results with match highlighting
interface FuseResult<T> {
  item: T;
  matches?: Array<{
    indices: [number, number][];
    key: string;
  }>;
}

// Main SearchBar component
const SearchBar: React.FC<SearchBarProps> = ({ faqData }) => {
  const [query, setQuery] = useState(''); // State to track the search query
  const [results, setResults] = useState<FuseResult<FAQItem>[]>([]); // State to track search results

  // Initialize Fuse.js with the FAQ data and configuration for matching
  const fuse = new Fuse(faqData, {
    keys: ['question', 'answer'], // Search in both question and answer fields
    includeMatches: true,
    threshold: 0.3, // Allows for partial matches
  });

  // Handle user input and perform the search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);

    if (searchQuery) {
      // Perform the search and store the results
      const searchResults = fuse.search(searchQuery).map(result => result as FuseResult<FAQItem>);
      setResults(searchResults);
    } else {
      setResults([]); // Clear results if the query is empty
    }
  };

  // Clear the search input and results
  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="w-full mx-auto max-w-xl z-20 px-4 mb-4 md:mb-6 py-2">
      <div className="relative flex items-center">
        <Input
          type="text"
          radius="full"
          startContent={<IoSearch size={20} />} // Search icon on the left
          value={query}
          onChange={handleSearch}
          placeholder="Type your question here"
          className="w-full py-3 px-4 rounded-full placeholder-text"
          endContent={query && ( // Show clear button when there's a query
            <button
              onClick={handleClearSearch}
              className="absolute right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <IoClose size={20} />
            </button>
          )}
        />
      </div>

      {query && ( // Display results if there is a query
        <div className="mt-4">
          <h2 className="text-grey-2 text-sm ml-4 mb-2">
            {results.length} result{results.length !== 1 && 's'} for &apos;{query}&apos;
          </h2>
          {results.length > 0 ? (
            <ul className="space-y-4">
              {results.map(({ item, matches }, index) => (
                <li key={index} className="bg-background p-4 rounded-xl shadow-md">
                  <h3 className="font-semibold text-lg text-text">
                    {highlightMatches(item.question, query)} {/* Highlight matching parts */}
                  </h3>
                  <p className="text-grey-2 mt-2">
                    {highlightMatches(item.answer, query)} {/* Highlight matching parts */}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No results found for &apos;{query}&apos;</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
