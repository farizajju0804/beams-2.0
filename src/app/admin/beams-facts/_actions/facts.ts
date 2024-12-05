'use server'

import { db } from '@/libs/db';
import { FactOfTheday, FactCategory } from '@prisma/client';

export async function getFacts(): Promise<(FactOfTheday & { category: FactCategory })[]> {
  return db.factOfTheday.findMany({
    orderBy: { date: 'desc' },
    include: {
      category: true
    }
  });
}

export async function getCategories(): Promise<FactCategory[]> {
  return db.factCategory.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function createCategory(data: { name: string; color: string }): Promise<FactCategory> {
  return db.factCategory.create({ data });
}

export async function createFact(data: Omit<FactOfTheday, 'id'>): Promise<FactOfTheday> {
  return db.factOfTheday.create({ data });
}

export async function updateFact(id: string, data: Partial<Omit<FactOfTheday, 'id'>>): Promise<FactOfTheday> {
  const { categoryId, ...rest } = data;
  
  return db.factOfTheday.update({
    where: { id },
    data: {
      ...rest,
      category: categoryId ? {
        connect: { id: categoryId }
      } : undefined
    }
  });
}

export async function deleteFact(id: string): Promise<FactOfTheday> {
  return db.factOfTheday.delete({
    where: { id }
  });
}