import React from "react";
import { getBeamsTodayById } from "@/actions/beams-today/getBeamsTodayById";
import { getPoll } from "@/actions/beams-today/pollActions";
import { markTopicAsCompleted } from "@/actions/beams-today/completedActions";
import BeamsTodayTabs from "@/components/beams-today/BeamsTodayTabs";
// import BarPoll from "@/components/beams-today/BarPoll";
import BeamsTodayDetails from "@/components/beams-today/BeamsTodayDetails";


interface BeamsTodayPlayerPageProps {
  params: { id: string };
}

const BeamsTodayPlayerPage: React.FC<BeamsTodayPlayerPageProps> = async ({ params }) => {
  const { id } = params;
  const beamsToday: any = await getBeamsTodayById(id);
  // const poll: any = await getPoll(id);

 
  await markTopicAsCompleted(id);
  
  return (
    <div className="container mx-auto px-4 my-8">
      <BeamsTodayTabs beamsToday={beamsToday} />
      <BeamsTodayDetails data={beamsToday} />
      {/* <BarPoll poll={poll} /> */}
    </div>
  );
};

export default BeamsTodayPlayerPage;
