import React from "react";
import { cookies } from 'next/headers';
import TopicOfTheDayContainer from "./TopicsOfThedayContainer";
import BeamsTodayListContainer from "./BeamsTodayListContainer";
import SearchBar from "./SearchBar";

import { BeamsTodayRecents } from "./BeamsTodayRecents";
import { getRecentUploads } from "@/actions/beams-today/getRecentUploads";
import { getTopicOfTheDay } from "@/actions/beams-today/getTopicOfTheDay";
import TopicOfTheDay from "./TopicOfTheDay";

interface BeamsTodayPageProps {
  completedTopics: string[];
  user: any;
  topics: any;
  categories: any;
}

const BeamsTodayPage: React.FC<BeamsTodayPageProps> = async({ completedTopics, user, topics,  categories }) => {
  const cookieStore = cookies();
  const timeZone = cookieStore.get('client_time_zone')?.value || 'UTC';
  const now = new Date();
  const clientDate = now.toLocaleDateString('en-CA', { timeZone });
  const clientTime = now.toLocaleTimeString('en-US', { timeZone });
  console.log("Client date:", clientDate);
  console.log("Client time:", clientTime);
  // Fetch the data on the server
  const topic: any = await getTopicOfTheDay(clientDate);
  const allUploads = await getRecentUploads(clientDate);
  

  return (
    <>
  
     
    <div className="flex mx-auto max-w-[100vw] lg:max-w-5xl flex-col gap-2 md:gap-6 items-center justify-center w-full bg-background ">
   
      <h1 className="font-poppins text-2xl md:text-4xl uppercase font-semibold bg-yellow text-purple p-2">Beams Today</h1>
      <SearchBar completedTopics={completedTopics} topics={topics} categories={categories} />
     
       {/* <TopicOfTheDayContainer user={user} /> */}

      <TopicOfTheDay topic={topic} clientDate={clientDate} />

      <BeamsTodayRecents initialUploads={allUploads} />
  
    </div>
    </>
  );
};

export default BeamsTodayPage;
