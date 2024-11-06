// ClientTabs.tsx
'use client';

import React, { useState, useEffect } from 'react';
import TabsComponent from "@/components/TabsComponent";
import { Book1, VideoPlay, Headphone } from 'iconsax-react';
import { incrementViewCount } from "@/actions/beams-today/completedActions";
import { updateWatchTime } from '@/actions/beams-today/analytics/updateWatchTime';

interface ClientTabsProps {
  beamsTodayId: string;
  contentSections: {
    video: React.ReactNode;
    audio: React.ReactNode;
    text: React.ReactNode;
  };
}

export default function ClientTabs({ beamsTodayId, contentSections }: ClientTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('video');
  const [startTime, setStartTime] = useState<number>(Date.now());

  const handleTabChange = async (tabKey: string) => {
    // Calculate elapsed time for current tab before switching
    const elapsedTime = (Date.now() - startTime) / 1000;
    
    try {
      // Update watch time for the previous tab
      if (elapsedTime > 0) {
        await updateWatchTime(beamsTodayId, elapsedTime, activeTab as 'video' | 'audio' | 'text');
      }

      // Mark the new tab as viewed
      await incrementViewCount(beamsTodayId, tabKey as 'video' | 'audio' | 'text');
      
      // Reset timer and update active tab
      setStartTime(Date.now());
      setActiveTab(tabKey);
    } catch (error) {
      console.error('Error handling tab change:', error);
    }
  };

  useEffect(() => {
    const handleUnload = async () => {
      const elapsedTime = (Date.now() - startTime) / 1000;
      if (elapsedTime > 0) {
        try {
          await updateWatchTime(beamsTodayId, elapsedTime, activeTab as 'video' | 'audio' | 'text');
        } catch (error) {
          console.error('Error updating watch time:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [activeTab, startTime, beamsTodayId]);

  const tabs = [
    {
      key: 'video',
      title: 'Video',
      icon: <VideoPlay size="24" />,
      content: contentSections.video
    },
    {
      key: 'audio',
      title: 'Audio',
      icon: <Headphone size="24" />,
      content: contentSections.audio
    },
    {
      key: 'text',
      title: 'Text',
      icon: <Book1 size="24" />,
      content: contentSections.text
    }
  ];

  return (
    <TabsComponent 
      tabs={tabs} 
      onTabChange={handleTabChange}
    //   selectedKey={activeTab}
    />
  );
}