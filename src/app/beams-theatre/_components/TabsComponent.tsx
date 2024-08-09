'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import ProgressTab from './ProgressTab';

interface TabConfig {
  key: string;
  title: string;
  content: ReactNode;
}

interface TabsComponentProps {
  tabs: TabConfig[];
  onTabChange: (tabKey: string) => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({ tabs, onTabChange }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('progress');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSelectedTab('progress');
    }
  }, [isMobile]);

  const handleTabChange = (key: React.Key) => {
    if (typeof key === 'string') {
      setSelectedTab(key);
      onTabChange(key);
    } else {
      console.error('Unexpected key type:', key);
    }
  };

  return (
    <Tabs
      size={isMobile ? 'sm' : 'md'}
      aria-label="Options"
      radius="full"
      color="warning"
      className="mb-4 text-grey-2"
      classNames={{
        tabContent: 'group-data-[selected=true]:text-black',
      }}
      selectedKey={selectedTab}
      onSelectionChange={handleTabChange}
    >
      {isMobile && (
        <Tab
          key="progress"
          title={
            <div className="flex items-center space-x-2">
              <span>Progress</span>
            </div>
          }
        >
          <div className="w-full lg:w-4/5 border-none mx-auto">
            <ProgressTab />
          </div>
        </Tab>
      )}
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          title={
            <div className="flex items-center space-x-2">
              <span>{tab.title}</span>
            </div>
          }
        >
          <div className="w-full lg:w-4/5 border-none mx-auto">
            {tab.content}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
};

export default TabsComponent;
