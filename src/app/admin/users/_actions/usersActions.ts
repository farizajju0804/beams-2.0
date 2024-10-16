'use server';

import { db } from '@/libs/db';
import { User, UserType, Account } from '@prisma/client';

export async function getUsers(
  userType?: UserType,
  accountType?: 'oidc' | 'credentials',
  provider?: string
): Promise<(User & { accounts: Account[] })[]> {
  return db.user.findMany({
    where: {
      ...(userType && { userType }),
      ...(accountType && {
        accounts: {
          some: {
            ...(accountType === 'oidc' ? { NOT: { type: 'credentials' } } : { type: 'credentials' }),
            ...(provider && { provider }),
          },
        },
      }),
    },
    include: {
      accounts: true,
    },
  });
}

export async function getUserDetails(userId: string): Promise<any> {
  return db.user.findUnique({
    where: { id: userId },
    include: {
      accounts: true,
      beamPoints: {
        include: {
          level: true,
        },
      },
      userAchievements: {
        where: {
          completionStatus: true,
        },
        include: {
          achievement: true,
        },
      },
    },
  });
}

export async function deleteUser(userId: string): Promise<User> {
  return db.user.delete({ where: { id: userId } });
}

export async function banUser(userId: string): Promise<void> {
  console.log(`User ${userId} has been banned.`);
}

export async function terminateSession(userId: string): Promise<void> {
  console.log(`Session for user ${userId} has been terminated.`);
}