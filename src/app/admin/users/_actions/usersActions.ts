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
  await terminateSession(userId)
  return db.user.delete({ where: { id: userId } });
}

export async function banUser(userId: string) {
  const user = await db.user.update({
    where: { id: userId },
    data: {
      isBanned: true,
      isSessionValid: false, // Invalidate their session
    },
  });

  return user;
}

export async function terminateSession(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { isSessionValid: false },
  });
  console.log(`Session for user ${userId} has been terminated.`);
}

// Server action to terminate all sessions
export async function terminateAllSessions(): Promise<void> {
  await db.user.updateMany({
    data: { isSessionValid: false },
  });
  console.log(`All user sessions have been terminated.`);
}