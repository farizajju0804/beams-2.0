import React from 'react';
import { Avatar } from '@nextui-org/react';

interface LowerRanksCardsProps {
  users: any[];
  userPosition: number | undefined; // This is the additional prop you're passing
}

const LowerRanksCards: React.FC<LowerRanksCardsProps> = ({ users, userPosition }) => {

  const getBackgroundColor = (rank: number) => {
    // Check if the current rank is the user's position
    if (rank === userPosition) {
      return 'bg-yellow'; // Yellow background for user's position
    }
    return 'bg-background'; // Default background
  };
  const getTextColor = (rank: number) => {
    // Check if the current rank is the user's position
    if (rank === userPosition) {
      return 'text-gray-700'; // Yellow background for user's position
    }
    return 'text-[#a2a2a2]'; // Default background
  };
  const getDisplayName = (user: any) => {
    // If the current user is the logged-in user, display "You"
    if (user.rank === userPosition) {
      return 'You';
    }
    return `${user.user?.firstName} ${user.user?.lastName}`;
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-8">
      {users.slice(3, 10).map((user: any) => (
        <div
          key={user.id}
          className={`flex items-center p-4 rounded-lg shadow-defined ${getBackgroundColor(user.rank)}`} // Apply dynamic background color
        >
          <div className="flex items-center justify-center gap-4 ">
            <div className="w-8 h-8 bg-text rounded-full text-sm flex items-center justify-center text-background font-bold">
              {user.rank}
            </div>
            <Avatar
              src={user.user?.image || undefined}
              showFallback
              alt="profile"
              className="w-12 h-12 mr-4"
            />
          </div>

          <div className="flex w-full flex-col md:flex-row justify-between items-start md:items-center ">
            <h3 className="font-medium text-text font-poppins">
              {getDisplayName(user)} {/* Use "You" if this is the user's position */}
            </h3>
            <p className={`text-sm ${getTextColor(user.rank)}`}>{user.points} Beams</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LowerRanksCards;
