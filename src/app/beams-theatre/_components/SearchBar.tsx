'use client';
import React from 'react';
import { Input } from '@nextui-org/react';

const SearchBar = () => {
  return (
    <div className="w-full lg:max-w-6xl max-w-[100vw] mt-2 flex flex-col items-center gap-4 overflow-x-hidden">
      <div className="flex w-full lg:w-3/6 px-4 items-center gap-4">
        <Input
          classNames={{
            input: [
              "placeholder:text-grey-2 md:text-lg",
            ]
          }}
          radius='full'
          placeholder="Search topics"
        />
      </div>
    </div>
  );
};

export default SearchBar;
