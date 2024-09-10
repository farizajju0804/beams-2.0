import React from "react";
import Header from "./Header";
import TopicOfTheDayContainer from "./TopicsOfThedayContainer";
import BeamsTodayListContainer from "./BeamsTodayListContainer";
import SearchBar from "./SearchBar";
import BeamsTodayCard from "./BeamsTodayCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BeamsTodayRecents } from "./BeamsTodayRecents";

interface BeamsTodayPageProps {
  completedTopics: string[];
  user: any;
  topics: any;
  newTopics: any;
  searchQuery: string;
  categories: any;
}

const BeamsTodayPage: React.FC<BeamsTodayPageProps> = ({ completedTopics, user, topics, newTopics, searchQuery, categories }) => {
  // Filter topics based on the search query
  const filteredTopics = searchQuery
    ? topics.filter((topic: any) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : topics;

  return (
    <div className="flex mx-auto max-w-[100vw] lg:max-w-5xl flex-col items-center justify-center w-full bg-background gap-6">
      {/* Page Header */}
      <Header />

      {/* Topic of the Day Section */}
      <TopicOfTheDayContainer user={user} />

      {/* Search Bar for Filtering Topics */}
      <SearchBar completedTopics={completedTopics} topics={topics} categories={categories} />

      {/* Display filtered topics if a search query is entered */}
      {searchQuery ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic: any) => (
            <BeamsTodayCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <>
          {/* Display topics organized by categories if no search query is entered */}
          <BeamsTodayListContainer categories={categories} completedTopics={completedTopics} user={user} />
        </>
      )}

      <BeamsTodayRecents topics={newTopics}/>
    </div>
  );
};

export default BeamsTodayPage;
