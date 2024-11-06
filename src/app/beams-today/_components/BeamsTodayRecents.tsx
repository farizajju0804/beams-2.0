'use client';

import Image from "next/image";
import React, { useEffect, useState, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import FavoriteButton from "./FavoriteButton";
import { Button, Chip } from "@nextui-org/react";
import { Microscope } from "iconsax-react";
import SortByFilter from './SortByFilter';
import CustomPagination from '@/components/Pagination';
import FormattedDate from "./FormattedDate";
import { getRecentUploads } from "@/actions/beams-today/getRecentUploads";
import Link from "next/link";


interface Category {
  id: string;
  name: string;
}



interface PaginatedData {
  uploads: any;
  totalPages: number;
  currentPage: number;
}

interface BeamsTodayRecentsProps {
  initialUploads: PaginatedData;
  clientDate : string;
}

type SortOption = "dateDesc" | "dateAsc" | "nameAsc" | "nameDesc";

export function BeamsTodayRecents({ initialUploads,clientDate }: BeamsTodayRecentsProps) {
  const [active, setActive] = useState<any | null>(null);
  const [uploads, setUploads] = useState<any[]>(initialUploads.uploads);
  const [sortBy, setSortBy] = useState<SortOption>("dateDesc");
  const [currentPage, setCurrentPage] = useState(initialUploads.currentPage);
  const [totalPages, setTotalPages] = useState(initialUploads.totalPages);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const fetchData = async (page: number, sort: SortOption) => {
    // setIsLoading(true);
    try {
      const result = await getRecentUploads({
        clientDate: clientDate,
        page,
        sortBy: sort,
      });
      
      setUploads(result.uploads);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleSortChange = async (newSortBy: any) => {
    setSortBy(newSortBy);
    await fetchData(1, newSortBy);
  };

  const handlePageChange = async (page: number) => {
    await fetchData(page, sortBy);
  };

  

  return (
    <>
      {uploads.length > 0 && (
        <>
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 h-full w-full z-10"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {active && (
              <div className="fixed inset-0 grid place-items-center z-[100]">
                <motion.div
                  layoutId={`card-${active.title}-${id}`}
                  ref={ref}
                  className="w-full max-w-[500px] relative h-full md:h-fit flex flex-col bg-background sm:rounded-3xl overflow-hidden"
                >
                  <motion.button
                    key={`button-${active.title}-${id}`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.05 },
                    }}
                    className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                    onClick={() => setActive(null)}
                  >
                    <CloseIcon />
                  </motion.button>

                  <Chip size="sm" className="mb-2 absolute top-4 left-4 z-[3] bg-white text-black">
                    {active.category.name}
                  </Chip>

                  <motion.div layoutId={`image-${active.title}-${id}`}>
                    <Image
                      priority
                      width={600}
                      height={600}
                      src={active.thumbnailUrl as string}
                      alt={active.title}
                      className="w-full h-60 lg:h-60 object-cover object-center"
                    />
                  </motion.div>

                  <div className="px-4 py-4">
                    <div className="flex justify-between items-center">
                      <motion.h3
                        layoutId={`title-${active.title}-${id}`}
                        className="font-medium text-text font-poppins text-lg md:text-xl"
                      >
                        {active.title}
                      </motion.h3>
                      <FavoriteButton beamsTodayId={active.id} />
                    </div>

                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-grey-2 text-sm md:text-base mt-4"
                    >
                      {active.shortDesc}
                    </motion.div>

                    <div className="pt-4 flex justify-between items-center">
                      <Link href={`/beams-today/${active.id}`} prefetch>
                      <Button
                        endContent={<Microscope variant="Bold" className="text-white" />}
                        className="font-semibold text-white text-lg p-4 lg:px-8 py-6"
                        size="md"
                        color="primary"
                      >
                        Beam Now
                      </Button>
                      </Link>
                      <FormattedDate date={active.date.toISOString().split('T')[0]} />
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="flex py-6 flex-col w-full">
            <div className="pl-6 lg:pl-0 w-full flex flex-col items-start lg:items-center">
              <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">
                Now Trending
              </h1>
              <div className="border-b-2 mb-4 border-brand w-full" style={{ maxWidth: '13%' }}></div>
            </div>

            <div className="flex justify-start pl-6 items-center mb-6">
              <SortByFilter
                sortBy={sortBy}
                setSortBy={handleSortChange}
              />
            </div>

            <ul className="max-w-5xl px-6 mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-10">
              {uploads.map((topic) => (
                <motion.div
                  layoutId={`card-${topic.title}-${id}`}
                  key={topic.id}
                  onClick={() => setActive(topic)}
                  className="cursor-pointer relative max-w-sm w-full mx-auto aspect-square rounded-3xl flex flex-col justify-between px-4 py-6 box-border leading-[normal] tracking-[normal]"
                  style={{ 
                    backgroundImage: `url(${topic.thumbnailUrl})`,
                    backgroundSize: 'cover', 
                    backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center' 
                  }}
                >    
                  <motion.div 
                    layoutId={`image-${topic.title}-${id}`} 
                    className="flex flex-row items-center justify-between py-0 px-1"
                  >
                    {topic.category && (
                      <Chip size='sm' className="mb-2 bg-white text-black">
                        {topic.category.name}
                      </Chip>
                    )}
                    <div 
                      className="rounded-2xl flex flex-row items-start justify-start"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FavoriteButton beamsTodayId={topic.id} />
                    </div>
                  </motion.div>
                  <div className="absolute bottom-0 left-0 right-0 mt-auto [backdrop-filter:blur(5px)] rounded-b-3xl [background:linear-gradient(90deg,_#fff5ed,_rgba(255,_255,_255,_0.2)_100%)] flex flex-col items-start justify-start p-4 gap-2 text-left text-base md:text-lg text-black">
                    <motion.h3 
                      layoutId={`title-${topic.title}-${id}`} 
                      className="m-0 relative text-inherit font-semibold font-inherit"
                    >
                      {topic.title}
                    </motion.h3>
                  </div>
                </motion.div>
              ))}
            </ul>

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
      )}
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.05 },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export default BeamsTodayRecents;