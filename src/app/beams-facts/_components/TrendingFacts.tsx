'use client';

import React, { useState } from "react";
import CustomPagination from "@/components/Pagination";
import AnimatedImageCard from "./AnimatedImageCard";
import { getTrendingFacts } from "@/actions/fod/fod";
import SortByFilter from "@/app/beams-today/_components/SortByFilter";
import { Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup } from "@nextui-org/react";
import { InfoCircle } from "iconsax-react";
import Image from "next/image";

// Define the structure of a Fact object
interface Fact {
  id: string;
  title: string;
  finalImage: string;
  date: string;
  isCompleted: boolean;
}

// Define the props for the TrendingFacts component
interface TrendingFactsProps {
  initialData: {
    facts: Fact[];
    totalPages: number;
    currentPage: number;
  };
  userId: string;
  clientDate: string;
}

// Define the sort options available
type SortOption = "dateDesc" | "dateAsc" | "nameAsc" | "nameDesc";

// TrendingFacts component definition
export function TrendingFacts({ initialData, userId, clientDate }: TrendingFactsProps) {
  const [facts, setFacts] = useState<Fact[]>(initialData.facts); // State for the list of facts
  const [sortBy, setSortBy] = useState("dateDesc"); // State for sorting option
  const [currentPage, setCurrentPage] = useState(initialData.currentPage); // State for the current page
  const [totalPages, setTotalPages] = useState(initialData.totalPages); // State for total pages
  const [filterOption, setFilterOption] = useState("all"); // State for filter option

  // Function to fetch data based on page, sort, and filter
  const fetchData = async (page: number, sort: string, filter: string) => {
    try {
      const result = await getTrendingFacts({
        clientDate: clientDate,
        page,
        sortBy: sort as "nameAsc" | "nameDesc" | "dateAsc" | "dateDesc",
        filterOption: filter as "all" | "beamed" | "unbeamed",
        userId
      });

      setFacts(result.facts); // Update the facts state with fetched data
      setTotalPages(result.totalPages); // Update the total pages state
      setCurrentPage(result.currentPage); // Update the current page state
    } catch (error) {
      console.error('Error fetching data:', error); // Log any errors encountered
    }
  };

  // Handle change in sorting option
  const handleSortChange = async (newSortBy: string) => {
    setSortBy(newSortBy); // Update the sorting state
    await fetchData(1, newSortBy, filterOption); // Fetch data for the first page with new sort option
  };

  // Handle change in filter option
  const handleFilterChange = async (newFilter: string) => {
    setFilterOption(newFilter); // Update the filter state
    await fetchData(1, sortBy, newFilter); // Fetch data for the first page with new filter option
  };

  // Handle page change
  const handlePageChange = async (page: number) => {
    await fetchData(page, sortBy, filterOption); // Fetch data for the selected page
  };

  // InfoIcon component for displaying popover information
  const InfoIcon = ({ content }: { content: string }) => (
    <Popover placement="top">
      <PopoverTrigger>
        <sup>
          <InfoCircle size={12} className="ml-1 cursor-pointer text-grey-2" />
        </sup>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-tiny">{content}</div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      <div className="flex mt-4 flex-col w-full">
        <div className="pl-6 lg:pl-0 w-full flex flex-col items-start lg:items-center">
          <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">
            Trending Facts
          </h1>
          <div
            className="border-b-2 mb-6 border-brand w-full"
            style={{ maxWidth: "13%" }}
          ></div>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-6 md:justify-between mb-6 px-6 md:items-center w-full">
          <SortByFilter sortBy={sortBy} setSortBy={handleSortChange} />

          <RadioGroup
            orientation="horizontal"
            value={filterOption}
            onValueChange={handleFilterChange}
            classNames={{ wrapper: "gap-2" }}
          >
            <Radio 
              classNames={{
                wrapper: "w-3 h-3",
                control: "w-1 h-1",
                label: "text-sm"
              }} 
              value="all" 
              size="sm"
            >
              All Facts
            </Radio>
            <div className="flex items-center mx-1">
              <Radio 
                classNames={{
                  wrapper: "w-3 h-3",
                  control: "w-1 h-1",
                  label: "text-sm"
                }} 
                value="beamed" 
                size="sm"
              >
                Beamed
              </Radio>
              <InfoIcon content="Beams facts that you have read" />
            </div>
            <div className="flex items-center mx-1">
              <Radio
                classNames={{
                  wrapper: "w-3 h-3",
                  control: "w-1 h-1",
                  label: "text-sm"
                }} 
                value="unbeamed" 
                size="sm"
              >
                Unbeamed
              </Radio>
              <InfoIcon content="Beams facts that you haven't read" />
            </div>
          </RadioGroup>
        </div>

        {facts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-40 h-40 mb-6">
              <Image
                width={200} 
                height={200} 
                src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1729604854/achievements/empty-box-3d-6717ace7b4c8a_zkwzn0.webp" 
                alt="search"
              />
            </div>
            <h3 className="text-sm text-grey-4 mb-2">
              Facts are looking a bit lonely here! Try tweaking your filters to find more facts.
            </h3>
          </div>
        )}

        <ul className="max-w-5xl px-6 mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-12">
          {facts.map((fact) => (
            <AnimatedImageCard
              key={fact.id}
              imageUrl={fact.finalImage}
              name={fact.title}
            />
          ))}
        </ul>

        <div className="mt-6 md:mt-8">
          {totalPages > 1 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
}
