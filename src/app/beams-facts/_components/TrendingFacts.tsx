'use client'
import React, { useEffect, useState } from "react";
import { BeamsToday } from "@/types/beamsToday";
import Loader from "@/components/Loader";
import CustomPagination from "@/components/Pagination";
import AnimatedImageCard from "./AnimatedImageCard";
import { getTrendingFacts } from "@/actions/fod/fod";
import SortByFilter from "@/app/beams-today/_components/SortByFilter";
import { Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup, Tooltip } from "@nextui-org/react";
import { InfoCircle } from "iconsax-react";

export function TrendingFacts({ completedFacts, facts2 }: any) {
  const [facts, setFacts] = useState<any>(facts2);
  const [sortBy, setSortBy] = useState("dateDesc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOption, setFilterOption] = useState("all");
  const itemsPerPage = 3;

  const filteredFacts = facts.filter((fact: any) => {
    if (filterOption === "beamed") {
      return completedFacts.includes(fact.id);
    } else if (filterOption === "unbeamed") {
      return !completedFacts.includes(fact.id);
    }
    return true;
  });

  const sortedFacts = [...filteredFacts].sort((a: any, b: any) => {
    switch (sortBy) {
      case "dateAsc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "nameAsc":
        return a.title.localeCompare(b.title);
      case "nameDesc":
        return b.title.localeCompare(a.title);
      case "dateDesc":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  useEffect(() => {
    setTotalPages(Math.ceil(sortedFacts.length / itemsPerPage));
  }, [sortedFacts]);

  const paginatedFacts = sortedFacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const InfoIcon = ({ content }:{content:string}) => (
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
          <SortByFilter sortBy={sortBy} setSortBy={setSortBy} />

          <RadioGroup
            orientation="horizontal"
            value={filterOption}
            onValueChange={(value) => setFilterOption(value)}
           
            classNames={{
              wrapper: "gap-1",
            }}
          >
            <Radio value="all" size="sm">All Facts</Radio>
            <div className="flex items-center mx-1">
            <Radio value="beamed" size="sm">Beamed</Radio>
              <InfoIcon content="Facts marked as completed" />
            </div>
            <div className="flex items-center mx-1">
            <Radio value="unbeamed" size="sm">Unbeamed</Radio>
              <InfoIcon content="Facts not yet completed" />
            </div>
          </RadioGroup>
        </div>

        {paginatedFacts.length === 0 && (
          <div className="text-center text-gray-500 mt-6">
            No facts found.
          </div>
        )}

        <ul className="max-w-5xl px-6 mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-10">
          {paginatedFacts.map((fact: any, index: number) => (
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