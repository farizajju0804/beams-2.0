'use client';
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';

const SearchBar: React.FC = () => {
  return (
    <div className=" w-full mx-auto max-w-md z-20 px-6 mb-6 py-2">
      <div className="relative flex items-center">
        <span className="absolute left-4 text-gray-500">
          <IoSearch size={20} />
        </span>
        <input
          type="text"
          placeholder="Type your question here"
          className="w-full py-3 px-12 rounded-full bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
        />
      </div>
    </div>
  );
};

export default SearchBar;
