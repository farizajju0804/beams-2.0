import React from "react";
import { getBeamsTodayById } from "@/actions/beams-today/getBeamsTodayById";
import { getPoll } from "@/actions/beams-today/pollActions";
import { markTopicAsCompleted } from "@/actions/beams-today/completedActions";
import BeamsTodayTabs from "@/components/beams-today/BeamsTodayTabs";
import { updateViewCount } from "@/actions/beams-today/analytics/updateViewCount";
// import BarPoll from "@/components/beams-today/BarPoll";
import BeamsTodayDetails from "@/components/beams-today/BeamsTodayDetails";
import { currentUser } from "@/libs/auth";

interface BeamsTodayPlayerPageProps {
  params: { id: string };
}

const BeamsTodayPlayerPage: React.FC<BeamsTodayPlayerPageProps> = async ({ params }) => {
  const { id } = params;
  const beamsToday: any = await getBeamsTodayById(id);
  // const poll: any = await getPoll(id);
  const user:any = await currentUser(); 

  if (user) {
    await markTopicAsCompleted(user.id, id);
  }
  await updateViewCount(id);
  return (
    <div className="container mx-auto my-8">
      <BeamsTodayTabs beamsToday={beamsToday} />
      <BeamsTodayDetails data={beamsToday} />
      {/* <BarPoll poll={poll} /> */}
    </div>
  );
};

export default BeamsTodayPlayerPage;
