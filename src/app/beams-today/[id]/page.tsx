import React from "react";
import { getBeamsTodayById } from "@/actions/beams-today/getBeamsTodayById";
import { getPoll } from "@/actions/beams-today/pollActions";
import BeamsTodayTabs from "@/components/beams-today/BeamsTodayTabs";
import BarPoll from "@/components/beams-today/BarPoll";
import BeamsTodayDetails from "@/components/beams-today/BeamsTodayDetails";
import { currentUser } from "@/libs/auth";

interface BeamsTodayPlayerPageProps {
  params: { id: string };
}


const BeamsTodayPlayerPage: React.FC<BeamsTodayPlayerPageProps> = async ({ params }) => {
  const { id } = params;
  const beamsToday: any = await getBeamsTodayById(id);
  const poll: any = await getPoll(id);

  return (
    <div className="container mx-auto my-8">
      <BeamsTodayTabs beamsToday={beamsToday} />
      <BeamsTodayDetails data={beamsToday} />
      <BarPoll poll={poll} />
    </div>
  );
};

export default BeamsTodayPlayerPage;
