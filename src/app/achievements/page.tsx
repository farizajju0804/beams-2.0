// // /app/achievements/page.tsx

// import React from 'react';
// import { currentUser } from '@/libs/auth';

// import AchievementsModal from './_components/AchievementsModal';
// import AchievementCard from './_components/AchievementCard';
// import { Achievement, UserAchievement } from '@prisma/client';
// import { getAllAchievements, getUserAchievements } from '@/actions/points/achievements';
// import { getUserBeams } from '@/actions/points/getAllLevels';

// const AchievementsPage = async () => {
//   const user: any = await currentUser();
//   const allAchievements:Achievement[] = await getAllAchievements();
//   const userAchievements:UserAchievement[] = await getUserAchievements(user.id);
//   const beams = await getUserBeams(user?.id);
  
//   return (
//     <div className='flex flex-col w-full'>
//       <AchievementsModal />
//       <div className='w-full pb-6 grid gap-12 lg:grid-cols-3 md:grid-cols-2 grid-cols-1'>
//         {allAchievements.map((achievement) => {
//           const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
//           const progress = userAchievement?.progress || 0;
//           const completed = userAchievement?.completionStatus || false
//           return (
//             <AchievementCard
//               key={achievement.id}
//               isCompleted={completed}
//               badgeName={achievement.name}
//               badgeImageUrl={achievement.badgeImageUrl}
//               completedCount={progress}
//               totalCount={achievement.totalCount}
//               color={achievement.color}
//               beamsToGain={achievement.beamsToGain}
//               actionText={achievement.actionText}
//               taskDefinition={achievement.task}
//               userFirstName={user.firstName}
//               actionUrl={achievement.actionUrl || "/achievements"}
//               personalizedMessage={achievement.personalizedMessage}
//               currentBeams={beams.beams} 
//             />
//           );
//         })}

// <AchievementCard
//   badgeName="Week Warrior"
//   isCompleted={false}
//   badgeImageUrl="https://res.cloudinary.com/drlyyxqh9/image/upload/v1727358628/achievements/badges/week-warrior_on888b.webp"
//   completedCount={4}
//   totalCount={5}
//   color="#435cff"
//   beamsToGain={100}
//   actionText="logged in"
//   taskDefinition="Login every day for a consecutive week."
//   userFirstName={user?.firstName}
//   actionUrl="/path/to/action"
//   personalizedMessage="The Week Warrior!"
//   currentBeams={500}
// />
// <AchievementCard
//   isCompleted={true}
//   badgeName="Week Warrior"
//   badgeImageUrl="https://res.cloudinary.com/drlyyxqh9/image/upload/v1727358628/achievements/badges/week-warrior_on888b.webp"
//   completedCount={5}
//   totalCount={5}
//   color="#435cff"
//   beamsToGain={100}
//   actionText="logged in"
//   taskDefinition="Login every day for a consecutive week."
//   userFirstName={user?.firstName}
//   actionUrl="/path/to/action"
//   personalizedMessage="The Week Warrior!"
//   currentBeams={500}
// />
//       </div>
//     </div>
//   );
// };

// export default AchievementsPage;


import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page