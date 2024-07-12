'use client'
import React, { useEffect, useState } from "react";
import { getRecentUploads } from "@/actions/beams-today/getRecentUploads";
import BeamsTodayCard from "@/components/beams-today/BeamsTodayCard";
import SortByFilter from "@/components/beams-today/SortByFilter";
import CalendarComponent from "@/components/beams-today/CalendarComponent";
import CustomPagination from "@/components/Pagination";
import { BeamsToday } from "@/types/beamsToday";
import { DateValue, parseDate } from "@internationalized/date";
import { format } from "date-fns";
import { Spinner, Button, Chip } from "@nextui-org/react";
import { Filter } from 'iconsax-react';
import FilterDrawer from "@/components/beams-today/FilterDrawer";

interface BeamsTodayListContainerProps {
  completedTopics: string[];
  categories: any;
  user: any;
}

const BeamsTodayListContainer: React.FC<BeamsTodayListContainerProps> = ({
  completedTopics,
  user,
  categories
}) => {
  const [allUploads, setAllUploads] = useState<BeamsToday[]>([]);
  const [recentUploads, setRecentUploads] = useState<BeamsToday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [sortBy, setSortBy] = useState("dateDesc");
  const [beamedStatus, setBeamedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchRecentUploads = async () => {
      const clientDate = new Date().toLocaleDateString("en-CA");
      const uploads: any = await getRecentUploads(clientDate);
      setAllUploads(uploads);
      setIsLoading(false);
    };
    fetchRecentUploads();
  }, []);

  const applyFiltersAndSorting = (uploads: BeamsToday[], completed: string[], page: number) => {
    let filteredUploads = uploads;

    if (selectedDate) {
      const selectedDateString = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
      filteredUploads = filteredUploads.filter(
        (topic) =>
          new Date(topic.date).toISOString().split("T")[0] === selectedDateString
      );
    }

    if (beamedStatus === "beamed") {
      filteredUploads = filteredUploads.filter((topic) =>
        completed.includes(topic.id)
      );
    } else if (beamedStatus === "unbeamed") {
      filteredUploads = filteredUploads.filter((topic) =>
        !completed.includes(topic.id)
      );
    }

    if (selectedCategories.length > 0) {
      filteredUploads = filteredUploads.filter((topic) =>
        selectedCategories.includes(topic.category.id)
      );
    }

    switch (sortBy) {
      case "nameAsc":
        filteredUploads = filteredUploads.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;
      case "nameDesc":
        filteredUploads = filteredUploads.sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;
      case "dateAsc":
        filteredUploads = filteredUploads.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "dateDesc":
      default:
        filteredUploads = filteredUploads.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
    }

    setRecentUploads(
      filteredUploads.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    );
  };

  const handleDateChange = (date: DateValue | null) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReset = () => {
    setSelectedDate(null);
    setSortBy("dateDesc");
    setBeamedStatus("all");
    setSelectedCategories([]);
    setCurrentPage(1);
    applyFiltersAndSorting(allUploads, completedTopics, 1);
  };

  const removeCategoryFilter = (categoryId: string) => {
    setSelectedCategories(prevSelected =>
      prevSelected.filter(id => id !== categoryId)
    );
  };

  const removeBeamedStatusFilter = () => {
    setBeamedStatus("all");
  };

  useEffect(() => {
    applyFiltersAndSorting(allUploads, completedTopics, currentPage);
  }, [allUploads, selectedDate, sortBy, beamedStatus, selectedCategories, currentPage]);

  const highlightDates1 = allUploads.map((topic) =>
    new Date(topic.date).toISOString().split("T")[0]
  );

  const highlightDates = highlightDates1.map((dateString) => {
    const date = new Date(dateString);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  });

  const minDateString =
    highlightDates.length > 0
      ? format(new Date(Math.min(...highlightDates.map((date) => date.getTime()))), "yyyy-MM-dd")
      : null;

  const maxDateString =
    highlightDates.length > 0
      ? format(new Date(Math.max(...highlightDates.map((date) => date.getTime()))), "yyyy-MM-dd")
      : null;

  const minDate = minDateString ? parseDate(minDateString) : null;
  const maxDate = maxDateString ? parseDate(maxDateString) : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl pb-8 px-6 md:px-12">
      <h1 className="text-xl md:text-3xl font-display font-bold mb-1">Trending Topics</h1>
      <div className="border-b-2 border-brand-950 mb-2 w-full" style={{ maxWidth: '13%' }}></div>
      <div className="">
        <div className="flex flex-wrap gap-2 my-4 lg:flex">
          {selectedCategories.map((categoryId) => {
            const category = categories.find((cat: any) => cat.id === categoryId);
            return (
              <Chip key={categoryId} onClose={() => removeCategoryFilter(categoryId)}>
                {category?.name}
              </Chip>
            );
          })}
          {beamedStatus !== "all" && (
            <Chip onClose={removeBeamedStatusFilter}>
              {beamedStatus === "beamed" ? "Beamed" : "Unbeamed"}
            </Chip>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-between w-full mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between min-w-full">
          <div className="flex flex-row gap-4">
          <Button
            startContent={<Filter className="text-gray-600 w-full" size={24} />}
            onPress={() => setIsFilterModalOpen(true)}
            className="bg-gray-200"
            disabled={!!selectedDate}
          >
            Filters
          </Button>
          <SortByFilter
            sortBy={sortBy}
            setSortBy={handleSortChange}
            disabled={!!selectedDate}
          />
          </div>
          {minDate && maxDate && (
            <CalendarComponent
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              minValue={minDate}
              maxValue={maxDate}
            />
          )}
        </div>
        {selectedDate && (
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Reset
          </button>
        )}
      </div>
      
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
          applyFiltersAndSorting(allUploads, completedTopics, currentPage);
          setIsFilterModalOpen(false);
        }}
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        {recentUploads.map((topic) => (
          <BeamsTodayCard key={topic.id} topic={topic} />
        ))}
      </div>
      <div className="mt-8">
        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(allUploads.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default BeamsTodayListContainer;
