'use server';

import { PrismaClient } from '@prisma/client'; // Import the PrismaClient.
import { currentUser } from "@/libs/auth"; // Function to get the currently authenticated user.
import { db } from '@/libs/db';


/**
 * Fetches the poll associated with a specific BeamsToday topic.
 * 
 * @param beamsTodayId - The ID of the BeamsToday topic to fetch the poll for.
 * @returns The poll with its options.
 * @throws Throws an error if the poll cannot be retrieved.
 */
export const getPoll = async (beamsTodayId: string) => {
  try {
    // Find the poll for the specific BeamsToday ID, including its options.
    const poll = await db.beamsTodayPoll.findUnique({
      where: { beamsTodayId },
      include: { options: true }, // Include the poll options.
    });
    return poll;
  } catch (error) {
    throw new Error(`Error fetching poll: ${(error as Error).message}`);
  }
};

/**
 * Records a user's response to a poll and increments the vote count for the selected option.
 * 
 * @param pollOptionId - The ID of the poll option the user is voting for.
 * @returns The created poll response.
 * @throws Throws an error if the user is not authenticated or if the database operation fails.
 */

import { startOfWeek, endOfWeek } from 'date-fns';
import { updateUserPoints } from '../points/updateUserPoints';
import { recordPointsHistory } from '../points/recordPointsHistory';
import { updateLeaderboardEntry } from '../points/updateLeaderboardEntry';
import { updateUserPointsAndLeaderboard } from '../points/updateUserPointsAndLeaderboard';

export const recordPollResponse = async (pollOptionId: string) => {
  const user = await currentUser();
  if (!user || !user.id) {
    console.error('User not authenticated or missing user ID');
    throw new Error('User not authenticated or missing user ID');
  }

  console.log(`User ID: ${user.id} is attempting to record a poll response...`);

  try {
    console.log(`Fetching poll option with ID: ${pollOptionId}`);
    const pollOption = await db.beamsTodayPollOption.findUnique({
      where: { id: pollOptionId },
      include: { poll: { include: { beamsToday: true } } },
    });

    if (!pollOption || !pollOption.poll || !pollOption.poll.beamsToday) {
      console.error('Poll or Beams Today content not found');
      throw new Error('Poll or Beams Today content not found');
    }

    const beamsTodayTitle = pollOption.poll.beamsToday.title;
    console.log(`Poll found: "${beamsTodayTitle}"`);

    console.log(`Recording response for user: ${user.id}`);
    await db.beamsTodayPollResponse.create({
      data: { userId: user.id as string, pollOptionId },
    });

    console.log(`Incrementing votes for poll option ID: ${pollOptionId}`);
    await db.beamsTodayPollOption.update({
      where: { id: pollOptionId },
      data: { votes: { increment: 1 } },
    });

    const pointsAdded = 5;

    console.log(`Updating user points and leaderboard for user ID: ${user.id}`);
    const updateResult = await updateUserPointsAndLeaderboard(
      user.id,
      pointsAdded,
      'POLL_PARTICIPATION',
      `Participated in poll, "${beamsTodayTitle}"`,
      user.userType
    );

    const { userBeamPoints, leveledUp, newLevel, levelCaption } = updateResult;
    console.log(`User points updated. New total: ${userBeamPoints.beams}`);

    console.log(`Poll response recorded successfully for user ID: ${user.id}`);
    
    return {
      success: true,
      leveledUp,
      beams: userBeamPoints?.beams,
      newLevel,
      pointsAdded,
    };
  } catch (error) {
    console.error(`Error recording poll response: ${(error as Error).message}`);
    throw new Error(`Error recording poll response: ${(error as Error).message}`);
  }
};


/**
 * Fetches the user's response to a specific poll.
 * 
 * @param pollId - The ID of the poll to check the user's response for.
 * @returns The user's poll response or null if no response exists.
 * @throws Throws an error if the poll response cannot be retrieved.
 */
export const getUserPollResponse = async (pollId: string) => {
  const user = await currentUser(); // Retrieve the current user.

  if (!user || !user.id) {
    return null; // If the user is not authenticated, return null.
  }

  try {
    // Find the user's response to the poll.
    const response = await db.beamsTodayPollResponse.findFirst({
      where: {
        userId: user.id, // Filter by the user's ID.
        pollOption: {
          pollId: pollId, // Filter by the poll ID.
        },
      },
    });
    return response;
  } catch (error) {
    throw new Error(`Error fetching user poll response: ${(error as Error).message}`);
  }
};
