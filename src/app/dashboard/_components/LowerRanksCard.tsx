import React from 'react';
import { Avatar } from '@nextui-org/react';

const LowerRanksCards = ({ users }:any) => {
  const getBackgroundColor = (rank:any) => {
    const baseHue = 200; // Start with a light blue
    const saturation = 70;
    const lightness = 90 - (rank - 4) * 2; // Gradually decrease lightness
    return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-8">
      {users.slice(3, 10).map((user:any) => (
        <div
          key={user.id}
          className="flex items-center p-4 rounded-lg shadow-defined bg-background"
         
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
              {user.user?.firstName} {user.user?.lastName}
            </h3>
            <p className="text-sm text-[#a2a2a2]">{user.points} Beams</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LowerRanksCards;