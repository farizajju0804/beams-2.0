'use client'
import React, { useEffect, useState } from "react";
import { getTopicOfTheDay } from "@/actions/beams-today/getTopicOfTheDay";
import TopicOfTheDay from "@/components/beams-today/TopicOfTheDay";
import { BeamsToday } from "@/types/beamsToday";
import { Spinner } from "@nextui-org/react";

interface TopicOfTheDayContainerProps {
  user: any;
}

const TopicOfTheDayContainer: React.FC<TopicOfTheDayContainerProps> = ({ user }) => {
  const [topicOfTheDay, setTopicOfTheDay] = useState<BeamsToday | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const clientDate = new Date().toLocaleDateString("en-CA");
  
  useEffect(() => {
    const fetchTopicOfTheDay = async () => {
      const topic:any = await getTopicOfTheDay(clientDate);
      setTopicOfTheDay(topic);
      setIsLoading(false);
    };
    fetchTopicOfTheDay();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return <TopicOfTheDay topic={topicOfTheDay} clientDate={clientDate}/>;
};

export default TopicOfTheDayContainer;
