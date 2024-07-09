'use client'
import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { getVideoOfTheDay } from "@/actions/beams-today/getVideoOfTheDay";
import { getRecentUploads } from "@/actions/beams-today/getRecentUploads";
import { getcompletedBeamsToday } from "@/actions/beams-today/completedActions";
import Header from "@/components/beams-today/Header";
import TopicOfTheDay from "@/components/beams-today/TopicOfTheDay";
import SortByFilter from "@/components/beams-today/SortByFilter";
import BeamsTodayCard from "@/components/beams-today/BeamsTodayCard";
import CustomPagination from "@/components/Pagination";
import CalendarComponent from "@/components/beams-today/CalendarComponent";
import BeamedFilter from "@/components/beams-today/BeamedFilter";
import { BeamsToday } from "@/types/beamsToday";
import { DateValue, parseDate } from "@internationalized/date";
import { format } from 'date-fns';
import { useCurrentUser } from "@/hooks/use-current-user";

const BeamsTodayPage: React.FC = () => {
  const [topicOfTheDay, setTopicOfTheDay] = useState<BeamsToday | null>(null);
  const [allUploads, setAllUploads] = useState<BeamsToday[]>([]);
  const [recentUploads, setRecentUploads] = useState<BeamsToday[]>([]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [sortBy, setSortBy] = useState("dateDesc");
  const [beamedStatus, setBeamedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const clientDate = new Date().toLocaleDateString("en-CA");
  const user: any = useCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user.id; 
        const [topicOfTheDayData, allUploadsData, completedTopicsData]: any = await Promise.all([
          getVideoOfTheDay(clientDate),
          getRecentUploads(clientDate),
          getcompletedBeamsToday(userId)
        ]);
        console.log("Topic of the Day Data:", topicOfTheDayData); // Add this line
        console.log("All Uploads Data:", allUploadsData); // Add this line
        console.log("Completed Topics Data:", completedTopicsData); // Add this line
        setTopicOfTheDay(topicOfTheDayData);
        setAllUploads(allUploadsData);
        setCompletedTopics(completedTopicsData);
        applyFiltersAndSorting(allUploadsData, completedTopicsData, currentPage);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const highlightDates1 = allUploads.map(video => video.date.toISOString().split('T')[0]);

  const highlightDates = highlightDates1.map(dateString => {
    const date = new Date(dateString);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  });

  const applyFiltersAndSorting = (uploads: BeamsToday[], completed: string[], page: number) => {
    let filteredUploads = uploads;
    if (selectedDate) {
      const selectedDateString = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
      filteredUploads = filteredUploads.filter(topic =>
        new Date(topic.date).toISOString().split('T')[0] === selectedDateString
      );
    }

    if (beamedStatus === 'beamed') {
      filteredUploads = filteredUploads.filter(topic => completed.includes(topic.id));
    } else if (beamedStatus === 'unbeamed') {
      filteredUploads = filteredUploads.filter(topic => !completed.includes(topic.id));
    }

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
      applyFiltersAndSorting(allUploads, completedTopics, currentPage);
    }
  }, [selectedDate, sortBy, beamedStatus, currentPage, allUploads, completedTopics]);

  const handleDateChange = (date: DateValue | null) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page
    applyFiltersAndSorting(allUploads, completedTopics, 1);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    applyFiltersAndSorting(allUploads, completedTopics, currentPage);
  };

  const handleBeamedStatusChange = (status: string) => {
    setBeamedStatus(status);
    applyFiltersAndSorting(allUploads, completedTopics, currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    applyFiltersAndSorting(allUploads, completedTopics, page);
  };

  const handleReset = () => {
    setSelectedDate(null);
    setSortBy("dateDesc");
    setBeamedStatus("all");
    setCurrentPage(1);
    applyFiltersAndSorting(allUploads, completedTopics, 1);
  };

  const minDateString = highlightDates.length > 0 
    ? format(new Date(Math.min(...highlightDates.map(date => date.getTime()))), 'yyyy-MM-dd')
    : null;

  const maxDateString = highlightDates.length > 0 
    ? format(new Date(Math.max(...highlightDates.map(date => date.getTime()))), 'yyyy-MM-dd')
    : null;

  const minDate = minDateString ? parseDate(minDateString) : null;
  const maxDate = maxDateString ? parseDate(maxDateString) : null;


  return (
    <div className="flex flex-col items-center w-full p-8 gap-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Header />
          {topicOfTheDay ? (
            <TopicOfTheDay topic={topicOfTheDay} clientDate={clientDate} />
          ) : (
            <div className="text-center text-lg font-bold mt-8">
              No topic of the day available.
            </div>
          )}
          <div className="w-full max-w-5xl mb-8">
            <div className="flex flex-col items-start lg:flex-row gap-4 justify-between lg:items-center w-full mb-4 ">
    
               <BeamedFilter beamedStatus={beamedStatus} setBeamedStatus={handleBeamedStatusChange} />
               <div className="flex gap-4 items-center lg:justify-normal justify-between lg:w-fit w-full">
               <SortByFilter sortBy={sortBy} setSortBy={handleSortChange} />
                  
                  {minDate && maxDate && (
                    <CalendarComponent 
                      selectedDate={selectedDate} 
                      onDateChange={handleDateChange} 
                      minValue={minDate}
                      maxValue={maxDate}
                    />
                  )}
                  {selectedDate && (
                    <button
                      onClick={handleReset}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Reset
                    </button>
                  )}
             
              </div>
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
