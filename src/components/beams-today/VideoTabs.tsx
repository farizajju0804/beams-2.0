import React from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import Plyr from 'plyr-react';
import 'plyr/dist/plyr.css';
import { Book1, VideoPlay, Headphone } from 'iconsax-react';
import Article from '@/components/beams-today/Article';

const VideoTabs = ({ video} : any ) => {
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
        <div className="relative w-full">
          <Plyr
            source={{
              type: 'video',
              sources: [
                {
                  src: video?.videoUrl,
                  type: 'video/mp4',
                  size: 720,
                },
                {
                  src: video?.videoUrl,
                  type: 'video/mp4',
                  size: 1080,
                },
              ],
            }}
            options={{
              controls: [
                'play',
                'progress',
                'current-time',
                'mute',
                'volume',
                'captions',
                'settings',
                'pip',
                'airplay',
                'fullscreen',
              ],
              settings: ['captions', 'quality', 'speed'],
              quality: { default: 720, options: [1080, 720, 480, 360] },
              speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
              autoplay: true,
            }}
          />
        </div>
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
        <div className="relative w-full">
          <Plyr
            source={{
              type: 'audio',
              sources: [
                {
                  src: video?.videoUrl,
                  type: 'audio/mp3',
                },
              ],
            }}
            options={{
              controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings'],
              settings: ['speed'],
              speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
              autoplay: false,
            }}
          />
        </div>
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
        <Article articleUrl={video?.articleUrl} />
      </Tab>
    </Tabs>
  );
};

export default VideoTabs;
