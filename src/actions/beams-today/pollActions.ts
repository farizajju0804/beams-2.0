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
  const user = await currentUser(); // Retrieve the current user.

  if (!user || !user.id) {
    throw new Error('User not authenticated or missing user ID');
  }

  try {
    // Record the user's response to the poll.
    const response = await db.beamsTodayPollResponse.create({
      data: {
        userId: user.id, // Associate the response with the current user's ID.
        pollOptionId, // Associate the response with the selected poll option.
      },
    });

    // Increment the votes for the selected poll option.
    await db.beamsTodayPollOption.update({
      where: { id: pollOptionId },
      data: {
        votes: {
          increment: 1, // Increment the vote count.
        },
      },
    });

    // Award 10 points to the user for poll participation.
    // await db.userBeamPoints.create({
    //   data: {
    //     userId: user.id,
    //     points: 10,
    //     source: 'POLL_PARTICIPATION', // Record the source of the points.
    //   },
    // });

    return response;
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
