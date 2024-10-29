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

// Define the interface for Category
interface Category {
  id: string;
  name: string;
}

// Define the interface for paginated data
interface PaginatedData {
  uploads: any; // Type should be more specific based on actual data structure
  totalPages: number;
  currentPage: number;
}

// Define props for BeamsTodayRecents component
interface BeamsTodayRecentsProps {
  initialUploads: PaginatedData; // Initial uploads data
  clientDate: string; // Date from the client
}

// Define the sort options
type SortOption = "dateDesc" | "dateAsc" | "nameAsc" | "nameDesc";

export function BeamsTodayRecents({ initialUploads, clientDate }: BeamsTodayRecentsProps) {
  const [active, setActive] = useState<any | null>(null); // State for currently active upload
  const [uploads, setUploads] = useState<any[]>(initialUploads.uploads); // State for uploads data
  const [sortBy, setSortBy] = useState<SortOption>("dateDesc"); // State for sorting option
  const [currentPage, setCurrentPage] = useState(initialUploads.currentPage); // State for current page
  const [totalPages, setTotalPages] = useState(initialUploads.totalPages); // State for total pages
  const id = useId(); // Generate unique id for animations
  const ref = useRef<HTMLDivElement>(null); // Reference for the modal

  // Effect to handle escape key and body overflow when modal is active
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null); // Close modal on Escape key
      }
    }

    // Set body overflow based on modal state
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Event listener for keydown
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown); // Clean up listener
  }, [active]);

  // Hook to close modal when clicking outside of it
  useOutsideClick(ref, () => setActive(null));

  // Function to fetch data based on page and sort option
  const fetchData = async (page: number, sort: SortOption) => {
    // setIsLoading(true); // Uncomment if loading state is implemented
    try {
      const result = await getRecentUploads({
        clientDate: clientDate, // Pass the client date
        page,
        sortBy: sort, // Pass the sort option
      });
      
      // Update state with fetched data
      setUploads(result.uploads);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.error('Error fetching data:', error); // Log error if fetching fails
    } finally {
      // setIsLoading(false); // Uncomment if loading state is implemented
    }
  };

  // Handle sort option change
  const handleSortChange = async (newSortBy: any) => {
    setSortBy(newSortBy); // Update sort option
    await fetchData(1, newSortBy); // Fetch data for the first page with new sort
  };

  // Handle page change
  const handlePageChange = async (page: number) => {
    await fetchData(page, sortBy); // Fetch data for the selected page
  };

  return (
    <>
      {uploads.length > 0 && ( // Render only if there are uploads
        <>
          <AnimatePresence>
            {active && (
              // Overlay background when modal is active
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
              // Modal for displaying active upload details
              <div className="fixed inset-0 grid place-items-center z-[100]">
                <motion.div
                  layoutId={`card-${active.title}-${id}`} // Unique layout ID for animations
                  ref={ref}
                  className="w-full max-w-[500px] relative h-full md:h-fit flex flex-col bg-background sm:rounded-3xl overflow-hidden"
                >
                  {/* Button to close modal */}
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

                  {/* Chip for category label */}
                  <Chip size="sm" className="mb-2 absolute top-4 left-4 z-[3] bg-white text-black">
                    {active.category.name}
                  </Chip>

                  {/* Display thumbnail image */}
                  <motion.div layoutId={`image-${active.title}-${id}`}>
                    <Image
                      priority
                      width={200}
                      height={200}
                      src={active.thumbnailUrl as string}
                      alt={active.title}
                      className="w-full h-60 lg:h-60 object-cover object-center"
                    />
                  </motion.div>

                  <div className="px-4 py-4">
                    <div className="flex justify-between items-center">
                      {/* Display title */}
                      <motion.h3
                        layoutId={`title-${active.title}-${id}`}
                        className="font-medium text-text font-poppins text-lg md:text-xl"
                      >
                        {active.title}
                      </motion.h3>
                      {/* Favorite button for the current upload */}
                      <FavoriteButton beamsTodayId={active.id} />
                    </div>

                    {/* Display short description */}
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
                      {/* Button to beam the current upload */}
                      <Button
                        endContent={<Microscope variant="Bold" className="text-white" />}
                        className="font-semibold text-white text-lg p-4 lg:px-8 py-6"
                        size="md"
                        as="a"
                        href={`/beams-today/${active.id}`}
                        color="primary"
                      >
                        Beam Now
                      </Button>
                      {/* Formatted date display */}
                      <FormattedDate date={active.date.toISOString().split('T')[0]} />
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="flex py-6 flex-col w-full">
            <div className="pl-6 lg:pl-0 w-full flex flex-col items-start lg:items-center">
              {/* Trending section title */}
              <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">
                Now Trending
              </h1>
              {/* Divider for section */}
              <div className="border-b-2 mb-4 border-brand w-full" style={{ maxWidth: '13%' }}></div>
            </div>

            <div className="flex justify-start pl-6 items-center mb-6">
              {/* Sort by filter component */}
              <SortByFilter
                sortBy={sortBy}
                setSortBy={handleSortChange}
              />
            </div>

            {/* List of uploads displayed in a grid */}
            <ul className="max-w-5xl px-6 mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-10">
              {uploads.map((topic) => (
                <motion.div
                  layoutId={`card-${topic.title}-${id}`} // Unique layout ID for animations
                  key={topic.id}
                  onClick={() => setActive(topic)} // Set the clicked topic as active
                  className="cursor-pointer relative h-[260px] w-full md:h-[280px] aspect-square rounded-3xl flex flex-col justify-between px-4 py-6 box-border leading-[normal] tracking-[normal]"
                  style={{ 
                    backgroundImage: `url(${topic.thumbnailUrl})`, // Background image for the card
                    backgroundSize: 'cover', 
                    backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center' 
                  }}
                >    
                  <motion.div
                    layoutId={`overlay-${topic.title}-${id}`} // Overlay for displaying title and date
                    className="flex flex-col justify-end w-full h-full bg-black/50 rounded-3xl py-4 px-4"
                  >
                    <h2 className="text-white text-base md:text-lg font-semibold">{topic.title}</h2>
                    <FormattedDate date={topic.date.toISOString().split('T')[0]} />
                  </motion.div>
                </motion.div>
              ))}
            </ul>
            
            {/* Custom pagination component for navigating pages */}
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
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