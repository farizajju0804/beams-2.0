// app/actions/notifications.ts
'use server'; // Indicates that this module is a server-side module
import { db } from "@/libs/db"; // Importing the database instance
import { NotificationType } from "@prisma/client"; // Importing the NotificationType from Prisma

/**
 * Generates a new notification for a specific user.
 *
 * @param userId - The unique identifier of the user to receive the notification.
 * @param type - The type of notification being generated.
 * @param content - The content/message of the notification.
 * @param actionUrl - The URL to be opened when the notification is clicked.
 */
export const generateNotification = async (
  userId: string,
  type: NotificationType,
  content: string,
  actionUrl: string
) => {
  try {
    // Create a new notification record in the database
    await db.notification.create({
      data: {
        userId,
        type,
        content,
        actionUrl,
        createdAt: new Date(), // Set the creation date to now
      },
    });
  } catch (error) {
    console.error('Error generating notification:', error);
    throw new Error(`Failed to generate notification: ${(error as Error).message}`);
  }
};

/**
 * Generates a notification for all users in the system.
 *
 * @param type - The type of notification to be sent to all users.
 * @param content - The content/message of the notification.
 * @param actionUrl - The URL to be opened when the notification is clicked.
 */
export const generateNotificationForAllUsers = async (
  type: NotificationType,
  content: string,
  actionUrl: string
) => {
  try {
    // Fetch all user IDs from the database
    const allUsers = await db.user.findMany({ select: { id: true } });
    
    // Generate notifications for all users in parallel
    await Promise.all(
      allUsers.map(user => generateNotification(user.id, type, content, actionUrl))
    );
  } catch (error) {
    console.error('Error generating notifications for all users:', error);
    throw new Error(`Failed to generate notifications for all users: ${(error as Error).message}`);
  }
};

/**
 * Fetches new, unshown notifications for a specific user.
 *
 * @param userId - The unique identifier of the user.
 * @returns An array of new notifications.
 */
export const fetchNewNotifications = async (userId: string) => {
  if (!userId) {
    throw new Error('User not authenticated'); // Ensure user is authenticated
  }

  try {
    // Find all unshown notifications for the user
    const notifications = await db.notification.findMany({
      where: { 
        userId: userId,
        isShown: false // Only fetch unshown notifications
      },
      orderBy: { createdAt: 'desc' }, // Order by creation date (most recent first)
    });

    // Mark fetched notifications as shown
    if (notifications.length > 0) {
      await db.notification.updateMany({
        where: {
          id: {
            in: notifications.map(n => n.id) // Get the IDs of the notifications to update
          }
        },
        data: {
          isShown: true // Set the notifications as shown
        }
      });
    }

    return notifications; // Return the fetched notifications
  } catch (error) {
    console.error('Error fetching new notifications:', error);
    throw new Error(`Failed to fetch new notifications: ${(error as Error).message}`);
  }
};

/**
 * Fetches already shown notifications for a specific user.
 *
 * @param userId - The unique identifier of the user.
 * @returns An array of shown notifications.
 */
export const fetchShownNotifications = async (userId: string) => {
  if (!userId) {
    throw new Error('User not authenticated'); // Ensure user is authenticated
  }

  try {
    // Find all shown notifications for the user
    const notifications = await db.notification.findMany({
      where: { 
        userId: userId,
        isShown: true // Only fetch shown notifications
      },
      orderBy: { createdAt: 'desc' }, // Order by creation date (most recent first)
    });

    return notifications; // Return the fetched notifications
  } catch (error) {
    console.error('Error fetching shown notifications:', error);
    throw new Error(`Failed to fetch shown notifications: ${(error as Error).message}`);
  }
};

/**
 * Deletes a specific notification for a user.
 *
 * @param id - The unique identifier of the notification to delete.
 * @param userId - The unique identifier of the user.
 */
export const deleteNotification = async (id: string, userId: string) => {
  if (!userId) {
    throw new Error('User not authenticated'); // Ensure user is authenticated
  }

  try {
    // Delete the specified notification for the user
    await db.notification.delete({
      where: { id, userId: userId } // Ensure the notification belongs to the user
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw new Error(`Failed to delete notification: ${(error as Error).message}`);
  }
};

/**
 * Fetches all notifications for a specific user.
 *
 * @param userId - The unique identifier of the user.
 * @returns An array of all notifications for the user.
 */
export const fetchAllNotifications = async (userId: string) => {
  if (!userId) {
    throw new Error('User not authenticated'); // Ensure user is authenticated
  }

  try {
    // Fetch all notifications for the user
    const notifications = await db.notification.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }, // Order by creation date (most recent first)
    });

    return notifications; // Return the fetched notifications
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error(`Failed to fetch notifications: ${(error as Error).message}`);
  }
};
