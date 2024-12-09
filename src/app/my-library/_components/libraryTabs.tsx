'use client';
import React from 'react';
import { Tabs, Tab } from '@nextui-org/react'; // Importing Tabs and Tab components from NextUI
import { Book, Star1 } from 'iconsax-react'; // Icons for the tabs
import NotesTab from '@/app/my-library/_components/NotesTab'; // Component to render Notes
import FavoritesTab from '@/app/my-library/_components/FavoritesTab'; // Component to render Favorites

interface LibraryTabsProps {
  notes: any[]; // Array of user notes
  favorites: any[]; // Array of user favorite topics
}

/**
 * LibraryTabs component renders a tabbed interface with two tabs: Notes and Favorites.
 * Each tab shows the respective content when selected.
 */
const LibraryTabs: React.FC<LibraryTabsProps> = ({ notes, favorites }) => {

  // Define the structure of each tab with its title, icon, and content
  const tabs = [
    {
      key: 'notes',
      title: 'Notes',
      icon: <Book size="20" />, // Icon for Notes tab
      content: <NotesTab notes={notes} />, // Renders NotesTab component
    },
    {
      key: 'favorites',
      title: 'Favorites',
      icon: <Star1 size="20" />, // Icon for Favorites tab
      content: <FavoritesTab favorites={favorites} />, // Renders FavoritesTab component
    },
  ];

  return (
    <Tabs color='warning' 
    className='mx-auto mb-4 text-grey-2'
    classNames={{
      tabContent: "group-data-[selected=true]:text-black group-data-[selected=true]:font-medium",
      panel: "w-full"
    }}
    aria-label="Library Tabs"> {/* Main Tabs component */}
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          
          title={
            <div className="flex items-center space-x-2">
              {tab.icon} {/* Display the tab icon */}
              <span>{tab.title}</span> {/* Display the tab title */}
            </div>
          }
        >
          {tab.content} {/* Display the tab content */}
        </Tab>
      ))}
    </Tabs>
  );
};

export default LibraryTabs;
