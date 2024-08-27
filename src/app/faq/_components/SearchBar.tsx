'use client';
import React, { useState } from 'react';
import Fuse from 'fuse.js';
import { IoSearch, IoClose } from 'react-icons/io5';
import { highlightMatches } from './highlightMatches';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface SearchBarProps {
  faqData: FAQItem[];
}

interface FuseResult<T> {
  item: T;
  matches?: Array<{
    indices: [number, number][];
    key: string;
  }>;
}

const SearchBar: React.FC<SearchBarProps> = ({ faqData }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FuseResult<FAQItem>[]>([]);

  const fuse = new Fuse(faqData, {
    keys: ['question', 'answer'],
    includeMatches: true,
    threshold: 0.3,
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);

    if (searchQuery) {
      const searchResults = fuse.search(searchQuery).map(result => result as FuseResult<FAQItem>);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="w-full mx-auto max-w-xl z-20 px-6 mb-4 md:mb-6 py-2">
      <div className="relative flex items-center">
        <span className="absolute left-4 text-gray-500">
          <IoSearch size={20} />
        </span>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Type your question here"
          className="w-full py-3 px-12 rounded-full bg-gray-100 text-black  focus:outline-none focus:ring-1 focus:ring-brand placeholder-black"
        />
        {query && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <IoClose size={20} />
          </button>
        )}
      </div>

      {query && (
        <div className="mt-4">
          <h2 className="text-gray-700 text-sm mb-2">
            {results.length} result{results.length !== 1 && 's'} for &apos;{query}&apos;
          </h2>
          {results.length > 0 ? (
            <ul className="space-y-4">
              {results.map(({ item, matches }, index) => (
                <li key={index} className="bg-white p-4 rounded-xl shadow-md">
                  <h3 className="font-semibold text-lg">
                    {highlightMatches(item.question, query)}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {highlightMatches(item.answer, query)}
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
