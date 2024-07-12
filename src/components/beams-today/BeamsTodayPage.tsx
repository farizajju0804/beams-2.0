// components/beams-today/BeamsTodayPage.tsx

import React from "react";
import Header from "@/components/beams-today/Header";
import TopicOfTheDayContainer from "@/components/beams-today/TopicsOfThedayContainer";
import BeamsTodayListContainer from "@/components/beams-today/BeamsTodayListContainer";
import { BeamsToday } from "@/types/beamsToday";
import { getAllCategories } from "@/actions/beams-today/categoryActions";

interface BeamsTodayPageProps {
  completedTopics: string[];
  user: any;
  greeting : string;
}

const BeamsTodayPage: React.FC<BeamsTodayPageProps> = async ({ completedTopics, user,greeting }) => {
  const categories = await getAllCategories();
  return (
    <div className="flex flex-col items-center w-full gap-4">
      {/* <Header /> */}
      <div className="w-full pl-6 md:pl-12 mt-4">
        <h1 className="text-base text-left">{greeting}</h1>
      </div>
      <TopicOfTheDayContainer user={user} />
      <BeamsTodayListContainer  categories={categories} completedTopics={completedTopics} user={user} />
    </div>
  );
};

export default BeamsTodayPage;
