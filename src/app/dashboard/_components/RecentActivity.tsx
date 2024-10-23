import React, { useState, useMemo } from 'react';
import { Icon } from 'iconsax-react';
import { Select, SelectItem } from "@nextui-org/react";
import { ArrowDown2 } from 'iconsax-react';
import { PointsSource } from '@prisma/client';

type Activity = {
  icon: Icon;
  text: string;
  points: number;
  createdAt: Date;
  source: PointsSource;
};

interface RecentActivityProps {
  activities: Activity[];
  emptyStateMessage?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, emptyStateMessage = "No activities? It's the perfect time to get going on something exciting!" }) => {
  const [showAll, setShowAll] = useState(false);
  const [sortOption, setSortOption] = useState<'createdAt_asc' | 'createdAt_desc' | 'points_asc' | 'points_desc'>('createdAt_desc');
  const [filterSource, setFilterSource] = useState<string>('all');

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  const sources = useMemo(() => {
    const uniqueSources = new Set(activities.map(activity => activity.source));
    return ['all', ...Array.from(uniqueSources)];
  }, [activities]);

  const sortedAndFilteredActivities = useMemo(() => {
    let filtered = activities;
    
    // Apply source filter
    if (filterSource !== 'all') {
      filtered = filtered.filter(activity => activity.source === filterSource);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'createdAt_asc':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'createdAt_desc':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'points_asc':
          return a.points - b.points;
        case 'points_desc':
          return b.points - a.points;
        default:
          return 0;
      }
    });
  }, [activities, sortOption, filterSource]);

  const displayedActivities = showAll ? sortedAndFilteredActivities : sortedAndFilteredActivities.slice(0, 3);

  return (
    <>
      <div className='rounded-2xl p-3 bg-background'>
        <div className="w-full">
          {activities.length === 0 ? (
            <div className="text-center text-grey-2 py-8 text-lg font-medium">{emptyStateMessage}</div>
          ) : (
            <>
              {showAll && (
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
                  <Select
                    label="Sort by"
                    size='sm'
                    className="max-w-xs"
                    defaultSelectedKeys={['createdAt_desc']}
                    onChange={(e) => setSortOption(e.target.value as any)}
                  >
                    <SelectItem key="createdAt_asc" value="createdAt_asc">Date (Oldest first)</SelectItem>
                    <SelectItem key="createdAt_desc" value="createdAt_desc">Date (Newest first)</SelectItem>
                    <SelectItem key="points_asc" value="points_asc">Points (Low to High)</SelectItem>
                    <SelectItem key="points_desc" value="points_desc">Points (High to Low)</SelectItem>
                  </Select>

                  <Select
                    label="Filter by source"
                    size='sm'
                    className="max-w-xs"
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                  >
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source === 'all' ? 'All Sources' : source}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              )}

              <div className="flex flex-col gap-6">
                {displayedActivities.map((activity, index) => (
                  <div key={index} className="flex w-full items-center justify-between">
                    <div className="flex flex-1 mr-2 items-center">
                      <div className="text-text rounded-full flex items-center justify-center mr-2">
                        <activity.icon size={18} variant="Bold" />
                      </div>
                      <span className='text-xs md:text-sm w-5/6 '>{activity.text}</span>
                    </div>
                    <span className="w-fit text-xs md:text-sm font-semibold text-brand">+{activity.points}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {activities.length > 0 && (
        <div className="flex justify-center items-center">
          <button
            className="text-xs md:text-sm text-grey-2 flex mt-3 mx-auto items-center"
            onClick={handleToggleShowAll}
          >
            {showAll ? 'Collapse' : 'View all'}
            {showAll && <ArrowDown2 size="20" className="ml-1" />}
          </button>
        </div>
      )}
    </>
  );
};

export default RecentActivity;