import React from "react";
import { getBeamsTodayById } from "@/actions/beams-today/getBeamsTodayById";
import { getPoll } from "@/actions/beams-today/pollActions";
import { markTopicAsCompleted } from "@/actions/beams-today/completedActions";
import BeamsTodayTabs from "@/components/beams-today/BeamsTodayTabs";
import BeamsTodayDetails from "@/components/beams-today/BeamsTodayDetails";
import RelatedSection from "@/components/beams-today/RelatedSection";
import { fetchCategoryRelatedTopics } from '@/actions/beams-today/categoryActions';
import { BeamsToday } from '@/types/beamsToday';
import BarPoll from "@/components/beams-today/BarPoll";

interface BeamsTodayPlayerPageProps {
  params: { id: string };
}

const BeamsTodayPlayerPage: React.FC<BeamsTodayPlayerPageProps> = async ({ params }) => {
  const { id } = params;
  const beamsToday: any = await getBeamsTodayById(id);
  const poll: any = await getPoll(id);

  await markTopicAsCompleted(id);
  
  // Fetch related topics
  const relatedTopics = await fetchCategoryRelatedTopics(beamsToday.category.id);
  const filteredRelatedTopics:any = relatedTopics.filter(topic => topic.id !== beamsToday.id);

  return (
    <div className="container mx-auto px-4 mt-4 mb-8">
      <BeamsTodayTabs beamsToday={beamsToday} />
      <BeamsTodayDetails data={beamsToday} />
      <BarPoll poll={poll} />
      <RelatedSection topics={filteredRelatedTopics} categoryName={beamsToday.category.name} />
    </div>
  );
};

export default BeamsTodayPlayerPage;
