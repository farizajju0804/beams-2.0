import React from "react";
import Header from "./Header";
import TopicOfTheDayContainer from "./TopicsOfThedayContainer";
import BeamsTodayListContainer from "./BeamsTodayListContainer";
import SearchBar from "./SearchBar";
import BeamsTodayCard from "./BeamsTodayCard";
import Breadcrumbs from "@/components/Breadcrumbs";

interface BeamsTodayPageProps {
  completedTopics: string[];
  user: any;
  topics: any;
  searchQuery: string;
  categories: any;
}

const BeamsTodayPage: React.FC<BeamsTodayPageProps> = ({ completedTopics, user,  topics, searchQuery, categories }) => {
  const filteredTopics = searchQuery
    ? topics.filter((topic:any) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : topics;

  return (
    <div className="flex mx-auto max-w-[100vw] lg:max-w-5xl flex-col items-center justify-center w-full bg-background gap-6">
      
      <Header />
      <TopicOfTheDayContainer user={user} />
      <SearchBar completedTopics={completedTopics} topics={topics} categories={categories} />
      {searchQuery ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic:any) => (
            <BeamsTodayCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <>
          <BeamsTodayListContainer categories={categories} completedTopics={completedTopics} user={user} />
        </>
      )}
    </div>
  );
};

export default BeamsTodayPage;
