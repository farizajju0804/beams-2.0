// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import { Input, Button } from '@nextui-org/react';
// import CalendarComponent from '@/app/beams-today/_components/CalendarComponent';
// import { DateValue, parseDate } from '@internationalized/date';
// import SortByFilter from '@/app/beams-today/_components/SortByFilter';
// import FilterDrawer from '@/app/beams-today/_components/FilterDrawer';
// import { format } from 'date-fns';
// import { Filter, SearchNormal1, CloseCircle } from 'iconsax-react';
// import BeamsTodaySearchCard from './BeamsTodaySearchCard';
// import FilterChips from '@/app/beams-today/_components/FilterChips';
// import CustomPagination from '@/components/Pagination';
// import Fuse from 'fuse.js';

// const commonTerms = ["the", "is", "in", "a", "an", "of", "and", "to", "it", "that", "on", "for", "with", "as", "this", "by", "from", "or", "at", "be", "are"];

// const preprocessScript = (script:string) => {
//   if (!script) return [];
//   return script
//     .split(',')
//     .map((phrase:string) => phrase.trim())
//     .filter((phrase:string) => !commonTerms.includes(phrase.toLowerCase()) && phrase.length > 0); 
// };

// const preprocessTopics = (topics:any) => {
//   return topics.map((topic:any) => ({
//     ...topic,
//     scriptWords: preprocessScript(topic.script)
//   }));
// };

// interface SearchBarProps {
//   topics: any;
//   categories: any;
//   completedTopics: string[];
// }

// const SearchBar: React.FC<SearchBarProps> = ({ topics, categories, completedTopics }) => {
//   const [query, setQuery] = useState('');
//   const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
//   const [filteredTopics, setFilteredTopics] = useState<any[]>([]);
//   const [showResults, setShowResults] = useState(false);
//   const [sortBy, setSortBy] = useState("dateDesc");
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [filters, setFilters] = useState<{ id: string; label: string; type: string }[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const itemsPerPage = 9;
//   const calendarRef = useRef<any>(null);
//   // Preprocess the topics to extract script words for fuzzy search
//   const processedTopics = preprocessTopics(topics);
//   // Fuse.js setup for fuzzy searching through the topics.
//   const fuse = new Fuse(processedTopics, {
//     includeScore: true,
//     keys: ['title', 'shortDesc', 'scriptWords'],
//     threshold: 0.3, 
//   });
// // Highlight dates to be passed into the calendar component.
//   const highlightDates1 = topics.map((topic: any) =>
//     new Date(topic.date).toISOString().split("T")[0]
//   );

//   const highlightDates = highlightDates1.map((dateString: any) => {
//     const date = new Date(dateString);
//     return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
//   });
// // Parse the date strings into DateValue objects.
//   const minDateString =
//     highlightDates.length > 0
//       ? format(new Date(Math.min(...highlightDates.map((date: any) => date.getTime()))), "yyyy-MM-dd")
//       : null;

//   const maxDateString =
//     highlightDates.length > 0
//       ? format(new Date(Math.max(...highlightDates.map((date: any) => date.getTime()))), "yyyy-MM-dd")
//       : null;

//   const minDate = minDateString ? parseDate(minDateString) : null;
//   const maxDate = maxDateString ? parseDate(maxDateString) : null;
//   // Function to filter topics based on search query, date, and selected filters.
//   const filterTopics = () => {
//     let filtered = query ? fuse.search(query).map(result => result.item) : topics;
//  // Filter by selected date if provided.
//     if (selectedDate) {
//       const dateString = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
//       filtered = filtered.filter((topic: any) => {
//         const topicDate = new Date(topic.date).toISOString().split("T")[0];
//         return topicDate === dateString;
//       });
//     }
//  // Filter by selected categories.
//     const selectedCategories = filters.filter(filter => filter.type === 'category').map(filter => filter.id);
//     if (selectedCategories.length > 0) {
//       filtered = filtered.filter((topic: any) => {
//         if (topic.categoryId) {
//           return selectedCategories.includes(topic.categoryId);
//         } else {
//           return false;
//         }
//       });
//     }
//  // Filter by completed/uncompleted topics.
//     const beamedStatusFilter = filters.find(filter => filter.type === 'beamedStatus');
//     if (beamedStatusFilter) {
//       if (beamedStatusFilter.id === "beamed") {
//         filtered = filtered.filter((topic: any) => completedTopics.includes(topic.id));
//       } else if (beamedStatusFilter.id === "unbeamed") {
//         filtered = filtered.filter((topic: any) => !completedTopics.includes(topic.id));
//       }
//     }
// // Sort the filtered topics based on the selected sort option.
//     switch (sortBy) {
//       case "nameAsc":
//         filtered = filtered.sort((a: any, b: any) => a.title.localeCompare(b.title));
//         break;
//       case "nameDesc":
//         filtered = filtered.sort((a: any, b: any) => b.title.localeCompare(a.title));
//         break;
//       case "dateAsc":
//         filtered = filtered.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
//         break;
//       case "dateDesc":
//       default:
//         filtered = filtered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
//         break;
//     }

//     setTotalPages(Math.ceil(filtered.length / itemsPerPage));
//     setFilteredTopics(filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
//     setShowResults(true);
//   };


//   useEffect(() => {
//     if (query) {
//       // Remove date filter when searching
//       setSelectedDate(null);
//       setFilters(prevFilters => prevFilters.filter(filter => filter.type !== 'date'));
//     }
//   }, [query]);
//   // Effect to trigger topic filtering whenever relevant state variables change.
//   useEffect(() => {
//     filterTopics();
//   }, [query, sortBy, filters, currentPage, selectedDate]);
  
//   useEffect(() => {
//     if (!query && !filters.length && !selectedDate) {
//       setFilteredTopics(topics.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
//       setShowResults(false);
//     }
//   }, [topics, query, filters, selectedDate, currentPage, itemsPerPage]);


// // Function to handle date changes and reset the query.
//   const handleDateChange = (date: DateValue | null) => {
//     setSelectedDate(date);
//     if (date) {
//       setFilters([{ id: 'date', label: `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`, type: 'date' }]);
//        // Clear the search input when date is selected
//        setQuery('');
//     } else {
//       setFilters(filters.filter(filter => filter.type !== 'date'));
//     }
//   };
//  // Function to reset all filters and the search query.
//   const handleReset = () => {
//     setFilters([]);
//     setSelectedDate(null);
//     setQuery(''); // Clear the search input on reset
//     filterTopics(); 
//   };

//   const handleSortChange = (sortOption: string) => {
//     setSortBy(sortOption);
//   };

//   const removeFilter = (filter: { id: string; type: string }) => {
//     if (filter.type === 'date') {
//       setSelectedDate(null);
//     }
//     setFilters(filters.filter(f => f.id !== filter.id || f.type !== filter.type));
//   };
// // Function to handle pagination changes.
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };
//  // Function to return the number of search results.
//   const getResultsCount = () => {
//     const start = (currentPage - 1) * itemsPerPage + 1;
//     const end = Math.min(currentPage * itemsPerPage, filteredTopics.length);
//     return `Showing ${start}-${end} of ${filteredTopics.length} results for`;
//   };
// // Function to clear the search input.
//   const handleClearInput = () => {
//     setQuery('');
//     setShowResults(false);
//     setFilteredTopics(topics.slice(0, itemsPerPage));
//   };

//   return (
//     <div className="w-full lg:max-w-6xl max-w-[100vw] my-3 md:my-6 flex flex-col items-center gap-4 overflow-x-hidden">
//       <div className="flex w-full lg:w-3/6 px-4 items-center gap-4">
//         <Input
//           classNames={{
//             input: [
//               "placeholder:text-grey-2 md:text-lg",
//             ]
//           }}
//           radius='full'
//           placeholder="Search topics"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           // isDisabled={!!selectedDate}  
//           endContent={
//             query ? (
//               <CloseCircle
//                 size='16'
//                 className='text-grey-2 cursor-pointer'
//                 onClick={handleClearInput}
//                 variant="Bold"
//               />
//             ) : (
//               <SearchNormal1
//                 size='16'
//                 className='text-grey-2'
//               />
//             )
//           }
//         />
//         {!query && minDate && maxDate && (
//           <CalendarComponent
//             ref={calendarRef}
//             selectedDate={selectedDate}
//             onDateChange={handleDateChange}
//             minValue={minDate}
//             maxValue={maxDate}
//             topics={topics}
//           />
//         )}
//       </div>
//       {showResults && (
//         <>
//           <div className='w-full max-w-6xl pb-8 lg:mt-4 px-6 md:px-12 flex flex-col'>
//             <div className="">
//               <h1 className="text-lg md:text-3xl font-display font-bold mb-[1px]">Search Results</h1>
//               <div className="border-b-2 border-brand mb-4 w-full" style={{ maxWidth: '10%' }}></div>
//               <span className='font-normal text-grey-2'>{getResultsCount()}<span className='font-bold'> {query}</span></span>
//             </div>
//             {(!selectedDate && query) && (
//               <div className="flex flex-wrap gap-4 items-center justify-between w-full mb-2 mt-4">
//                 <div className="flex w-full items-center justify-between lg:justify-start flex-row gap-4">
//                   <Button className='bg-grey-1'
//                     startContent={<Filter className="text-grey-2 w-full" size={24} />}
//                     onPress={() => setIsFilterModalOpen(true)}
//                   >
//                     Filters
//                   </Button>
//                   <SortByFilter
//                     sortBy={sortBy}
//                     setSortBy={handleSortChange}
//                   />
//                 </div>
//               </div>
//             )}
//             {filters && (
//                <FilterChips
//                filters={filters}
//                removeFilter={removeFilter}
//              />
//             )}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
//               {filteredTopics.length > 0 ? (
//                 filteredTopics.map((topic: any) => (
//                   <BeamsTodaySearchCard key={topic.id} topic={topic} />
//                 ))
//               ) : (
//                 <p>No topics found.</p>
//               )}
//             </div>
//             <div className='mt-6'>
//             {totalPages > 1 && (
//               <CustomPagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={handlePageChange}
//               />
//             )}
//             </div>
//           </div>
//         </>
//       )}
//       <FilterDrawer
//         isOpen={isFilterModalOpen}
//         onClose={() => setIsFilterModalOpen(false)}
//         categories={categories}
//         selectedCategories={filters.filter(filter => filter.type === 'category').map(filter => filter.id)}
//         setSelectedCategories={(update) => {
//           setFilters(prevFilters => [
//             ...prevFilters.filter(filter => filter.type !== 'category'),
//             ...((typeof update === 'function' ? update(prevFilters.filter(filter => filter.type === 'category').map(filter => filter.id)) : update) as string[]).map(id => ({
//               id,
//               label: categories.find((cat: any) => cat.id === id)?.name,
//               type: 'category'
//             }))
//           ]);
//         }}
//         beamedStatus={filters.find(filter => filter.type === 'beamedStatus')?.id || 'all'}
//         setBeamedStatus={(status: string) => {
//           setFilters(prevFilters => [
//             ...prevFilters.filter(filter => filter.type !== 'beamedStatus'),
//             ...(status !== 'all' ? [{ id: status, label: status === 'beamed' ? 'Beamed' : 'Unbeamed', type: 'beamedStatus' }] : []),
//           ]);
//         }}
//         handleReset={handleReset}
//         applyFilters={() => {
//           filterTopics();
//           setIsFilterModalOpen(false);
//         }}
//       />
//     </div>
//   );
// };

// export default SearchBar;


import React from 'react'

const SearchBar = () => {
  return (
    <div>SearchBar</div>
  )
}

export default SearchBar