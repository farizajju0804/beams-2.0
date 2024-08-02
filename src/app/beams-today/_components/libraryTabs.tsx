'use client';
import React from 'react';
import { Tabs, Tab } from '@nextui-org/tabs';
import { Book, Star1 } from 'iconsax-react';
import NotesTab from '@/app/beams-today/_components/NotesTab';
import FavoritesTab from '@/app/beams-today/_components/FavoritesTab';

interface LibraryTabsProps {
  notes: any[];
  favorites: any[];
}

const LibraryTabs: React.FC<LibraryTabsProps> = ({ notes, favorites }) => {
  const tabs = [
    {
      key: 'notes',
      title: 'Notes',
      icon: <Book size="20" />,
      content: <NotesTab notes={notes} />,
    },
    {
      key: 'favorites',
      title: 'Favorites',
      icon: <Star1 size="20" />,
      content: <FavoritesTab favorites={favorites} />,
    },
  ];

  return (
    <Tabs aria-label="Library Tabs">
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

export default LibraryTabs;
