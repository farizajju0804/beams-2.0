import { Icon } from 'iconsax-react';
import React from 'react';

interface Activity {
    icon: Icon;
    text: string;
    points: number;
}

interface RecentActivityProps {
    activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => (
    <div className="w-full shadow-defined rounded-3xl p-4 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent</h2>
        <a href="#" className="text-sm text-blue-500">View all</a>
      </div>
      <div className='flex flex-col gap-4'>
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-center justify-between"
      
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow text-purple rounded-full flex items-center justify-center mr-4">
            <activity.icon variant='Bold'/>
            </div>
            <span>{activity.text}</span>
          </div>
          <span className="text-sm font-semibold text-green-500">+{activity.points}</span>
        </div>
      )
      
      )}
      </div>
    </div>
  );


  export default RecentActivity 