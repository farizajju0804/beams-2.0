// app/actions/notifications.ts
'use server'

import { currentUser } from "@/libs/auth";
import { db } from "@/libs/db";
import { NotificationType } from "@prisma/client";



export const generateNotification = async (
  userId: string,
  type: NotificationType,
  content: string,
  actionUrl: string
) => {
  try {
    await db.notification.create({
      data: {
        userId,
        type,
        content,
        actionUrl,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error generating notification:', error);
    throw new Error(`Failed to generate notification: ${(error as Error).message}`);
  }
};


export const generateNotificationForAllUsers = async (
    type: NotificationType,
    content: string,
    actionUrl: string
  ) => {
    try {
      const allUsers = await db.user.findMany({ select: { id: true } });
      await Promise.all(
        allUsers.map(user => generateNotification(user.id, type, content, actionUrl))
      );
    } catch (error) {
      console.error('Error generating notifications for all users:', error);
      throw new Error(`Failed to generate notifications for all users: ${(error as Error).message}`);
    }
  };


  export const fetchNewNotifications = async (userId: string) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }
  
    try {
      const notifications = await db.notification.findMany({
        where: { 
          userId: userId,
          isShown: false
        },
        orderBy: { createdAt: 'desc' },
      });
  
      // Mark fetched notifications as shown
      if (notifications.length > 0) {
        await db.notification.updateMany({
          where: {
            id: {
              in: notifications.map(n => n.id)
            }
          },
          data: {
            isShown: true
          }
        });
      }
  
      return notifications;
    } catch (error) {
      console.error('Error fetching new notifications:', error);
      throw new Error(`Failed to fetch new notifications: ${(error as Error).message}`);
    }
  };
  
  export const fetchShownNotifications = async (userId: string) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }
  
    try {
      const notifications = await db.notification.findMany({
        where: { 
          userId: userId,
          isShown: true
        },
        orderBy: { createdAt: 'desc' },
      });
  
      return notifications;
    } catch (error) {
      console.error('Error fetching shown notifications:', error);
      throw new Error(`Failed to fetch shown notifications: ${(error as Error).message}`);
    }
  };
  
  export const deleteNotification = async (id: string, userId: string) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }
  
    try {
      await db.notification.delete({
        where: { id, userId: userId }
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error(`Failed to delete notification: ${(error as Error).message}`);
    }
  };


  export const getUserNotificationPreference = async (userId: string) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }
  
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { notificationPreference: true }
      });
  
      return user?.notificationPreference; // Default to true if not set
    } catch (error) {
      console.error('Error fetching user notification preference:', error);
      throw new Error(`Failed to fetch user notification preference: ${(error as Error).message}`);
    }
  };
  
  export const updateUserNotificationPreference = async (userId: string, preference: boolean) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }
  
    try {
      await db.user.update({
        where: { id: userId },
        data: { notificationPreference: preference }
      });
    } catch (error) {
      console.error('Error updating user notification preference:', error);
      throw new Error(`Failed to update user notification preference: ${(error as Error).message}`);
    }
  };