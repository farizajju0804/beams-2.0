import { cookies } from 'next/headers';
import { getTopicOfTheDay } from "@/actions/beams-today/getTopicOfTheDay";
import TopicOfTheDay from "./TopicOfTheDay";

interface TopicOfTheDayContainerProps {
  user: any;
}

const TopicOfTheDayContainer = async ({ user }: TopicOfTheDayContainerProps) => {
  const cookieStore = cookies();
  const timeZone = cookieStore.get('client_time_zone')?.value || 'UTC';

  const now = new Date();
  const clientDate = now.toLocaleDateString('en-CA', { timeZone });
  const clientTime = now.toLocaleTimeString('en-US', { timeZone });

  console.log("Client date:", clientDate);
  console.log("Client time:", clientTime);

  const topic: any = await getTopicOfTheDay(clientDate);

  return <TopicOfTheDay topic={topic} clientDate={clientDate} />;
};

export default TopicOfTheDayContainer;