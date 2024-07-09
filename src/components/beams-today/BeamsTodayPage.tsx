// components/beams-today/BeamsTodayPage.tsx

import React from "react";
import Header from "@/components/beams-today/Header";
import TopicOfTheDayContainer from "@/components/beams-today/TopicsOfThedayContainer";
import BeamsTodayListContainer from "@/components/beams-today/BeamsTodayListContainer";
import { BeamsToday } from "@/types/beamsToday";

interface BeamsTodayPageProps {
  completedTopics: string[];
  user: any;
}

const BeamsTodayPage: React.FC<BeamsTodayPageProps> = ({ completedTopics, user }) => {
  return (
    <div className="flex flex-col items-center w-full p-8 gap-8">
      <Header />
      <TopicOfTheDayContainer user={user} />
      <BeamsTodayListContainer completedTopics={completedTopics} user={user} />
    </div>
  );
};

export default BeamsTodayPage;
