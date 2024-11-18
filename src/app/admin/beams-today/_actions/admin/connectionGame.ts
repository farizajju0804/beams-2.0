'use server'

import { db } from '@/libs/db';
import { ConnectionGame } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export type ConnectionGameInput = Omit<ConnectionGame, 'id' | 'createdAt' | 'updatedAt'>;
export type ConnectionGameUpdate = Partial<ConnectionGameInput>;

export async function getConnectionGames() {
  return db.connectionGame.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function createConnectionGame(data: ConnectionGameInput): Promise<{ success: boolean; data?: ConnectionGame; error?: string }> {
  try {
    const game = await db.connectionGame.create({ data });
    revalidatePath('/admin/connection-games');
    return { success: true, data: game };
  } catch (error) {
    return { success: false, error: 'Failed to create connection game' };
  }
}

export async function updateConnectionGame(
  id: string,
  data: ConnectionGameUpdate
): Promise<{ success: boolean; data?: ConnectionGame; error?: string }> {
  try {
    const game = await db.connectionGame.update({
      where: { id },
      data
    });
    revalidatePath('/admin/connection-games');
    return { success: true, data: game };
  } catch (error) {
    return { success: false, error: 'Failed to update connection game' };
  }
}

export async function deleteConnectionGame(id: string): Promise<{ success: boolean; data?: ConnectionGame; error?: string }> {
  try {
    const game = await db.connectionGame.delete({
      where: { id }
    });
    revalidatePath('/admin/connection-games');
    return { success: true, data: game };
  } catch (error) {
    return { success: false, error: 'Failed to delete connection game' };
  }
}