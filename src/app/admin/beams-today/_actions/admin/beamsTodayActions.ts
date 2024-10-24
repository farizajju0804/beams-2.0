// File: /actions/beams-today/admin/beamsTodayActions.ts
'use server'
import { db } from "@/libs/db";
import { Prisma } from "@prisma/client";
import { generateNotificationForAllUsers } from "@/actions/notifications/notifications";

export const getBeamsTodayEntries = async (): Promise<any[]> => {
  try {
    const entries = await db.beamsToday.findMany({
      include: {
        category: true,
        poll: {
          include: {
            options: true,
          },
        },
      },
    });
    return entries;
  } catch (error) {
    throw new Error(`Error fetching beamsToday entries: ${(error as Error).message}`);
  }
};

export const createBeamsToday = async (data: any): Promise<any> => {
  try {
    const newEntry = await db.beamsToday.create({
      data: {
        ...data,
        date: new Date(data.date),
        category: {
          connect: { id: data.categoryId },
        },
        poll: {
          create: {
            title: data.poll.title,
            description: data.poll.description,
            question: data.poll.question,
            options: {
              create: data.poll.options.map((option:any) => ({ optionText: option.optionText })),
            },
          },
        },
      },
      include: {
        category: true,
        poll: {
          include: {
            options: true,
          },
        },
      },
    });
    return newEntry;
  } catch (error) {
    throw new Error(`Error creating beamsToday entry: ${(error as Error).message}`);
  }
};

export const updateBeamsToday = async (id: string, data: any): Promise<any> => {
  try {
    const { id: _, date, poll, categoryId, ...updateData } = data;

    // Update the main BeamsToday entry
    const updatedBeamsToday = await db.beamsToday.update({
      where: { id },
      data: {
        ...updateData,
        date: date ? new Date(date) : undefined,
        category: {
          connect: { id: categoryId },
        },
      },
      include: {
        category: true,
        poll: {
          include: {
            options: true,
          },
        },
      },
    });

    // Handle poll update in a separate operation
    if (poll) {
      if (updatedBeamsToday.poll) {
        // Update existing poll
        await db.beamsTodayPoll.update({
          where: { id: updatedBeamsToday.poll.id },
          data: {
            title: poll.title,
            description: poll.description,
            question: poll.question,
          },
        });

        // Delete existing options
        await db.beamsTodayPollOption.deleteMany({
          where: { pollId: updatedBeamsToday.poll.id },
        });

        // Create new options
        await db.beamsTodayPollOption.createMany({
          data: poll.options.map((option:any) => ({
            optionText: option.optionText,
            pollId: updatedBeamsToday.poll?.id,
          })),
        });
      } else {
        // Create new poll
        await db.beamsTodayPoll.create({
          data: {
            title: poll.title,
            description: poll.description,
            question: poll.question,
            beamsTodayId: id,
            options: {
              create: poll.options.map((option:any) => ({
                optionText: option.optionText
              }))
            }
          },
        });
      }
    }

    // Fetch the final updated entry with all related data
    const finalUpdatedEntry = await db.beamsToday.findUnique({
      where: { id },
      include: {
        category: true,
        poll: {
          include: {
            options: true,
          },
        },
      },
    });

    return finalUpdatedEntry;
  } catch (error) {
    console.error('Error in updateBeamsToday:', error);
    throw new Error(`Error updating beamsToday entry: ${(error as Error).message}`);
  }
};

export const deleteBeamsToday = async (id: string): Promise<void> => {
  try {
    await db.$transaction(async (prisma) => {
      // Delete associated favorites
      await prisma.beamsTodayFavorite.deleteMany({
        where: { beamsTodayId: id },
      });

      // Delete associated poll, options, and responses
      const poll = await prisma.beamsTodayPoll.findUnique({
        where: { beamsTodayId: id },
        include: { options: true },
      });
      if (poll) {
        // Delete poll responses
        await prisma.beamsTodayPollResponse.deleteMany({
          where: { pollOptionId: { in: poll.options.map(o => o.id) } },
        });
        // Delete poll options
        await prisma.beamsTodayPollOption.deleteMany({
          where: { pollId: poll.id },
        });
        // Delete the poll
        await prisma.beamsTodayPoll.delete({
          where: { id: poll.id },
        });
      }

      // Delete the BeamsToday entry
      await prisma.beamsToday.delete({
        where: { id },
      });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Database error: ${error.message}`);
    }
    throw new Error(`Error deleting beamsToday entry: ${(error as Error).message}`);
  }
};

export const toggleBeamsTodayPublish = async (id: string, publishState: boolean): Promise<void> => {
  try {
    await db.beamsToday.update({
      where: { id },
      data: { published: publishState },
    });

    if (publishState) {
      await generateNotificationForAllUsers(
        'CONTENT_UPDATE',
        'New Beams Today content is available',
        `/beams-today/${id}`
      );
    }
  } catch (error) {
    throw new Error(`Error toggling beamsToday publish state: ${(error as Error).message}`);
  }
};
