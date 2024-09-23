import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TickCircle, Clock, Message, Book1 } from 'iconsax-react';
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
        playNotificationSound();
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

  const playNotificationSound = () => {
    const audio = new Audio('https://res.cloudinary.com/drlyyxqh9/video/upload/v1726920353/Beams%20today/Message_Notification_iouwdw.mp3');
    audio.play();
  };

  const handleNotificationClick = async(id:string,actionUrl: string) => {
    await deleteNotification(id, user?.id)
    setIsOpen(false);
    router.push(actionUrl);
  };

  const getIcon = (type: NotificationType) => {
    switch(type) {
      case 'ACHIEVEMENT': return <TickCircle variant="Bold" size={20} className="text-primary" />;
      case 'CONTENT_UPDATE': return <Book1 variant="Bold" size={20} className="text-primary" />;
      case 'REMINDER': return <Clock variant="Bold" size={20} className="text-primary" />;
      case 'SOCIAL': return <Message variant="Bold" size={20} className="text-primary" />;
    }
  };

  const formatNotificationTime = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
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
    <Popover isOpen={isOpen} onOpenChange={handlePopoverOpen}>
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
            <NotificationIcon size={24} className="text-brand" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <motion.div 
          className="w-80 px-1 py-2"
          initial={false}
          animate={{ height: 'auto' }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h3 className="text-lg font-poppins font-semibold mb-2">Notifications</h3>
          <AnimatePresence initial={false}>
            {isLoading ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-grey-2 text-center py-4"
              >
                Loading notifications...
              </motion.p>
            ) : notifications.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-grey-2 text-center py-4"
              >
                No notifications
              </motion.p>
            ) : (
              notifications.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <div 
                    className="flex items-start space-x-3 p-2 rounded-lg bg-background cursor-pointer hover:bg-grey-1"
                    onClick={() => handleNotificationClick(notif.id,notif.actionUrl)}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-text font-medium">{notif.content}</p>
                      <p className="text-xs text-grey-2 mt-1">{formatNotificationTime(notif.createdAt)}</p>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Divider className="my-2" />}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;