'use client'
import TabsComponent from "@/components/TabsComponent";
import VideoPlayerComponent from "@/components/beams-today/VideoPlayer";
import ArticleComponent from "@/components/beams-today/Article";
import { Book1, VideoPlay, Headphone } from 'iconsax-react';

interface BeamsTodayTabsProps {
  beamsToday: any;
}

const BeamsTodayTabs: React.FC<BeamsTodayTabsProps> = ({ beamsToday }) => {
  const tabs = [
    {
      key: 'video',
      title: 'Video',
      icon: <VideoPlay size="24" color="black" />,
      content: <VideoPlayerComponent  videoUrl={beamsToday?.videoUrl} type="video" />,
    },
    {
      key: 'audio',
      title: 'Audio',
      icon: <Headphone size="24" color="black" />,
      content: <VideoPlayerComponent  videoUrl={beamsToday?.videoUrl} type="audio" />,
    },
    {
      key: 'article',
      title: 'Article',
      icon: <Book1 size="24" color="black" />,
      content: <ArticleComponent articleUrl={beamsToday?.articleUrl} />,
    },
  ];

  return (
   <div className="flex w-full items-center justify-center flex-col m-0">
    <TabsComponent tabs={tabs} />;
   </div>

  )
};

export default BeamsTodayTabs;
