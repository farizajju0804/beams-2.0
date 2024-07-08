'use server';

import { PrismaClient } from '@prisma/client';
import { currentUser } from "@/libs/auth";

const db = new PrismaClient();

export const getPoll = async (beamsTodayId: string) => {
  try {
    const poll = await db.beamsTodayPoll.findUnique({
      where: { beamsTodayId },
      include: { options: true },
    });
    return poll;
  } catch (error) {
    throw new Error(`Error fetching poll: ${(error as Error).message}`);
  }
};

export const recordPollResponse = async (pollOptionId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error('User not authenticated or missing user ID');
  }

  try {
    const response = await db.beamsTodayPollResponse.create({
      data: {
        userId: user.id,
        pollOptionId,
      },
    });

    // Increment the votes count for the selected option
    await db.beamsTodayPollOption.update({
      where: { id: pollOptionId },
      data: {
        votes: {
          increment: 1,
        },
      },
    });

    // Award points for poll participation
    await db.userBeamPoints.create({
      data: {
        userId: user.id,
        points: 10,
        source: 'POLL_PARTICIPATION',
      },
    });

    return response;
  } catch (error) {
    throw new Error(`Error recording poll response: ${(error as Error).message}`);
  }
};

export const getUserPollResponse = async (pollId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    return null;
  }

  try {
    const response = await db.beamsTodayPollResponse.findFirst({
      where: {
        userId: user.id,
        pollOption: {
          pollId: pollId,
        },
      },
    });
    return response;
  } catch (error) {
    throw new Error(`Error fetching user poll response: ${(error as Error).message}`);
  }
};
