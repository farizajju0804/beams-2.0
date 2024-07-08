import React from "react";
import VideoDetails from "@/components/beams-today/VideoDetails";
import { getVideoById } from "@/actions/beams-today/getVideoById";
import { getPoll } from "@/actions/beams-today/pollActions";
import TabsComponent from "@/components/beams-today/TabsComponent";
import BarPoll from "@/components/beams-today/BarPoll";

interface VideoPlayerPageProps {
  params: { id: string };
}

const VideoPlayerPage: React.FC<VideoPlayerPageProps> = async ({ params }) => {
  const { id } = params;
  const video: any = await getVideoById(id);
  const poll:any = await getPoll(id);
  return (
    <div className="container mx-auto my-8">
      <TabsComponent video={video} />
      <VideoDetails video={video} />
      {/* <PollComponent poll={poll} /> */}
      <BarPoll poll={poll}/>
    </div>
  );
};

export default VideoPlayerPage;
