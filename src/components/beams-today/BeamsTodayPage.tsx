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
}

const BeamsTodayPage: React.FC<BeamsTodayPageProps> = async ({ completedTopics, user }) => {
  const categories = await getAllCategories();
  return (
    <div className="flex flex-col items-center w-full gap-4">
      {/* <Header /> */}
      <TopicOfTheDayContainer user={user} />
      <BeamsTodayListContainer  categories={categories} completedTopics={completedTopics} user={user} />
    </div>
  );
};

export default BeamsTodayPage;
