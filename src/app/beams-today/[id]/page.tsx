import React from "react";
import VideoDetails from "@/components/beams-today/VideoDetails";
import { getVideoById } from "@/actions/beams-today/getVideoById";
import TabsComponent from "@/components/beams-today/TabsComponent";

const VideoPlayerPage = async ({ params }:any) => {
  const { id } = params;
  const video:any = await getVideoById(id);

  return (
    <div className="container mx-auto my-8">
      <TabsComponent video={video} />
      <VideoDetails video={video} />
    </div>
  );
};

export default VideoPlayerPage;