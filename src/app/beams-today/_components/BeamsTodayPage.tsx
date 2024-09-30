import React from "react";
import Header from "./Header";
import TopicOfTheDayContainer from "./TopicsOfThedayContainer";
import BeamsTodayListContainer from "./BeamsTodayListContainer";
import SearchBar from "./SearchBar";
import BeamsTodayCard from "./BeamsTodayCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BeamsTodayRecents } from "./BeamsTodayRecents";
import FactOfTheDay from "./FactOfTheDay";

interface BeamsTodayPageProps {
  completedTopics: string[];
  user: any;
  topics: any;
  categories: any;
}

const BeamsTodayPage: React.FC<BeamsTodayPageProps> = ({ completedTopics, user, topics,  categories }) => {
  
  return (
    <>
     {/* <Header /> */}
     
    <div className="flex mx-auto max-w-[100vw] lg:max-w-5xl flex-col items-center justify-center w-full bg-background gap-6">
      {/* Page Header */}
      <SearchBar completedTopics={completedTopics} topics={topics} categories={categories} />
      
      {/* Topic of the Day Section */}
      <TopicOfTheDayContainer user={user} />
      <FactOfTheDay userId={user.id}/>


      {/* Search Bar for Filtering Topics */}

    
      {/* <BeamsTodayListContainer  /> */}
       

      <BeamsTodayRecents />
    </div>
    </>
  );
};

export default BeamsTodayPage;
