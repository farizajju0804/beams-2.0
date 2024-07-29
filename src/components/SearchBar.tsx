'use client'
import React, { useState, useEffect } from 'react';
import { Input, Button } from '@nextui-org/react';
import CalendarComponent from '@/components/beams-today/CalendarComponent';
import { DateValue, parseDate } from '@internationalized/date';
import BeamsTodayCard from '@/components/beams-today/BeamsTodayCard';
import SortByFilter from '@/components/beams-today/SortByFilter';
import FilterDrawer from '@/components/beams-today/FilterDrawer';
import { format } from 'date-fns';
import { Filter, SearchNormal1 } from 'iconsax-react';
import BeamsTodaySearchCard from './beams-today/BeamsTodaySearchCard';

interface SearchBarProps {
  topics: any;
  categories: any;
  completedTopics: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ topics, categories, completedTopics }) => {
  const [query, setQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [filteredTopics, setFilteredTopics] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [sortBy, setSortBy] = useState("dateDesc");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [beamedStatus, setBeamedStatus] = useState("all");

  // Calculate highlight dates, min date, and max date
  const highlightDates1 = topics.map((topic: any) =>
    new Date(topic.date).toISOString().split("T")[0]
  );

  const highlightDates = highlightDates1.map((dateString: any) => {
    const date = new Date(dateString);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  });

  const minDateString =
    highlightDates.length > 0
      ? format(new Date(Math.min(...highlightDates.map((date: any) => date.getTime()))), "yyyy-MM-dd")
      : null;

  const maxDateString =
    highlightDates.length > 0
      ? format(new Date(Math.max(...highlightDates.map((date: any) => date.getTime()))), "yyyy-MM-dd")
      : null;

  const minDate = minDateString ? parseDate(minDateString) : null;
  const maxDate = maxDateString ? parseDate(maxDateString) : null;

  // Filter topics based on query, selected date, and additional filters
  const filterTopics = () => {
 

    let filtered = topics;

    if (query) {
      filtered = filtered.filter((topic: any) => topic.title.toLowerCase().includes(query.toLowerCase()));
    }

    if (selectedDate) {
      const dateString = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
      filtered = filtered.filter((topic: any) => {
        const topicDate = new Date(topic.date).toISOString().split("T")[0];
        return topicDate === dateString;
      });
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((topic: any) => {
        if (topic.categoryId) {
     
          return selectedCategories.includes(topic.categoryId);
        } else {
       
          return false;
        }
      });
    }

    if (beamedStatus === "beamed") {
      filtered = filtered.filter((topic: any) => completedTopics.includes(topic.id));
    } else if (beamedStatus === "unbeamed") {
      filtered = filtered.filter((topic: any) => !completedTopics.includes(topic.id));
    }

    switch (sortBy) {
      case "nameAsc":
        filtered = filtered.sort((a:any, b:any) => a.title.localeCompare(b.title));
        break;
      case "nameDesc":
        filtered = filtered.sort((a:any, b:any) => b.title.localeCompare(a.title));
        break;
      case "dateAsc":
        filtered = filtered.sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "dateDesc":
      default:
        filtered = filtered.sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }

    console.log("Filtered Topics:", filtered);
    setFilteredTopics(filtered);
    setShowResults(true);
  };

  useEffect(() => {
    if (query || selectedDate || selectedCategories.length > 0 || beamedStatus !== "all") {
      filterTopics();
    } else {
      setFilteredTopics([]);
      setShowResults(false);
    }
  }, [query, selectedDate, sortBy, selectedCategories, beamedStatus]);

  const handleSearch = () => {

    filterTopics();
  };

  const handleDateChange = (date: DateValue | null) => {

    setSelectedDate(date);
  };

  const handleReset = () => {

    setSelectedDate(null);
    setQuery('');
    setSelectedCategories([]);
    setBeamedStatus("all");
    setFilteredTopics([]);
    setShowResults(false);
  };

  const handleSortChange = (sortOption: string) => {
   
    setSortBy(sortOption);
  };

  return (
    <div className="w-full max-w-6xl flex flex-col items-center gap-4">
      <div className="flex w-full lg:w-3/6 px-4 items-center gap-4">
        <Input
          radius='full'
          placeholder="Search topics"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          isDisabled={!!selectedDate}
        />
        <Button color="primary" radius='full' isIconOnly startContent={<SearchNormal1 size='16' className='text-white '/>} onPress={handleSearch} disabled={!!selectedDate}></Button>
        {!query && minDate && maxDate && (
         
          <CalendarComponent
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            minValue={minDate}
            maxValue={maxDate}
          />
        )}
        {selectedDate && <Button onPress={handleReset}>Reset</Button>}
      </div>
      {showResults && (
        <>
          <div className='w-full max-w-6xl pb-8 lg:mt-4 px-6 md:px-12 flex flex-col'>
          <div className="">
    
         <h1 className="text-lg md:text-3xl font-display font-bold mb-[2px]">Search Results</h1>
         <div className="border-b-2 border-brand-950 mb-8 w-full" style={{ maxWidth: '10%' }}></div>
         </div>
            {(!selectedDate && query) && (
              <div className="flex flex-wrap gap-4 items-center justify-between w-full mb-8 mt-4">
                <div className="flex w-full items-center justify-between flex-row gap-4">
                  <Button
                    startContent={<Filter className="text-gray-600 w-full" size={24} />}
                    onPress={() => setIsFilterModalOpen(true)}
                    className="bg-gray-200"
                  >
                    Filters
                  </Button>
                  <SortByFilter
                    sortBy={sortBy}
                    setSortBy={handleSortChange}
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic: any) => (
                  <BeamsTodaySearchCard key={topic.id} topic={topic} />
                ))
              ) : (
                <p>No topics found.</p>
              )}
            </div>
          </div>
        </>
      )}
      <FilterDrawer
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        beamedStatus={beamedStatus}
        setBeamedStatus={setBeamedStatus}
        handleReset={handleReset}
        applyFilters={() => {
      
          filterTopics();
          setIsFilterModalOpen(false);
        }}
      />
    </div>
  );
};

export default SearchBar;
