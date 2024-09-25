import { generateLeaderboardNotifications } from "@/actions/dashboard/generateLeaderboardNotifications";

export const dynamic = 'force-dynamic'; 

export async function GET(request: Request) {
  try {
    console.log('API request received: Generating leaderboard notifications...');
    await generateLeaderboardNotifications();
    console.log('Notifications successfully generated');
    return new Response('Leaderboard notifications sent!', { status: 200 });
  } catch (error) {
    console.error(`Error while generating notifications: ${(error as Error).message}`);
    return new Response(`Error: ${(error as Error).message}`, { status: 500 });
  }
}
