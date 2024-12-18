'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getFactsByHashtag } from "@/actions/fod/fod";
import CustomPagination from "@/components/Pagination";
import SortByFilter from "@/app/beams-today/_components/SortByFilter";
import { FactModal } from './FactModal';

import { FactCard } from './FactCard';
import Breadcrumbs from '@/components/Breadcrumbs';


interface HashtagFactsProps {
  initialData: {
    facts: any[];
    totalPages: number;
    currentPage: number;
  };
  hashtag: string;
  userId: string;
}

export function HashtagFacts({ initialData, hashtag, userId }: HashtagFactsProps) {
  const [facts, setFacts] = useState(initialData.facts);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [sortBy, setSortBy] = useState("dateDesc");
  const [selectedFact, setSelectedFact] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (page: number, sort: string) => {
    setIsLoading(true);
    try {
      const result = await getFactsByHashtag({
        hashtag,
        userId,
        page,
        sortBy: sort as "dateDesc" | "dateAsc" | "nameAsc" | "nameDesc"
      });
      
      setFacts(result.facts);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.error('Error fetching facts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = async (newSortBy: string) => {
    setSortBy(newSortBy);
    await fetchData(1, newSortBy);
  };

  const handlePageChange = async (page: number) => {
    await fetchData(page, sortBy);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-3">
      {/* Header Section */}
      <div className="mb-4">
        {/* Breadcrumbs navigation */}
        <Breadcrumbs
          pageClassName="text-text"
          linkClassName="text-default-500"
          items={[
            // { href: "/", name: "Home" },
            { name: "Beams Facts", href: "/beams-facts" },
            { name: `#${hashtag}` }
          ]}
        />
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl md:text-4xl font-bold">
          Facts tagged with <span className="text-brand">#{hashtag}</span>
        </h1>
      </motion.div>

      {/* Filter Section */}
      <div className="flex justify-start mb-6">
        <SortByFilter sortBy={sortBy} setSortBy={handleSortChange} />
      </div>

      {/* Empty State */}
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
            Facts are looking a bit lonely here! Try different hashtags.
          </h3>
        </div>
      )}
 
      {/* Facts Grid */}
      <div className="w-full  grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
        {facts.map((fact: any,index:any) => (
          <motion.div
            key={fact.id}
            className=''
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
           <FactCard
                thumbnail={fact.thumbnail}
                category={fact.category}
                id={fact.id}
                title={fact.title}
                date={fact.date}
                hashtags={fact.hashtags}
                onClick={() => setSelectedFact(fact)}
              />
               {selectedFact && (
          <FactModal
            isOpen={!!selectedFact}
            onClose={() => setSelectedFact(null)}
            fact={selectedFact}
            userId={userId}
          />
        )}
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Fact Modal */}
      {selectedFact && (
        <FactModal
          isOpen={!!selectedFact}
          onClose={() => setSelectedFact(null)}
          fact={selectedFact}
          userId={userId}
        />
      )}
    </div>
  );
}