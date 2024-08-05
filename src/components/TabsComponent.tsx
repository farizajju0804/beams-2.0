'use client'
import React, { ReactNode } from 'react';
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';

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

const isMobile = window.innerWidth < 767;

const TabsComponent: React.FC<TabsComponentProps> = ({ tabs, onTabChange }) => {
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
        tabContent: "group-data-[selected=true]:text-black"
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
            {/* <div className='w-[85vw] lg:w-[90vw] border-none'> */}
            
              {tab.content}
              
          
          {/* </div> */}
        
        </Tab>
      ))}
    </Tabs>
  );
};

export default TabsComponent;
