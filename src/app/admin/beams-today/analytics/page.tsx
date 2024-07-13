'use client';

import React, { useEffect, useState } from 'react';
import { getBeamsTodayAnalytics, getUserAnalytics } from '@/actions/beams-today/admin/analyticsActions';
import { BeamsToday } from '@/types/beamsToday';
import { Card, CardHeader, CardBody, CardFooter, Image, Divider, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';

const AdminAnalyticsPage = () => {
  const [topics, setTopics] = useState<any>([]);
  const [userAnalytics, setUserAnalytics] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const beamsTodayData: any = await getBeamsTodayAnalytics();
      const userAnalyticsData = await getUserAnalytics();
      setTopics(beamsTodayData);
      setUserAnalytics(userAnalyticsData);
    };
    fetchAnalyticsData();
  }, []);

  const getTopicTitle = (id: string) => {
    const topic = topics.find((topic:any) => topic.id === id);
    return topic ? topic.title : 'Unknown Topic';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Beams Today Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {topics.map((topic: BeamsToday) => (
          <Card key={topic.id} className="w-full">
            <CardHeader className="flex gap-3">
              <Image
                alt="thumbnail"
                height={40}
                radius="sm"
                src={topic.thumbnailUrl || 'https://via.placeholder.com/40'}
                width={40}
              />
              <div className="flex flex-col">
                <p className="text-md">{topic.title}</p>
                <p className="text-small text-default-500">{topic.category.name}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p>{topic.shortDesc}</p>
              <Table aria-label="Analytics Data" className="mt-4">
                <TableHeader>
                  <TableColumn>Metric</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell>Total Watch Time</TableCell>
                    <TableCell>{topic.totalWatchTime} seconds</TableCell>
                  </TableRow>
                  <TableRow key="2">
                    <TableCell>Video Watch Time</TableCell>
                    <TableCell>{topic.totalVideoWatchTime} seconds</TableCell>
                  </TableRow>
                  <TableRow key="3">
                    <TableCell>Audio Listen Time</TableCell>
                    <TableCell>{topic.totalAudioListenTime} seconds</TableCell>
                  </TableRow>
                  <TableRow key="4">
                    <TableCell>Text Spent Time</TableCell>
                    <TableCell>{topic.totalTextSpentTime} seconds</TableCell>
                  </TableRow>
                  <TableRow key="5">
                    <TableCell>Total View Count</TableCell>
                    <TableCell>{topic.viewCount}</TableCell>
                  </TableRow>
                  <TableRow key="6">
                    <TableCell>Video View Count</TableCell>
                    <TableCell>{topic.videoViewCount}</TableCell>
                  </TableRow>
                  <TableRow key="7">
                    <TableCell>Audio View Count</TableCell>
                    <TableCell>{topic.audioViewCount}</TableCell>
                  </TableRow>
                  <TableRow key="8">
                    <TableCell>Text View Count</TableCell>
                    <TableCell>{topic.textViewCount}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
            <Divider />
            <CardFooter>
              <p>Date: {new Date(topic.date).toLocaleDateString()}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h1 className="text-3xl font-bold my-6">User Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {userAnalytics.map((user: any) => (
          <Card key={user.id} className="w-full">
            <CardHeader className="flex gap-3">
              <Image
                alt="profile"
                height={40}
                radius="sm"
                src={user.user.image || 'https://via.placeholder.com/40'}
                width={40}
              />
              <div className="flex flex-col">
                <p className="text-md">{user.user.name || 'Anonymous'}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <Table aria-label="User Analytics Data" className="mt-4">
                <TableHeader>
                  <TableColumn>Metric</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell>Total Watch Time</TableCell>
                    <TableCell>{user.totalWatchTimeBeamsToday} seconds</TableCell>
                  </TableRow>
                  <TableRow key="2">
                    <TableCell>Video Watch Time</TableCell>
                    <TableCell>{user.totalVideoWatchTime} seconds</TableCell>
                  </TableRow>
                  <TableRow key="3">
                    <TableCell>Audio Listen Time</TableCell>
                    <TableCell>{user.totalAudioListenTime} seconds</TableCell>
                  </TableRow>
                  <TableRow key="4">
                    <TableCell>Text Spent Time</TableCell>
                    <TableCell>{user.totalTextSpentTime} seconds</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <h2 className="text-xl font-bold mt-4">Individual Watch Times</h2>
              <Table aria-label="Individual Watch Times Data" className="mt-2">
                <TableHeader>
                  <TableColumn>Topic</TableColumn>
                  <TableColumn>Video Time</TableColumn>
                  <TableColumn>Audio Time</TableColumn>
                  <TableColumn>Text Time</TableColumn>
                </TableHeader>
                <TableBody>
                  {Object.entries(user.individualWatchTimesVideo || {}).map(([topicId, time]) => (
                    <TableRow key={topicId}>
                      <TableCell>{getTopicTitle(topicId)}</TableCell>
                      <TableCell>{time as number} seconds</TableCell>
                      <TableCell>{user.individualWatchTimesAudio?.[topicId] || 0} seconds</TableCell>
                      <TableCell>{user.individualWatchTimesText?.[topicId] || 0} seconds</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
