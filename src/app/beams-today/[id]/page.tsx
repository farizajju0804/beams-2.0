// pages/BeamsTodayPlayerPage.tsx
import React from "react";
import { getBeamsTodayById } from "@/actions/beams-today/getBeamsTodayById";
import { getPoll } from "@/actions/beams-today/pollActions";
import BeamsTodayTabs from "../_components/BeamsTodayTabs";
import BeamsTodayDetails from "@/app/beams-today/_components/BeamsTodayDetails";
import RelatedSection from "../_components/RelatedSection";
import { fetchCategoryRelatedTopics } from '@/actions/beams-today/categoryActions';
import { BeamsToday } from '@/types/beamsToday';
import BarPoll from "@/app/beams-today/_components/BarPoll";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Home } from "iconsax-react";
import BottomNavigation from "../_components/BottomNavigation"; // Ensure correct import
import { getAllBeamsToday } from "@/actions/beams-today/getAllBeamsToday";

interface BeamsTodayPlayerPageProps {
  params: { id: string };
}

const BeamsTodayPlayerPage = async ({ params }: BeamsTodayPlayerPageProps) => {
  const { id } = params;
  const beamsToday: any = await getBeamsTodayById(id);
  const poll: any = await getPoll(id);

  const relatedTopics = await fetchCategoryRelatedTopics(beamsToday.category.id);
  const filteredRelatedTopics: any = relatedTopics.filter(topic => topic.id !== beamsToday.id);
  const allBeamsToday:any = await getAllBeamsToday();
  const currentIndex = allBeamsToday.findIndex((topic: BeamsToday) => topic.id === id);
  const prevUrl = currentIndex > 0 ? `/beams-today/${allBeamsToday[currentIndex - 1].id}` : null;
  const nextUrl = currentIndex < allBeamsToday.length - 1 ? `/beams-today/${allBeamsToday[currentIndex + 1].id}` : null;

  return (
    <div className="container flex w-full flex-col mx-auto px-4 mt-4 mb-8 overflow-x-hidden">
      <div className="px-4">
      <Breadcrumbs
        pageClassName="text-text"
        linkClassName="text-grey-2"
        items={[
          { href: "/", name: "Home" },
          { name: "Beams Today", href: "/beams-today" },
          { name: beamsToday.title }
        ]}
      />
      </div>
     
      <BeamsTodayTabs beamsToday={beamsToday} />
      <BeamsTodayDetails data={beamsToday} />
      <BarPoll poll={poll} />
      {filteredRelatedTopics.length > 0 && (
        <RelatedSection topics={filteredRelatedTopics} categoryName={beamsToday.category.name} />
      )}
      <BottomNavigation
        currentDate={beamsToday.date}
        prevUrl={prevUrl}
        nextUrl={nextUrl}
      />
    </div>
  );
};

export default BeamsTodayPlayerPage;
