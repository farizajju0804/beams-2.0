'use client'
import React, { useEffect, useState } from "react";
import { BeamsToday } from "@/types/beamsToday";
import Loader from "@/components/Loader";

import CustomPagination from "@/components/Pagination";
import AnimatedImageCard from "./AnimatedImageCard"; // Import the animated card
import { getTrendingFacts } from "@/actions/fod/fod";
import SortByFilter from "@/app/beams-today/_components/SortByFilter";

export function TrendingFacts() {
  const [facts, setFacts] = useState<BeamsToday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("dateDesc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 3;
 

  useEffect(() => {
    const fetchTrendingFacts = async () => {
      const clientDate = new Date().toLocaleDateString("en-CA");
      const facts:any = await getTrendingFacts(clientDate);
      setFacts(facts);
      setIsLoading(false);
    };
    fetchTrendingFacts();
  }, []);

  const sortedFacts = [...facts].sort((a: any, b: any) => {
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex py-6 flex-col w-full">
      <div className="pl-6 lg:pl-0 w-full flex flex-col items-start lg:items-center">
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Trending Facts</h1>
        <div className="border-b-2 mb-6 border-brand w-full" style={{ maxWidth: '13%' }}></div>
      </div>
      <div className="flex justify-start pl-6 items-center mb-6">
        <SortByFilter sortBy={sortBy} setSortBy={setSortBy} />
      </div>
        {/* List of Facts */}
        <ul className="max-w-5xl px-6 mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-10">
          {paginatedFacts.map((fact: any, index: number) => (
            <AnimatedImageCard
              key={fact.id}
              imageUrl={fact.finalImage}
              
              name={fact.title}
            />
          ))}
        </ul>

        {/* Pagination */}
        <div className="mt-6">
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

