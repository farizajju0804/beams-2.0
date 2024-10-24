import React from "react";
import { cookies } from 'next/headers';


import { BeamsTodayRecents } from "./BeamsTodayRecents";
import { getRecentUploads } from "@/actions/beams-today/getRecentUploads";
import { getTopicOfTheDay } from "@/actions/beams-today/getTopicOfTheDay";
import TopicOfTheDay from "./TopicOfTheDay";
import TopicSearch from "./SearchBarNew";
import { getMinAndMaxDate } from "@/actions/beams-today/getMinAndMaxDate";

interface BeamsTodayPageProps {
  user: any;
  // topics: any;
  categories: any;
 
}

const BeamsTodayPage: React.FC<BeamsTodayPageProps> = async({  user,  categories }) => {
  const cookieStore = cookies();
  const timeZone = cookieStore.get('client_time_zone')?.value || 'UTC';
  const now = new Date();
  const clientDate = now.toLocaleDateString('en-CA', { timeZone });
  const clientTime = now.toLocaleTimeString('en-US', { timeZone });
  console.log("Client date:", clientDate);
  console.log("Client time:", clientTime);
  // Fetch the data on the server
  const topic: any = await getTopicOfTheDay(clientDate);
  const initialUploads = await getRecentUploads({
    clientDate: clientDate,
    page: 1,
    sortBy: "dateDesc"
  });
  
 const {minDateString,maxDateString}:any= await getMinAndMaxDate()
 console.log(minDateString,maxDateString)
 
  return (
    <>
  
     
    <div className="flex mx-auto max-w-[100vw] lg:max-w-5xl flex-col gap-2 md:gap-6 items-center justify-center w-full bg-background ">
   
      <h1 className="font-poppins text-2xl md:text-4xl uppercase font-semibold bg-yellow text-purple p-2">Beams Today</h1>
     
      <TopicOfTheDay topic={topic} clientDate={clientDate} />
  
      <TopicSearch userId={user.id} categories={categories}  minDateString={minDateString} maxDateString={maxDateString}/>
      {/* <SearchBar completedTopics={completedTopics} topics={topics} categories={categories} /> */}
      <BeamsTodayRecents clientDate={clientDate} initialUploads={initialUploads} />
  
    </div>
    </>
  );
};

export default BeamsTodayPage;
