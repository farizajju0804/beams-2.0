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
}

const TabsComponent: React.FC<TabsComponentProps> = ({ tabs }) => {
  return (
    <Tabs aria-label="Options" radius='full' color="warning" variant="bordered" className='mx-auto mb-4' >
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          className=''
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
