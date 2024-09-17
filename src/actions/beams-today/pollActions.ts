'use server';

import { PrismaClient } from '@prisma/client'; // Import the PrismaClient.
import { currentUser } from "@/libs/auth"; // Function to get the currently authenticated user.

const db = new PrismaClient(); // Initialize a new PrismaClient instance.

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

export const recordPollResponse = async (pollOptionId: string) => {
  const user = await currentUser();
  if (!user || !user.id) {
    throw new Error('User not authenticated or missing user ID');
  }

  try {
    // Find the poll option and its related poll
    const pollOption = await db.beamsTodayPollOption.findUnique({
      where: { id: pollOptionId },
      include: {
        poll: {
          include: {
            beamsToday: true // Include the related Beams Today content
          }
        }
      }
    });

    if (!pollOption || !pollOption.poll || !pollOption.poll.beamsToday) {
      throw new Error('Poll or Beams Today content not found');
    }

    const beamsTodayTitle = pollOption.poll.beamsToday.title; // Get the Beams Today title

    // Record the user's response to the poll
    const response = await db.beamsTodayPollResponse.create({
      data: {
        userId: user.id as string,
        pollOptionId,
      },
    });

    // Increment the votes for the selected poll option
    await db.beamsTodayPollOption.update({
      where: { id: pollOptionId },
      data: {
        votes: {
          increment: 1,
        },
      },
    });

    // Fetch current user beam points
    let userBeamPoints: any = await db.userBeamPoints.findUnique({
      where: { userId: user.id },
      include: { level: true },
    });

    if (!userBeamPoints) {
      // If user doesn't have beam points, create initial entry
      const initialLevel = await db.level.findFirst({
        where: { levelNumber: 1 },
      });
      userBeamPoints = await db.userBeamPoints.create({
        data: {
          userId: user.id as string,
          beams: 50,
          levelId: initialLevel!.id,
        },
        include: { level: true },
      });
    } else {
      // Update user's beam points
      userBeamPoints = await db.userBeamPoints.update({
        where: { userId: user.id },
        data: { beams: { increment: 50 } },
        include: { level: true },
      });
    }

    // Check for level up
    let leveledUp = false;
    let newLevel;
    if (userBeamPoints.beams >= userBeamPoints.level.maxPoints) {
      newLevel = await db.level.findFirst({
        where: { levelNumber: { gt: userBeamPoints.level.levelNumber } },
      });
      if (newLevel) {
        userBeamPoints = await db.userBeamPoints.update({
          where: { userId: user.id },
          data: { levelId: newLevel.id },
          include: { level: true },
        });
        leveledUp = true;
      }
    }

    // Record in beam points history with the Beams Today title in the description
    await db.beamPointsHistory.create({
      data: {
        userId: user.id as string,
        points: 50,
        source: 'POLL_PARTICIPATION',
        description: `Participated in a poll of "${beamsTodayTitle}"`, // Include Beams Today title
      },
    });

    return {
      response,
      pointsAwarded: 50,
      newTotalPoints: userBeamPoints.beams,
      leveledUp,
      newLevel: userBeamPoints.level,
    };
  } catch (error) {
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
