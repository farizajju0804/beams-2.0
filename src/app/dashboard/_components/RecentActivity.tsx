import React, { useState, useMemo } from 'react';
import { Icon } from 'iconsax-react';
import { Select, SelectItem } from "@nextui-org/react";
import { ArrowDown2 } from 'iconsax-react';

type ActivityOrHeader = 
  | { icon: Icon; text: string; points: number; createdAt: Date; source: string; isGroupHeader?: false }
  | { source: string; isGroupHeader: true };

interface RecentActivityProps {
  activities: ActivityOrHeader[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const [showAll, setShowAll] = useState(false);
  const [sortOption, setSortOption] = useState<'createdAt_asc' | 'createdAt_desc' | 'points_asc' | 'points_desc'>('createdAt_desc');
  const [groupBy, setGroupBy] = useState<'none' | 'source'>('none');

  const handleToggleShowAll = () => {
    // Reset groupBy to 'none' when collapsed
    if (showAll) {
      setGroupBy('none');
    }
    setShowAll(!showAll);
  };

  const sortedActivities = useMemo(() => {
    let sorted = [...activities] as ActivityOrHeader[];

    switch (sortOption) {
      case 'createdAt_asc':
        sorted.sort((a, b) => 
          'createdAt' in a && 'createdAt' in b 
            ? a.createdAt.getTime() - b.createdAt.getTime() 
            : 0
        );
        break;
      case 'createdAt_desc':
        sorted.sort((a, b) => 
          'createdAt' in a && 'createdAt' in b 
            ? b.createdAt.getTime() - a.createdAt.getTime() 
            : 0
        );
        break;
      case 'points_asc':
        sorted.sort((a, b) => 
          'points' in a && 'points' in b 
            ? a.points - b.points 
            : 0
        );
        break;
      case 'points_desc':
        sorted.sort((a, b) => 
          'points' in a && 'points' in b 
            ? b.points - a.points 
            : 0
        );
        break;
    }

    if (groupBy === 'source') {
      const groupedActivities = sorted.reduce((acc, activity) => {
        if ('source' in activity) {
          if (!acc[activity.source]) {
            acc[activity.source] = [];
          }
          acc[activity.source].push(activity);
        }
        return acc;
      }, {} as Record<string, ActivityOrHeader[]>);

      sorted = Object.entries(groupedActivities).flatMap(([source, activities]) => [
        { source, isGroupHeader: true },
        ...activities
      ]);
    }

    return sorted;
  }, [activities, sortOption, groupBy]);

  const displayedActivities = showAll ? sortedActivities : sortedActivities.slice(0, 3);

  return (
    <div className='px-6 mt-12 md:mt-8 md:px-0'>
       <div className="flex justify-between items-center mb-2">
        <h2 className="text-base md:text-lg font-semibold">My Recent Activity</h2>
        <button
          className="text-sm text-grey-2 flex mr-2 items-center"
          onClick={handleToggleShowAll}
        >
          {showAll ? 'Collapse' : 'View all'}
          {showAll && <ArrowDown2 size="20" className="ml-1" />}
        </button>
      </div>
    <div className="w-full px-4 py-6 shadow-defined rounded-xl ">
     

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
            label="Group by"
            size='sm'
            className="max-w-xs"
            value={groupBy} // Control the value with state
            onChange={(e) => setGroupBy(e.target.value as 'none' | 'source')}
          >
            <SelectItem key="none" value="none">No Grouping</SelectItem>
            <SelectItem key="source" value="source">Source</SelectItem>
          </Select>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {displayedActivities.map((activity, index) => (
          activity.isGroupHeader ? (
            <div key={index} className="font-bold text-lg mt-4 mb-2">
              {activity.source}
            </div>
          ) : (
            <div key={index} className="flex w-full items-center justify-between">
              <div className="flex flex-1 mr-2 items-center">
                <div className="text-text rounded-full flex items-center justify-center mr-2">
                  <activity.icon variant="Bold" />
                </div>
                <span className='text-sm w-5/6 md:text-base'>{activity.text}</span>
              </div>
              <span className="w-fit text-sm font-semibold text-brand">+{activity.points}</span>
            </div>
          )
        ))}
      </div>
    </div>
    </div>
  );
};

export default RecentActivity;
