// File: actions/dashboard/pollData.ts
'use server';

import { db } from "@/libs/db";

/**
 * Fetches poll questions, options, and user responses for a given user.
 *
 * This function retrieves all polls that the specified user has responded to,
 * including the details of each poll such as the title, description, question,
 * options, and the user's responses. It only returns polls with responses from the user.
 *
 * @param userId - The ID of the user whose poll responses are being fetched.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of poll objects, 
 *                                    each containing poll details and the user's responses.
 * @throws {Error} Throws an error if fetching poll data fails.
 */
export const getPollDataByUserId = async (userId: string) => {
  try {
    // Fetch polls where the user has provided responses
    const polls = await db.beamsTodayPoll.findMany({
      where: {
        options: {
          some: {
            userResponses: {
              some: {
                userId: userId // Filter to only include polls the user has responded to
              }
            }
          }
        }
      },
      include: {
        options: {
          include: {
            userResponses: {
              where: { userId: userId // Include only the user's responses for each option
              }
            }
          }
        }
      }
    });

    // Transform the fetched polls into a more readable format
    return polls.map(poll => ({
      id: poll.id, // Poll ID
      title: poll.title, // Poll title
      description: poll.description, // Poll description
      question: poll.question, // The main question of the poll
      options: poll.options.map(option => ({
        optionText: option.optionText, // Text for each poll option
        userResponse: option.userResponses.map(response => ({
          createdAt: response.createdAt // Timestamp of the user's response
        }))
      }))
    }));
  } catch (error) {
    console.error("Error fetching poll data for user:", error);
    throw new Error("Error fetching poll data for user"); // Throw error if there is an issue
  }
};
