// components/beams-today/BeamsTodayPage.tsx

import React from "react";
import Header from "@/components/beams-today/Header";
import TopicOfTheDayContainer from "@/components/beams-today/TopicsOfThedayContainer";
import BeamsTodayListContainer from "@/components/beams-today/BeamsTodayListContainer";
import { getAllCategories } from "@/actions/beams-today/categoryActions";
import { Cormorant_Garamond } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({ subsets: ["latin"], weight: ["700"], style: ["italic"] });

interface BeamsTodayPageProps {
  completedTopics: string[];
  user: any;
  greeting: string;
}

const BeamsTodayPage: React.FC<BeamsTodayPageProps> = async ({ completedTopics, user, greeting }) => {
  const categories = await getAllCategories();
  return (
    <div className="flex flex-col items-center w-full gap-4">
      {/* <Header /> */}
      <div className="w-full pl-6 md:pl-12 mt-4">
        <h1 className={`text-base md:text-xl text-left pr-2 italic font-bold ${cormorantGaramond.className}`}>{greeting}</h1>
      </div>
      <TopicOfTheDayContainer user={user} />
      <BeamsTodayListContainer categories={categories} completedTopics={completedTopics} user={user} />
    </div>
  );
};

export default BeamsTodayPage;
