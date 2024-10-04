'use server'

import { db } from '@/libs/db';
import { FactOfTheday } from '@prisma/client';

export async function getFacts(): Promise<FactOfTheday[]> {
  return db.factOfTheday.findMany({
    orderBy: { date: 'desc' }
  });
}

export async function createFact(data: Omit<FactOfTheday, 'id'>): Promise<FactOfTheday> {
  return db.factOfTheday.create({ data });
}

export async function updateFact(id: string, data: Partial<Omit<FactOfTheday, 'id'>>): Promise<FactOfTheday> {
  return db.factOfTheday.update({ where: { id }, data });
}

export async function deleteFact(id: string): Promise<FactOfTheday> {
  return db.factOfTheday.delete({ where: { id } });
}