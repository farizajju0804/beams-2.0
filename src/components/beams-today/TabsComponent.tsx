'use client'
import React from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { Book1, VideoPlay, Headphone } from 'iconsax-react';
import VideoPlayerComponent from './VideoPlayer';
import  ArticleComponent from './Article'

const TabsComponent = ({ video }:any) => {
  return (
    <Tabs aria-label="Options" color="primary" variant="bordered">
      <Tab
        key="videos"
        title={
          <div className="flex items-center space-x-2">
            <VideoPlay size="24" color="#FF8A65" />
            <span>Videos</span>
          </div>
        }
      >
        <VideoPlayerComponent videoUrl={video?.videoUrl} type="video" />
      </Tab>
      <Tab
        key="audio"
        title={
          <div className="flex items-center space-x-2">
            <Headphone size="24" color="#FF8A65" />
            <span>Audio</span>
          </div>
        }
      >
        <VideoPlayerComponent videoUrl={video?.videoUrl} type="audio" />
      </Tab>
      <Tab
        key="articles"
        title={
          <div className="flex items-center space-x-2">
            <Book1 size="24" color="#FF8A65" />
            <span>Articles</span>
          </div>
        }
      >
        <ArticleComponent articleUrl={video?.articleUrl} />
      </Tab>
    </Tabs>
  );
};

export default TabsComponent;
