"use server";

import { db } from "@/libs/db";
import { BeamsToday, BeamsTodayCreateInput, BeamsTodayUpdateInput } from "@/types/beamsToday";

// Fetch all BeamsToday entries
export const getBeamsTodayEntries = async (): Promise<BeamsToday[]> => {
  try {
    const entries = await db.beamsToday.findMany();
    return entries as BeamsToday[];
  } catch (error) {
    throw new Error(`Error fetching beamsToday entries: ${(error as Error).message}`);
  }
};

// Create a new BeamsToday entry
export const createBeamsToday = async (data: BeamsTodayCreateInput): Promise<BeamsToday> => {
  try {
    const newEntry = await db.beamsToday.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
    });
    return newEntry as BeamsToday;
  } catch (error) {
    throw new Error(`Error creating beamsToday entry: ${(error as Error).message}`);
  }
};

// Update an existing BeamsToday entry
export const updateBeamsToday = async (id: string, data: BeamsTodayUpdateInput): Promise<BeamsToday> => {
  try {
    const { id: _, date, ...updateData } = data; // Exclude the id from the data object
    const updatedEntry = await db.beamsToday.update({
      where: { id },
      data: {
        ...updateData,
        date: date ? new Date(date) : undefined,
      },
    });
    return updatedEntry as BeamsToday;
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


