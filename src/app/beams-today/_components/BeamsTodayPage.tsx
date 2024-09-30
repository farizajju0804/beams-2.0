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
     
      <FactOfTheDay scratchImage="https://res.cloudinary.com/drlyyxqh9/image/upload/v1727699559/fact%20of%20the%20day/wrap_zd7veo.png" finalImage="https://res.cloudinary.com/drlyyxqh9/image/upload/v1727699154/fact%20of%20the%20day/1-66fa98bfb2fb9_tqcggk.webp" userId={user.id}/>
      {/* Topic of the Day Section */}
      <TopicOfTheDayContainer user={user} />

      {/* Search Bar for Filtering Topics */}
      <SearchBar completedTopics={completedTopics} topics={topics} categories={categories} />

    
      {/* <BeamsTodayListContainer  /> */}
       

      <BeamsTodayRecents />
    </div>
    </>
  );
};

export default BeamsTodayPage;
