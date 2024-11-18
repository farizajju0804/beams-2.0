import { UserType } from "@prisma/client";
import { generateNotification } from "../notifications/notifications";
import { db } from "@/libs/db";
import { updateAchievementsAfterLeaderboard } from "../points/updateAchievementsAfterLeaderboard";

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
const getLeaderboardEntries = async (userType: UserType,start?: string): Promise<LeaderboardResult> => {
  try {
    console.log(`Fetching leaderboard entries for userType: ${userType}...`);
    
    const baseDate = start ? new Date(start) : new Date(); 
    const now = new Date(baseDate.getTime());
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
  try {
    // Initial log to indicate function start
    console.log('Starting generateLeaderboardNotifications function...');

    // Get current date
    const now = new Date();
    console.log(`Current date: ${now.toISOString()}`);

    // Find most recent leaderboard weeks for both user types
    console.log('Fetching most recent leaderboard week for STUDENT user type...');
    const mostRecentStudentWeek = await db.leaderboard.findFirst({
      where: { 
        endDate: { lt: now }, 
        userType: 'STUDENT' 
      },
      orderBy: { endDate: 'desc' },
      select: { startDate: true, endDate: true }
    });
    console.log('Most recent STUDENT week:', mostRecentStudentWeek || 'No week found');

    console.log('Fetching most recent leaderboard week for NON_STUDENT user type...');
    const mostRecentNonStudentWeek = await db.leaderboard.findFirst({
      where: { 
        endDate: { lt: now }, 
        userType: 'NON_STUDENT' 
      },
      orderBy: { endDate: 'desc' },
      select: { startDate: true, endDate: true }
    });
    console.log('Most recent NON_STUDENT week:', mostRecentNonStudentWeek || 'No week found');

    // Check for existing announcements using the most recent week dates
    console.log('Checking for unprocessed announcements for STUDENT user type...');
    let unprocessedStudentAnnouncement = null;
    if (mostRecentStudentWeek) {
      unprocessedStudentAnnouncement = await db.leaderboardAnnouncement.findUnique({
        where: {
          startDate_endDate_userType: {
            startDate: mostRecentStudentWeek.startDate,
            endDate: mostRecentStudentWeek.endDate,
            userType: 'STUDENT'
          }
        }
      });
      console.log('Unprocessed STUDENT announcement found:', unprocessedStudentAnnouncement ? 'Yes' : 'No');

      // If no announcement exists for this week, create one
      if (!unprocessedStudentAnnouncement) {
        console.log('Creating a new announcement for STUDENT user type...');
        unprocessedStudentAnnouncement = await db.leaderboardAnnouncement.create({
          data: {
            startDate: mostRecentStudentWeek.startDate,
            endDate: mostRecentStudentWeek.endDate,
            userType: 'STUDENT',
            achivementCalculated: false,
            announced: false
          }
        });
        console.log('New STUDENT announcement created:', unprocessedStudentAnnouncement);
      }
    }

    console.log('Checking for unprocessed announcements for NON_STUDENT user type...');
    let unprocessedNonStudentAnnouncement = null;
    if (mostRecentNonStudentWeek) {
      unprocessedNonStudentAnnouncement = await db.leaderboardAnnouncement.findUnique({
        where: {
          startDate_endDate_userType: {
            startDate: mostRecentNonStudentWeek.startDate,
            endDate: mostRecentNonStudentWeek.endDate,
            userType: 'NON_STUDENT'
          }
        }
      });
      console.log('Unprocessed NON_STUDENT announcement found:', unprocessedNonStudentAnnouncement ? 'Yes' : 'No');

      // If no announcement exists for this week, create one
      if (!unprocessedNonStudentAnnouncement) {
        console.log('Creating a new announcement for NON_STUDENT user type...');
        unprocessedNonStudentAnnouncement = await db.leaderboardAnnouncement.create({
          data: {
            startDate: mostRecentNonStudentWeek.startDate,
            endDate: mostRecentNonStudentWeek.endDate,
            userType: 'NON_STUDENT',
            achivementCalculated: false,
            announced: false
          }
        });
        console.log('New NON_STUDENT announcement created:', unprocessedNonStudentAnnouncement);
      }
    }

    // Fetch leaderboard entries only if we have unprocessed achievements
    let studentResults: any;
    let nonStudentResults: any;

    if (
      unprocessedStudentAnnouncement?.achivementCalculated === false ||
      unprocessedNonStudentAnnouncement?.achivementCalculated === false
    ) {
      console.log('Unprocessed achievements found. Fetching leaderboard entries...');

      if (unprocessedStudentAnnouncement?.achivementCalculated === false) {
        console.log('Fetching STUDENT leaderboard entries...');
        studentResults = await getLeaderboardEntries('STUDENT');
        console.log(`Fetched ${studentResults.entries.length} STUDENT entries.`);
      }

      if (unprocessedNonStudentAnnouncement?.achivementCalculated === false) {
        console.log('Fetching NON_STUDENT leaderboard entries...');
        nonStudentResults = await getLeaderboardEntries('NON_STUDENT');
        console.log(`Fetched ${nonStudentResults.entries.length} NON_STUDENT entries.`);
      }

      // Process student category if needed
      if (unprocessedStudentAnnouncement?.achivementCalculated === false &&
          studentResults?.entries.length >= 3) {
        console.log('Processing STUDENT category...');
        console.log('Updating leaderboard achievement for STUDENT entries...');
        await updateAchievementsAfterLeaderboard('STUDENT');

        console.log('Generating notifications for STUDENT leaderboard...');
        await generateNotificationsForGroup(studentResults.entries);

        console.log('Marking STUDENT announcement as processed...');
        await db.leaderboardAnnouncement.update({
          where: { id: unprocessedStudentAnnouncement.id },
          data: { achivementCalculated: true }
        });
      }

      // Process non-student category if needed
      if (unprocessedNonStudentAnnouncement?.achivementCalculated === false &&
          nonStudentResults?.entries.length >= 3) {
        console.log('Processing NON_STUDENT category...');
        console.log('Updating leaderboard achievement for NON_STUDENT entries...');
        await updateAchievementsAfterLeaderboard('NON_STUDENT');

        console.log('Generating notifications for NON_STUDENT leaderboard...');
        await generateNotificationsForGroup(nonStudentResults.entries);

        console.log('Marking NON_STUDENT announcement as processed...');
        await db.leaderboardAnnouncement.update({
          where: { id: unprocessedNonStudentAnnouncement.id },
          data: { achivementCalculated: true }
        });
      }

      console.log('All processing completed successfully.');
    } else {
      console.log('No unprocessed leaderboard announcements found. Skipping all processing.');
    }

  } catch (error) {
    console.error('Error in generateLeaderboardNotifications:', error);
    throw error;
  }
};

 
/**
 * Helper function to generate notifications for a specific group of users
 */
async function generateNotificationsForGroup(
  entries: LeaderboardEntry[]
) {
  await Promise.all(
    entries.map(async (entry) => {
      const userName = entry.user?.firstName ?? "User";
      const userRank = entry.rank; // Use the actual rank from the database
      
      // Generate appropriate message based on rank
      let message;
      if (userRank <= 10) {
        message = `Congratulations ${userName}! You ranked #${userRank} on the leaderboard! 🏆`;
        if (userRank <= 3) {
          // Special message for top 3
          const medals = ['🥇', '🥈', '🥉'];
          message = `Congratulations ${userName}! You ranked #${userRank} ${medals[userRank - 1]} on the leaderboard!`;
        }
      } else {
        message = `Well done ${userName}! You ranked #${userRank} on the leaderboard! 🌟`;
      }



      console.log(`Sending notification to ${userName} (User ID: ${entry.user?.id}) - Rank: ${userRank}`);
      
      if (entry.user?.id) {
        await generateNotification(
          entry.user.id,
          'ACHIEVEMENT',
          message,
          '/leaderboard'
        );
        console.log(`Notification sent successfully to ${userName}`);
      } else {
        console.warn(`Skipped notification for entry with missing user ID: ${entry.id}`);
      }
    })
  );
}