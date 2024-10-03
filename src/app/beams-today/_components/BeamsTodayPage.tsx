import React from "react";
import Header from "./Header";
import TopicOfTheDayContainer from "./TopicsOfThedayContainer";
import BeamsTodayListContainer from "./BeamsTodayListContainer";
import SearchBar from "./SearchBar";
import BeamsTodayCard from "./BeamsTodayCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BeamsTodayRecents } from "./BeamsTodayRecents";
import FactOfTheDay from "./FactOfTheDay";
import { Divider } from "@nextui-org/react";

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
     
    <div className="flex mx-auto max-w-[100vw] lg:max-w-5xl flex-col gap-2 md:gap-6 items-center justify-center w-full bg-background ">
      {/* Page Header */}
      <SearchBar completedTopics={completedTopics} topics={topics} categories={categories} />

      {/* Topic of the Day Section */}
      <TopicOfTheDayContainer user={user} />
      {/* <div  className=" w-full h-[1px] rounded-full  mb-2 border-[0.5] bg-grey-1" ></div> */}

      <FactOfTheDay userId={user.id} />
      {/* <div  className=" w-full h-[1px] rounded-full  mb-2 border-[0.5] bg-grey-1" ></div> */}


      <BeamsTodayRecents />
    </div>
    </>
  );
};

export default BeamsTodayPage;
