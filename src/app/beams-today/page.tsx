"use client";
import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { getVideoOfTheDay } from "@/actions/beams-today/getVideoOfTheDay";
import { getRecentUploads } from "@/actions/beams-today/getRecentUploads";
import Header from "@/components/beams-today/Header";
import TopicOfTheDay from "@/components/beams-today/TopicOfTheDay";
import CustomDatePicker from "@/components/beams-today/DatePicker";
import SortByFilter from "@/components/beams-today/SortByFilter";
import BeamsTodayCard from "@/components/beams-today/BeamsTodayCard";
import CustomPagination from "@/components/Pagination";
import { BeamsToday } from "@/types/beamsToday";
import { DateValue } from "@internationalized/date";
import {format} from 'date-fns'
const BeamsTodayPage: React.FC = () => {
  const [topicOfTheDay, setTopicOfTheDay] = useState<BeamsToday | null>(null);
  const [allUploads, setAllUploads] = useState<BeamsToday[]>([]);
  const [recentUploads, setRecentUploads] = useState<BeamsToday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [sortBy, setSortBy] = useState("dateDesc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientDate = new Date().toLocaleDateString("en-CA");
        const [topicOfTheDayData, allUploadsData]:any = await Promise.all([
          getVideoOfTheDay(clientDate),
          getRecentUploads(clientDate),
        ]);
        setTopicOfTheDay(topicOfTheDayData);
        setAllUploads(allUploadsData);
        applyFiltersAndSorting(allUploadsData, currentPage);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const applyFiltersAndSorting = (uploads: BeamsToday[], page: number) => {
    let filteredUploads = uploads;
    // if (selectedDate) {
    //   filteredUploads = filteredUploads.filter(topic =>
    //     topic.date.toISOString().split("T")[0] === format(selectedDate, "yyyy-MM-dd")
    //   );
    // }

    switch (sortBy) {
      case "nameAsc":
        filteredUploads = filteredUploads.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "nameDesc":
        filteredUploads = filteredUploads.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "dateAsc":
        filteredUploads = filteredUploads.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "dateDesc":
      default:
        filteredUploads = filteredUploads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }

    setRecentUploads(filteredUploads.slice((page - 1) * itemsPerPage, page * itemsPerPage));
  };

  useEffect(() => {
    if (allUploads.length > 0) {
      applyFiltersAndSorting(allUploads, currentPage);
    }
  }, [selectedDate, sortBy, currentPage, allUploads]);

  const handleDateChange = (date: DateValue | null) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page
    applyFiltersAndSorting(allUploads, 1);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    applyFiltersAndSorting(allUploads, currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    applyFiltersAndSorting(allUploads, page);
  };

  const clientDate = new Date().toLocaleDateString("en-CA");

  return (
    <div className="flex flex-col items-center w-full p-8 gap-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Header />
          <TopicOfTheDay topic={topicOfTheDay} clientDate={clientDate} />
          <div className="w-full max-w-5xl mb-8">
            <div className="flex justify-between items-center mb-4">
              {/* <CustomDatePicker
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                highlightDates={allUploads.map(upload => new Date(upload.date))}
              /> */}
              <SortByFilter sortBy={sortBy} setSortBy={handleSortChange} />
            </div>
            {recentUploads.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentUploads.map((topic) => (
                    <BeamsTodayCard key={topic.id} topic={topic} />
                  ))}
                </div>
                <div className="mt-4">
                  <CustomPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(allUploads.length / itemsPerPage)}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <div className="text-center text-lg font-bold mt-8">
                No recent uploads available.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BeamsTodayPage;
