'use server'
import { db } from "@/libs/db";
import { BeamsToday, BeamsTodayCreateInput, BeamsTodayUpdateInput } from "@/types/beamsToday";

export const getBeamsTodayEntries = async (): Promise<BeamsToday[]> => {
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
    console.log('Fetched entries from DB:', entries);
    return entries as any;
  } catch (error) {
    throw new Error(`Error fetching beamsToday entries: ${(error as Error).message}`);
  }
};

export const createBeamsToday = async (data: any): Promise<BeamsToday> => {
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
    return newEntry as any;
  } catch (error) {
    throw new Error(`Error creating beamsToday entry: ${(error as Error).message}`);
  }
};

export const updateBeamsToday = async (id: string, data: BeamsTodayUpdateInput): Promise<BeamsToday> => {
  try {
    const { id: _, date, poll, categoryId, ...updateData } = data; 

    const updatedEntry = await db.$transaction(
      async (prisma) => {
        const existingPoll = await prisma.beamsTodayPoll.findUnique({
          where: { beamsTodayId: id },
          include: {
            options: true,
          },
        });

        if (!existingPoll) {
          throw new Error(`Poll not found for beamsToday entry with id ${id}`);
        }

        const existingOptionIds = new Set(existingPoll.options.map((option) => option.id));
        const optionsToUpdate = poll.options.filter((newOption) => newOption.id && existingOptionIds.has(newOption.id));
        const optionsToCreate = poll.options.filter((newOption) => !newOption.id || !existingOptionIds.has(newOption.id));

        for (const option of optionsToUpdate) {
          await prisma.beamsTodayPollOption.update({
            where: { id: option.id! },
            data: { optionText: option.optionText },
          });
        }

        for (const option of optionsToCreate) {
          await prisma.beamsTodayPollOption.create({
            data: {
              optionText: option.optionText,
              pollId: existingPoll.id,
            },
          });
        }

        const updatedEntry = await prisma.beamsToday.update({
          where: { id },
          data: {
            ...updateData,
            date: date ? new Date(date) : undefined,
            category: {
              connect: { id: categoryId },
            },
            poll: {
              update: {
                title: poll.title,
                description: poll.description,
                question: poll.question,
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

        return updatedEntry as any;
      },
      {
        maxWait: 5000,
        timeout: 20000,
      }
    );

    return updatedEntry;
  } catch (error) {
    throw new Error(`Error updating beamsToday entry: ${(error as Error).message}`);
  }
};

export const deleteBeamsToday = async (id: string): Promise<void> => {
  try {
    await db.beamsToday.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error(`Error deleting beamsToday entry: ${(error as Error).message}`);
  }
};
