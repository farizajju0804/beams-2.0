'use client'
import React, { ReactNode } from 'react';
import { Tabs, Tab } from '@nextui-org/react';

interface TabConfig {
  key: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
}

interface TabsComponentProps {
  tabs: TabConfig[];
  onTabChange: (tabKey: string) => void;
}

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
      aria-label="Options"
      radius='full'
      color="warning"
      className='mx-auto mb-4'
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
