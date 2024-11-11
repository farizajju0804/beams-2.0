// app/actions/connection-game.ts
'use server'

import { db } from '@/libs/db';
import { ConnectionGame } from '@prisma/client';

export type ConnectionGameInput = Omit<ConnectionGame, 'id' | 'createdAt' | 'updatedAt'>;
export type ConnectionGameUpdate = Partial<ConnectionGameInput>;

export async function getBeamsTodayTopics() {
  return db.beamsToday.findMany({
    select: {
      id: true,
      title: true
    },
    orderBy: {
      date: 'desc'
    }
  });
}

export async function getConnectionGames() {
  return db.connectionGame.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      beamsToday: {
        select: {
          title: true
        }
      }
    }
  });
}

export async function createConnectionGame(data: ConnectionGameInput): Promise<ConnectionGame> {
  return db.connectionGame.create({
    data
  });
}

export async function updateConnectionGame(
  id: string,
  data: ConnectionGameUpdate
): Promise<ConnectionGame> {
  return db.connectionGame.update({
    where: { id },
    data
  });
}

export async function deleteConnectionGame(id: string): Promise<ConnectionGame> {
  return db.connectionGame.delete({
    where: { id }
  });
}