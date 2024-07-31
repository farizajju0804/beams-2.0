import React from "react";
import Header from "@/components/beams-today/Header";
import TopicOfTheDayContainer from "@/components/beams-today/TopicsOfThedayContainer";
import BeamsTodayListContainer from "@/components/beams-today/BeamsTodayListContainer";
import SearchBar from "@/components/SearchBar";
import BeamsTodayCard from "@/components/beams-today/BeamsTodayCard";

interface BeamsTodayPageProps {
  completedTopics: string[];
  user: any;
  greeting: string;
  topics: any;
  searchQuery: string;
  categories: any;
}

const BeamsTodayPage: React.FC<BeamsTodayPageProps> = ({ completedTopics, user, greeting, topics, searchQuery, categories }) => {
  const filteredTopics = searchQuery
    ? topics.filter((topic:any) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : topics;

  return (
    <div className="flex flex-col items-center w-full bg-background gap-6">
      <Header />
      <SearchBar completedTopics={completedTopics} topics={topics} categories={categories} />
      {searchQuery ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic:any) => (
            <BeamsTodayCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <>
          <TopicOfTheDayContainer user={user} />
          <BeamsTodayListContainer categories={categories} completedTopics={completedTopics} user={user} />
        </>
      )}
    </div>
  );
};

export default BeamsTodayPage;
