import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AiFillTrophy, AiFillBook, AiFillClockCircle, AiFillMessage } from 'react-icons/ai';
import { Popover, PopoverTrigger, PopoverContent, Badge, Button, Divider } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationIcon } from './NotificationIcon';
import { format } from 'date-fns';
import { deleteNotification, fetchAllNotifications, fetchNewNotifications } from '@/actions/notifications/notifications';
import { NotificationType } from '@prisma/client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';

const NotificationPopover: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const user:any = useCurrentUser();
  const router = useRouter();

  const fetchInitialNotifications = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const allNotifications = await fetchAllNotifications(user.id);
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error fetching initial notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchNewNotificationsOnly = useCallback(async () => {
    if (!user) return;
    try {
      const newNotifications = await fetchNewNotifications(user.id);
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
        startBlinking();
      }
    } catch (error) {
      console.error('Error fetching new notifications:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchInitialNotifications();
      intervalRef.current = setInterval(fetchNewNotificationsOnly, 30000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    };
  }, [user, fetchInitialNotifications, fetchNewNotificationsOnly]);

  const startBlinking = () => {
    setIsBlinking(true);
    if (blinkTimeoutRef.current) {
      clearTimeout(blinkTimeoutRef.current);
    }
    blinkTimeoutRef.current = setTimeout(() => {
      setIsBlinking(false);
    }, 5000);
  };

  const handleNotificationClick = async (id:string, actionUrl: string) => {
    await deleteNotification(id, user?.id);
    setIsOpen(false);
    router.push(actionUrl);
  };

  const getIcon = (type: NotificationType) => {
    switch(type) {
      case 'ACHIEVEMENT':
        return <AiFillTrophy className="text-brand" size={28} />;  // Trophy icon for achievements
      case 'CONTENT_UPDATE':
        return <AiFillBook className="text-green-500" size={28} />;     // Book icon for content updates
      case 'REMINDER':
        return <AiFillClockCircle className="text-blue-500" size={28} />; // Clock icon for reminders
      case 'SOCIAL':
        return <AiFillMessage className="text-pink-500" size={28} />;   // Message icon for social notifications
    }
  };

  const formatNotificationTime = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  const unreadCount = notifications.length;

  const handlePopoverOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setIsBlinking(false);
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    }
  };

  return (
    <Popover backdrop='opaque' isOpen={isOpen} onOpenChange={handlePopoverOpen}>
      <PopoverTrigger>
        <Button
          isIconOnly
          className={`bg-background ${isBlinking ? 'animate-bounce' : ''}`}
        >
          {unreadCount > 0 ? (
            <Badge 
              content={unreadCount} 
              color="danger" 
              shape="circle" 
              size="sm"
            >
              <NotificationIcon size={24} className="text-brand" />
            </Badge>
          ) : (
            <NotificationIcon size={24} className="text-[#a2a2a2]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='shadow-defined'>
        <div 
          className="w-80 px-1 py-2"
        >
          <h3 className="text-lg font-poppins font-medium">Notifications</h3>
          <div  className=" w-full h-[1px] rounded-full  my-1 border-[0.5] bg-grey-1" ></div>
            {isLoading ? (
              <p className="text-grey-2 text-center py-4">
                Loading notifications...
              </p>
            ) : notifications.length === 0 ? (
              <p className="text-grey-2 text-center py-4">
                Looks like your notifications are on a coffee break ☕!
              </p>
            ) : (
              notifications.map((notif, index) => (
                <div key={notif.id}>
                  <div 
                    className="flex items-start space-x-3 p-2 rounded-lg bg-background cursor-pointer hover:bg-grey-1"
                    onClick={() => handleNotificationClick(notif.id, notif.actionUrl)}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-text font-medium">{notif.content}</p>
                      <p className="text-xs text-[#a2a2a2] mt-1">{formatNotificationTime(notif.createdAt)}</p>
                    </div>
                  </div>
                  {index < notifications.length - 1 &&           <div  className=" w-full h-[1px] rounded-full  my-2 border-[0.5] bg-grey-1" ></div>
                  }
                </div>
              ))
            )}
       
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
