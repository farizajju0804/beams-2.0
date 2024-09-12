'use client';
import Image from "next/image";
import React, { useEffect, useState, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import FavoriteButton from "./FavoriteButton";
import { Button, Chip } from "@nextui-org/react";
import { Microscope } from "iconsax-react";
import SortByFilter from './SortByFilter';  // Assuming you have a SortByFilter component
import CustomPagination from '@/components/Pagination';  // Assuming you have a CustomPagination component
import DateComponent from "./DateComponent";
import FormattedDate from "./FormattedDate";
import { BeamsToday } from "@/types/beamsToday";
import { getRecentUploads } from "@/actions/beams-today/getRecentUploads";
import Loader from "@/components/Loader";

export function BeamsTodayRecents() {
  const [active, setActive] = useState<any | boolean | null>(null);
  const [allUploads, setAllUploads] = useState<BeamsToday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("dateDesc"); // State for sorting
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const itemsPerPage = 9; // Number of items per page
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchRecentUploads = async () => {
      const clientDate = new Date().toLocaleDateString("en-CA");
      const uploads: any = await getRecentUploads(clientDate);
      setAllUploads(uploads.slice(0, 5)); // Limit to 5 items
      setIsLoading(false);
    };
    fetchRecentUploads();
  }, []);
  // Effect to handle body overflow when a modal is active
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  // Sorting the topics based on sortBy state
  const sortedTopics = [...allUploads].sort((a: any, b: any) => {
    switch (sortBy) {
      case "nameAsc":
        return a.title.localeCompare(b.title);
      case "nameDesc":
        return b.title.localeCompare(a.title);
      case "dateAsc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "dateDesc":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Pagination logic
  useEffect(() => {
    setTotalPages(Math.ceil(sortedTopics.length / itemsPerPage));
  }, [sortedTopics]);

  const paginatedTopics = sortedTopics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <Loader/>
    );
  }

  return (
    <>
    {allUploads.length !== 0 && (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] relative h-full md:h-fit  flex flex-col bg-background sm:rounded-3xl overflow-hidden"
            >
              {/* Close Button */}
              <motion.button
                key={`button-${active.title}-${id}`}
                layout
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.05,
                  },
                }}
                className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                onClick={() => setActive(null)}
              >
                <CloseIcon />
              </motion.button>

              {/* Chip */}
              <Chip size="sm" className="mb-2 absolute top-4 left-4 z-[3] bg-white text-black">
                {active.category.name}
              </Chip>

              {/* Image */}
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={active.thumbnailUrl}
                  alt={active.title}
                  className="w-full h-60 lg:h-60 object-cover object-center"
                />
              </motion.div>

              {/* Content */}
              <div className="px-4 py-4">
                <div className="flex justify-between items-center">
                  <motion.h3
                    layoutId={`title-${active.title}-${id}`}
                    className="font-medium text-text font-poppins text-lg md:text-xl"
                  >
                    {active.title}
                  </motion.h3>
                  <FavoriteButton beamsTodayId={active?.id} />
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
                  <FormattedDate date={active.date.toISOString().split('T')[0]} />

                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="flex flex-col w-full">
      {/* Heading */}
      <div className="pl-6 lg:pl-0 w-full flex flex-col items-start lg:items-center">
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Now Trending</h1>
        <div className="border-b-2 mb-4 border-brand w-full" style={{ maxWidth: '13%' }}></div>
      </div>

      {/* Sort By Filter */}
      <div className="flex justify-start pl-6 items-center mb-6">
        <SortByFilter sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {/* List of Topics */}
      <ul className="max-w-5xl px-6 mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-10">
        {paginatedTopics.map((topic: any, index: number) => (
          // <motion.div
          //   layoutId={`card-${topic.title}-${id}`}
          //   key={topic.id}
          //   onClick={() => setActive(topic)}
          //   className="flex flex-col rounded-2xl cursor-pointer"
          // >
          //   <div className="flex gap-4 flex-col w-full">
          //     <motion.div layoutId={`image-${topic.title}-${id}`}>
          //       <Image
          //         priority
          //         width={200}
          //         height={200}
          //         src={topic.thumbnailUrl}
          //         alt={topic.title}
          //         className="h-48 w-full rounded-lg object-cover object-center"
          //       />
          //     </motion.div>
          //     <div className="flex justify-center items-center flex-col">
          //       <motion.h3
          //         layoutId={`title-${topic.title}-${id}`}
          //         className="font-medium text-text font-poppins text-left text-base"
          //       >
          //         {topic.title}
          //       </motion.h3>
          //     </div>
          //   </div>
          // </motion.div>
          <motion.div
          layoutId={`card-${topic.title}-${id}`}
          key={topic.id}
          onClick={() => setActive(topic)}
          className={`cursor-pointer relative h-[260px] w-full md:h-[280px] aspect-square rounded-3xl flex flex-col justify-between px-4 py-6 box-border leading-[normal] tracking-[normal]`}
          style={{ 
            backgroundImage: `url(${topic?.thumbnailUrl})`, // Set background image from topic thumbnail
            backgroundSize: 'cover', 
            backgroundRepeat: 'no-repeat', 
            backgroundPosition: 'center' 
          }}
  >    
   <motion.div layoutId={`image-${topic.title}-${id}`} className="flex flex-row items-center justify-between py-0 px-1">
      {topic?.category && (
        <Chip size='sm' className="mb-2 bg-white text-black">
          {topic?.category.name} {/* Category name displayed in a chip */}
        </Chip>
      )}
    </motion.div>
    <div className="absolute bottom-0 left-0 right-0 mt-auto [backdrop-filter:blur(5px)] rounded-b-3xl [background:linear-gradient(90deg,_#fff5ed,_rgba(255,_255,_255,_0.2)_100%)] flex flex-col items-start justify-start p-4 gap-2 text-left text-base md:text-lg text-black">
    
    <motion.h3  layoutId={`title-${topic.title}-${id}`} className="m-0 relative text-inherit font-semibold font-inherit">
        {topic?.title} {/* Topic title */}
      </motion.h3>
      
    </div>
  </motion.div>
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
    )}
    </>
   
  );
}

// Close Icon Component
export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
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
