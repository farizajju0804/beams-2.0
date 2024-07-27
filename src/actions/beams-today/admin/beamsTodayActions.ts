"use server";

import { db } from "@/libs/db";
import { BeamsToday, BeamsTodayCreateInput, BeamsTodayUpdateInput } from "@/types/beamsToday";

// Fetch all BeamsToday entries
export const getBeamsTodayEntries = async (): Promise<BeamsToday[]> => {
  try {
    const entries = await db.beamsToday.findMany({
      include: {
        category : true,
        poll: {
          include: {
            options: true,
          },
        },
      },
    });
    return entries as any;
  } catch (error) {
    throw new Error(`Error fetching beamsToday entries: ${(error as Error).message}`);
  }
};
export const createBeamsToday = async (data: BeamsTodayCreateInput): Promise<BeamsToday> => {
  try {
    const newEntry = await db.beamsToday.create({
      data: {
        ...data,
        date: new Date(data.date),
        poll: {
          create: {
            title: data.poll.title,
            description: data.poll.description,
            question: data.poll.question,
            options: {
              create: data.poll.options.map((option) => ({ optionText: option })),
            },
          },
        },
      },
      include: {
        poll: {
          include: {
            options: true,
          },
        },
      },
    });
    return newEntry as any;
  } catch (error) {
    throw new Error(`Error creating beamsToday entry: ${(error as Error).message}`);
  }
};


export const updateBeamsToday = async (id: string, data: BeamsTodayUpdateInput): Promise<BeamsToday> => {
  try {
    const { id: _, date, poll, ...updateData } = data; // Exclude the id from the data object

    const updatedEntry = await db.beamsToday.update({
      where: { id },
      data: {
        ...updateData,
        date: date ? new Date(date) : undefined,
        poll: {
          upsert: {
            update: {
              title: poll.title,
              description: poll.description,
              question: poll.question,
              options: {
                deleteMany: {}, // Delete all previous options
                create: poll.options.map((option) => ({ optionText: option })),
              },
            },
            create: {
              title: poll.title,
              description: poll.description,
              question: poll.question,
              options: {
                create: poll.options.map((option) => ({ optionText: option })),
              },
            },
          },
        },
      },
      include: {
        poll: {
          include: {
            options: true,
          },
        },
      },
    });
    return updatedEntry as any;
  } catch (error) {
    throw new Error(`Error updating beamsToday entry: ${(error as Error).message}`);
  }
};


// Delete a BeamsToday entry
export const deleteBeamsToday = async (id: string): Promise<void> => {
  try {
    await db.beamsToday.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error(`Error deleting beamsToday entry: ${(error as Error).message}`);
  }
};


