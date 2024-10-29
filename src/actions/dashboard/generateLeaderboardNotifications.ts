import { UserType } from "@prisma/client";
import { generateNotification } from "../notifications/notifications";
import { db } from "@/libs/db";

/**
 * Represents a user in the system.
 */
export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

/**
 * Represents an entry in the leaderboard.
 */
export interface LeaderboardEntry {
  id: string;
  userId: string;
  points: number;
  rank: number;
  user: User | null;
}

/**
 * Represents the result of a leaderboard query, containing entries and date range.
 */
export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  startDate: Date;
  endDate: Date;
}

/**
 * Fetches the leaderboard entries for a specified user type.
 * 
 * This function retrieves the leaderboard entries for the most recent week
 * based on the user type (e.g., STUDENT, NON_STUDENT). It queries the 
 * database for the latest leaderboard data and returns the entries along 
 * with the start and end dates of that week.
 *
 * @param userType - The type of user for which to fetch leaderboard entries.
 * @returns A promise that resolves to a LeaderboardResult containing 
 *          the leaderboard entries and their date range.
 * @throws Will throw an error if there is an issue fetching leaderboard entries.
 */
const getLeaderboardEntries = async (userType: UserType): Promise<LeaderboardResult> => {
  try {
    console.log(`Fetching leaderboard entries for userType: ${userType}...`);
    
    const baseDate = new Date();
    const now = new Date(baseDate.getTime() + 60 * 1000);
    console.log(`Current date: ${baseDate.toISOString()}, fetching data up to: ${now.toISOString()}`);
  
    // Fetch the most recent week with completed data
    console.log('Fetching the most recent week...');
    const mostRecentWeek = await db.leaderboard.findFirst({
      where: { endDate: { lt: now }, userType },
      orderBy: { endDate: 'desc' },
      select: { startDate: true, endDate: true }
    });
  
    if (!mostRecentWeek) {
      console.log('No completed weeks found.');
      return { entries: [], startDate: new Date(), endDate: new Date() };
    }
  
    console.log(`Most recent week found: Start Date - ${mostRecentWeek.startDate.toISOString()}, End Date - ${mostRecentWeek.endDate.toISOString()}`);
  
    // Fetch leaderboard entries for the most recent week
    console.log('Fetching leaderboard entries for the most recent week...');
    const leaderboardEntries = await db.leaderboard.findMany({
      where: { endDate: mostRecentWeek.endDate, userType },
      orderBy: { rank: 'asc' },  // Ordered by rank
      include: { user: { select: { id: true, firstName: true, lastName: true } } }
    });
  
    console.log(`Fetched ${leaderboardEntries.length} leaderboard entries.`);
  
    // Log each entry for more detailed insight
    leaderboardEntries.forEach((entry, index) => {
      const userName = entry.user?.firstName ?? "Unknown User";
      console.log(`Rank ${index + 1}: User ID - ${entry.userId}, Name - ${userName}, Points - ${entry.points}`);
    });
  
    return { entries: leaderboardEntries, startDate: mostRecentWeek.startDate, endDate: mostRecentWeek.endDate };
  } catch (error) {
    console.error(`Error in getLeaderboardEntries: ${(error as Error).message}`);
    throw new Error(`Error in getLeaderboardEntries: ${(error as Error).message}`);
  }
};

/**
 * Generates notifications for users based on their leaderboard standings.
 * 
 * This function fetches leaderboard entries for both students and 
 * non-students, then creates and sends notifications to users. 
 * Notifications are generated based on their rank, with special messages 
 * for the top 10 users. The function ensures that notifications are 
 * only sent if there are at least 3 entries in either leaderboard.
 * 
 * @returns A promise that resolves when all notifications have been sent.
 * @throws Will throw an error if there is an issue fetching leaderboard entries or sending notifications.
 */
export const generateLeaderboardNotifications = async () => {
  console.log('Fetching student leaderboard entries...');
  const studentResults = await getLeaderboardEntries('STUDENT');
  console.log(`Fetched ${studentResults.entries.length} student entries.`);
  
  console.log('Fetching non-student leaderboard entries...');
  const nonStudentResults = await getLeaderboardEntries('NON_STUDENT');
  console.log(`Fetched ${nonStudentResults.entries.length} non-student entries.`);
  
  // Check if either student or non-student leaderboard has 3 or more entries
  const hasStudentEntries = studentResults.entries.length >= 3;
  const hasNonStudentEntries = nonStudentResults.entries.length >= 3;
  
  if (!hasStudentEntries && !hasNonStudentEntries) {
    console.log('Neither leaderboard has 3 or more entries. No notifications will be generated.');
    return; // Don't generate notifications if neither has 3 or more entries
  }
  
  console.log('Combining leaderboard entries from both groups...');
  const leaderboardResults = [...studentResults.entries, ...nonStudentResults.entries];
  console.log(`Total combined entries: ${leaderboardResults.length}`);
  
  await Promise.all(
    leaderboardResults.map(async (entry, index) => {
      const rank = index + 1;
      const userName = entry.user?.firstName ?? "User"; // Fallback if no firstName available
  
      // Custom message for top 10
      let message;
      if (rank <= 10) {
        message = `Great job, ${userName}! You’re ranked #${rank} on the leaderboard!🎉 `;
        console.log(`Generated custom message for rank ${rank}: ${message}`);
      } else {
        // Default message for others
        message = `${userName}, you made it to the leaderboard!`;
        console.log(`Generated default message for rank ${rank}: ${message}`);
      }
  
      // Send notification
      console.log(`Sending notification to ${userName} (User ID: ${entry.user?.id})...`);
      await generateNotification(
        entry.user?.id as string,
        'ACHIEVEMENT',
        message,
        '/dashboard'
      );
      console.log(`Notification sent to ${userName} (User ID: ${entry.user?.id})`);
    })
  );
  console.log('All notifications have been sent.');
};
