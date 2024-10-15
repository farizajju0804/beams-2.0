// File: actions/dashboard/pollData.ts
'use server'
import { db } from "@/libs/db";

// Fetch only the poll questions, options, and user responses that the given user has responded to
export const getPollDataByUserId = async (userId: string) => {
  try {
    const polls = await db.beamsTodayPoll.findMany({
      where: {
        options: {
          some: {
            userResponses: {
              some: {
                userId: userId
              }
            }
          }
        }
      },
      include: {
        options: {
          include: {
            userResponses: {
              where: { userId: userId }
            }
          }
        }
      }
    });

    return polls.map(poll => ({
      id: poll.id,
      title: poll.title,
      description: poll.description,
      question: poll.question,
      options: poll.options.map(option => ({
        optionText: option.optionText,
        userResponse: option.userResponses.map(response => ({
          createdAt: response.createdAt
        }))
      }))
    }));
  } catch (error) {
    console.error("Error fetching poll data for user:", error);
    throw new Error("Error fetching poll data for user");
  }
};
