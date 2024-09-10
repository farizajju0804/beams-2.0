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
  categories: any;
}

const BeamsTodayPage: React.FC<BeamsTodayPageProps> = ({ completedTopics, user, topics, newTopics, categories }) => {

  return (
    <div className="flex mx-auto max-w-[100vw] lg:max-w-5xl flex-col items-center justify-center w-full bg-background gap-6">
      {/* Page Header */}
      <Header />

      {/* Topic of the Day Section */}
      <TopicOfTheDayContainer user={user} />

      {/* Search Bar for Filtering Topics */}
      <SearchBar completedTopics={completedTopics} topics={topics} categories={categories} />

    
      <BeamsTodayListContainer categories={categories} completedTopics={completedTopics} user={user} />
       

      <BeamsTodayRecents topics={newTopics}/>
    </div>
  );
};

export default BeamsTodayPage;
