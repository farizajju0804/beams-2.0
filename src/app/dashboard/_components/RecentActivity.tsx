import React, { useState, useMemo } from 'react'; // Import React and necessary hooks
import { Icon } from 'iconsax-react'; // Import Icon component from Iconsax
import { Select, SelectItem } from "@nextui-org/react"; // Import Select components from NextUI
import { ArrowDown2 } from 'iconsax-react'; // Import arrow icon for toggling view
import { PointsSource } from '@prisma/client'; // Import PointsSource type from Prisma client

// Define the structure of an Activity object
type Activity = {
  icon: Icon; // Icon to represent the activity
  text: string; // Description of the activity
  points: number; // Points associated with the activity
  createdAt: Date; // Timestamp of when the activity was created
  source: PointsSource; // Source from where the points are earned
};

// Define the props for RecentActivity component
interface RecentActivityProps {
  activities: Activity[]; // Array of activity objects
  emptyStateMessage?: string; // Optional message when there are no activities
}

// Functional component for displaying recent activities
const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  emptyStateMessage = "No activities? It's the perfect time to get going on something exciting!",
}) => {
  // State hooks for managing UI behavior
  const [showAll, setShowAll] = useState(false); // To toggle between showing all activities or a subset
  const [sortOption, setSortOption] = useState<'createdAt_asc' | 'createdAt_desc' | 'points_asc' | 'points_desc'>('createdAt_desc'); // State for sorting options
  const [filterSource, setFilterSource] = useState<string>('all'); // State for filtering activities by source

  // Handler function to toggle showing all activities
  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Memoized value to compute unique sources for filtering
  const sources = useMemo(() => {
    const uniqueSources = new Set(activities.map(activity => activity.source)); // Get unique sources from activities
    return ['all', ...Array.from(uniqueSources)]; // Include 'all' option in the sources
  }, [activities]);

  // Memoized value to sort and filter activities based on user selections
  const sortedAndFilteredActivities = useMemo(() => {
    let filtered = activities;

    // Apply source filter
    if (filterSource !== 'all') {
      filtered = filtered.filter(activity => activity.source === filterSource);
    }

    // Apply sorting based on selected option
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'createdAt_asc':
          return a.createdAt.getTime() - b.createdAt.getTime(); // Sort by creation date ascending
        case 'createdAt_desc':
          return b.createdAt.getTime() - a.createdAt.getTime(); // Sort by creation date descending
        case 'points_asc':
          return a.points - b.points; // Sort by points ascending
        case 'points_desc':
          return b.points - a.points; // Sort by points descending
        default:
          return 0; // Default case, no sorting
      }
    });
  }, [activities, sortOption, filterSource]);

  // Determine which activities to display based on showAll state
  const displayedActivities = showAll ? sortedAndFilteredActivities : sortedAndFilteredActivities.slice(0, 3);

  return (
    <>
      <div className='rounded-2xl p-3 bg-background'> {/* Container for recent activities */}
        <div className="w-full">
          {activities.length === 0 ? ( // Check if there are no activities
            <div className="text-center text-grey-2 py-8 text-lg font-medium">{emptyStateMessage}</div>
          ) : (
            <>
              {showAll && ( // Render sort and filter options when showing all activities
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
                  <Select
                    label="Sort by"
                    size='sm'
                    className="max-w-xs"
                    defaultSelectedKeys={['createdAt_desc']}
                    onChange={(e) => setSortOption(e.target.value as any)} // Update sort option on change
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
                    onChange={(e) => setFilterSource(e.target.value)} // Update filter source on change
                  >
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source === 'all' ? 'All Sources' : source}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              )}

              <div className="flex flex-col gap-6"> {/* Container for displaying activities */}
                {displayedActivities.map((activity, index) => ( // Map through displayed activities
                  <div key={index} className="flex w-full items-center justify-between">
                    <div className="flex flex-1 mr-2 items-center">
                      <div className="text-text rounded-full flex items-center justify-center mr-2">
                        <activity.icon size={18} variant="Bold" /> {/* Render activity icon */}
                      </div>
                      <span className='text-xs md:text-sm w-5/6'>{activity.text}</span> 
                    </div>
                    <span className="w-fit text-xs md:text-sm font-semibold text-brand">+{activity.points}</span> {/* Points earned */}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {activities.length > 0 && ( // Button to toggle showing all activities
        <div className="flex justify-center items-center">
          <button
            className="text-xs md:text-sm text-grey-2 flex mt-3 mx-auto items-center"
            onClick={handleToggleShowAll} // Toggle show all on click
          >
            {showAll ? 'Collapse' : 'View all'} {/* Button text changes based on state */}
            {showAll && <ArrowDown2 size="20" className="ml-1" />} {/* Show arrow icon when expanded */}
          </button>
        </div>
      )}
    </>
  );
};

export default RecentActivity; // Export the component for use in other parts of the application
