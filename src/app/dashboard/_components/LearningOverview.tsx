'use client'
// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import Link from 'next/link';
// import StatCard from './StatCard';
// import FormattedDate from '@/app/beams-today/_components/FormattedDate';
// import { Button } from '@nextui-org/react';
// import Heading from './Heading';

interface UserAnalytics {
  totalWatchTimeBeamsToday: number;
  totalVideoWatchTime: number;
  totalAudioListenTime: number;
  totalTextSpentTime: number;
  individualWatchTimesVideo: { [key: string]: number };
  individualWatchTimesAudio: { [key: string]: number };
  individualWatchTimesText: { [key: string]: number };
}

interface WatchedData {
  id: string;
  title: string;
  shortDesc: string;
  date: Date;
}

interface PollOption {
  optionText: string;
  userResponse: { createdAt: string }[];
}

interface PollData {
  id: string;
  title: string;
  description: string;
  question: string;
  options: PollOption[];
}

// interface LearningOverviewProps {
//   userAnalytics: UserAnalytics | null;  // Allow userAnalytics to be null for new users
//   watchedData: WatchedData[];           // No changes needed here
//   pollData: PollData[] | null;          // Allow pollData to be null for new users
// }



// const LearningOverview: React.FC<LearningOverviewProps> = ({ userAnalytics, watchedData, pollData }) => {
//   const formatTime = (seconds: number): string => {
//     if (seconds < 60) return `${seconds} Sec`;
//     if (seconds < 3600) return `${Math.round(seconds / 60)} Min`;
//     return `${(seconds / 3600).toFixed(1)} Hrs`;
//   };

//   // Fallbacks for undefined userAnalytics and pollData
//   const timeSpent = userAnalytics ? formatTime(userAnalytics.totalWatchTimeBeamsToday) : '0 Sec';

//   const timeData = [
//     { name: 'Video', time: userAnalytics?.totalVideoWatchTime || 0 },
//     { name: 'Audio', time: userAnalytics?.totalAudioListenTime || 0 },
//     { name: 'Text', time: userAnalytics?.totalTextSpentTime || 0 },
//   ];

//   const topicTimeData = Object.entries({
//     ...userAnalytics?.individualWatchTimesVideo,
//     ...userAnalytics?.individualWatchTimesAudio,
//     ...userAnalytics?.individualWatchTimesText
//   }).map(([id, time]) => ({
//     name: watchedData.find(topic => topic.id === id)?.title || 'Unknown',
//     value: time
//   }));

//   return (
//     <div className='p-2 flex w-full flex-col items-start'>
//       {/* <Heading heading='My learning' /> */}
//       <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full md:mt-2">
//         <StatCard
//           title="Topics Mastered"
//           value={watchedData.length.toString()}
//           imageSrc="https://res.cloudinary.com/drlyyxqh9/image/upload/v1726307416/dashboard/topics-3d_uc7s2b.webp"
//           modalContent={<TopicsPopoverContent topics={watchedData} />}
//           viewLabel="View all topics"
//           showViewLabel={watchedData.length > 0}
//         />
//         <StatCard
//           title="Time Invested"
//           value={timeSpent}
//           imageSrc="https://res.cloudinary.com/drlyyxqh9/image/upload/v1726307416/dashboard/time-3d_lod3b9.webp"
//           modalContent={<TimeBreakdownPopoverContent timeData={timeData} topicTimeData={topicTimeData} />}
//           viewLabel="View time breakdown"
//           showViewLabel={!!userAnalytics}  // Ensures showViewLabel is a boolean
//         />
//         <StatCard
//           title="Polls Engaged"
//           value={pollData?.length.toString() || '0'}
//           imageSrc="https://res.cloudinary.com/drlyyxqh9/image/upload/v1726307416/dashboard/poll-3d_bs4dsl.webp"
//           modalContent={<PollsPopoverContent polls={pollData || []} />}
//           viewLabel="View all polls"
//           showViewLabel={!!pollData && pollData.length > 0}
//         />
//       </div>
//     </div>
//   );
// }

// export default LearningOverview;


import React from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/react";
import FormattedDate from '@/app/beams-today/_components/FormattedDate';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

interface StatItemProps {
  value: string | number;
  title: string;
  viewLabel: string;
  modalContent: React.ReactNode;
  showViewLabel: boolean;
}

const TopicsPopoverContent: React.FC<{ topics: WatchedData[] }> = ({ topics }) => (
  <div className="flex flex-col gap-6 my-4">
    {topics.map((topic) => (
      <div key={topic.id} className="flex flex-col w-full justify-between items-start bg-grey-1 p-4 rounded-lg">
        <div className='flex flex-col'>
          <h4 className="font-semibold text-text">{topic.title}</h4>
    
        </div>
        <div className='w-full items-center flex justify-between'>
        <p className="text-xs text-grey-2 mt-2"><FormattedDate date={topic.date.toISOString().split('T')[0]} /></p>
        <Link href={`/beams-today/${topic.id}`} className="mt-4">
          <Button 
            size="sm" 
            className="text-xs md:text-sm bg-brand text-white font-semibold transition-all duration-300"
          >
            Beam Again
          </Button>
        </Link>
        </div>
      </div>
    ))}
  </div>
);

const TimeBreakdownPopoverContent: React.FC<{ timeData: any[];}> = ({ timeData }) => {
  const formatYAxis = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  return (
    <div className='h-[264px]'>
      <div className="h-64 w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeData} margin={{ top: 10, right: 20, left: 20, bottom: 30 }}>
            <XAxis dataKey="name" label={{ value: 'Format', position: 'insideBottom', offset: -10, dy:20 }} />
            <YAxis tickFormatter={formatYAxis} label={{ value: 'Time Spent', angle: -90, position: 'insideLeft', offset: -10, dy: 50 }} />
            <Tooltip formatter={(value: number) => [formatYAxis(value), 'Time Spent']} cursor={false} />
            <Bar dataKey="time" fill="#f96f2e" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PollsPopoverContent: React.FC<{ polls: PollData[] }> = ({ polls }) => (
  <div>
    {polls.length === 0 ? (
      <p>No polls available.</p>
    ) : (
      polls.map((poll) => (
        <div key={poll.id} className="p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">{poll.question}</h3>
          <ul className="list-disc pl-5">
            {poll.options.map((option, index) => (
              <li key={index} className="mb-1">
                {option.optionText}
                {option.userResponse.length > 0 && (
                  <span className="text-green-600 ml-2">✓</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))
    )}
  </div>
);
const StatItem: React.FC<StatItemProps> = ({ value, title, viewLabel, modalContent, showViewLabel }) => {
  const {isOpen, onOpen, onClose} = useDisclosure();

  return (
    <>
      <div className="flex flex-col items-center px-4">
        <p className="text-4xl font-bold text-brand">{value}</p>
        <p className="text-sm text-text font-medium mt-1">{title}</p>
        {showViewLabel && (
          <Button
            size="sm"
            className="mt-2 text-xs text-grey-2 bg-transparent underline p-0"
            onClick={onOpen}
          >
            {viewLabel}
          </Button>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size="3xl"
      >
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>{modalContent}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

interface LearningOverviewProps {
  userAnalytics: UserAnalytics | null;
  watchedData: WatchedData[];
  pollData: PollData[] | null;
}

const LearningOverview: React.FC<LearningOverviewProps> = ({ userAnalytics, watchedData, pollData }) => {
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds} Sec`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} Min`;
    return `${(seconds / 3600).toFixed(1)} Hrs`;
  };

  const timeSpent = userAnalytics ? formatTime(userAnalytics.totalWatchTimeBeamsToday) : '0 Sec';

  const timeData = [
    { name: 'Video', time: userAnalytics?.totalVideoWatchTime || 0 },
    { name: 'Audio', time: userAnalytics?.totalAudioListenTime || 0 },
    { name: 'Text', time: userAnalytics?.totalTextSpentTime || 0 },
  ];

  // const TopicsPopoverContent: React.FC<{ topics: WatchedData[] }> = ({ topics }) => (
  //   <div className="flex flex-col gap-6 my-4">
  //     {topics.map((topic) => (
  //       <div key={topic.id} className="flex flex-col w-full justify-between items-start bg-grey-1 p-4 rounded-lg">
  //         <h4 className="font-semibold text-text">{topic.title}</h4>
  //         <p className="text-xs text-grey-2 mt-2">
  //           <FormattedDate date={topic.date.toISOString().split('T')[0]} />
  //         </p>
  //       </div>
  //     ))}
  //   </div>
  // );

  // const TimeBreakdownPopoverContent: React.FC<{ timeData: any[] }> = ({ timeData }) => {
  //   const formatYAxis = (seconds: number) => {
  //     if (seconds < 60) return `${seconds}s`;
  //     if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  //     return `${(seconds / 3600).toFixed(1)}h`;
  //   };

  //   return (
  //     <div className='h-[264px]'>
  //       <ResponsiveContainer width="100%" height="100%">
  //         <BarChart data={timeData} margin={{ top: 10, right: 20, left: 20, bottom: 30 }}>
  //           <XAxis dataKey="name" />
  //           <YAxis tickFormatter={formatYAxis} />
  //           <Tooltip formatter={(value: number) => [formatYAxis(value), 'Time Spent']} />
  //           <Bar dataKey="time" fill="#f96f2e" />
  //         </BarChart>
  //       </ResponsiveContainer>
  //     </div>
  //   );
  // };

  // const PollsPopoverContent: React.FC<{ polls: PollData[] }> = ({ polls }) => (
  //   <div>
  //     {polls.length === 0 ? (
  //       <p>No polls available.</p>
  //     ) : (
  //       polls.map((poll) => (
  //         <div key={poll.id} className="p-4 mb-6">
  //           <h3 className="text-lg font-semibold mb-2">{poll.question}</h3>
  //           <ul className="list-disc pl-5">
  //             {poll.options.map((option, index) => (
  //               <li key={index} className="mb-1">
  //                 {option.optionText}
  //                 {option.userResponse.length > 0 && (
  //                   <span className="text-green-600 ml-2">✓</span>
  //                 )}
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //       ))
  //     )}
  //   </div>
  // );

  const stats = [
    {
      value: watchedData.length,
      title: "Topics Mastered",
      viewLabel: "View all topics",
      modalContent: <TopicsPopoverContent topics={watchedData} />,
      showViewLabel: watchedData.length > 0
    },
    {
      value: timeSpent,
      title: "Time Invested",
      viewLabel: "View time breakdown",
      modalContent: <TimeBreakdownPopoverContent timeData={timeData} />,
      showViewLabel: !!userAnalytics
    },
    {
      value: pollData?.length || 0,
      title: "Polls Engaged",
      viewLabel: "View all polls",
      modalContent: <PollsPopoverContent polls={pollData || []} />,
      showViewLabel: !!pollData && pollData.length > 0
    }
  ];

  return (
    <div className="bg-background rounded-2xl p-4 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <div className={`flex items-center justify-center ${index !== stats.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''} border-grey-1 py-4 md:py-0`}>
              <StatItem {...stat} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LearningOverview;