'use client'
import React, { ReactNode, useEffect, useState } from 'react';
import { Tabs, Tab } from '@nextui-org/react';

interface TabConfig {
  key: string;
  title: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface TabsComponentProps {
  tabs: TabConfig[];
  onTabChange: (tabKey: string) => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({ tabs, onTabChange }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Function to check window width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 767);
    };

    // Initial check
    checkMobile();

    // Event listener to handle window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup on unmount
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTabChange = (key: React.Key) => {
    if (typeof key === 'string') {
      onTabChange(key);
    } else {
      console.error('Unexpected key type:', key);
    }
  };

  return (
    <Tabs
      size={isMobile ? "sm" : "md"}
      aria-label="Options"
      radius='full'
      color="warning"
      className='mx-auto mb-4 text-grey-2'
      classNames={{
        tabContent: "group-data-[selected=true]:text-black",
        panel: "w-full"
      }}
      onSelectionChange={handleTabChange}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          title={
            <div className="flex items-center space-x-2">
              {tab.icon}
              <span>{tab.title}</span>
            </div>
          }
        >
          {tab.content}
        </Tab>
      ))}
    </Tabs>
  );
};

export default TabsComponent;
