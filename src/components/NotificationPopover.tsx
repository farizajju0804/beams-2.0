  'use client'

  import React, { useState, useEffect, useRef, useCallback } from 'react';
  import { Notification, TickCircle, CloseCircle, Clock, Message, Book1 } from 'iconsax-react';
  import { Popover, PopoverTrigger, PopoverContent, Badge, Button, Switch, Divider } from "@nextui-org/react";
  import { motion, AnimatePresence } from "framer-motion";
  import { NotificationIcon } from './NotificationIcon';

  import { format } from 'date-fns';
  import {  deleteNotification, fetchNewNotifications, fetchShownNotifications, getUserNotificationPreference, updateUserNotificationPreference } from '@/actions/notifications/notifications';
  import { NotificationType } from '@prisma/client';
  import { useCurrentUser } from '@/hooks/use-current-user';
  import { useRouter } from 'next/navigation';


  const NotificationPopover: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);
    const [isBlinking, setIsBlinking] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const user = useCurrentUser();
    const router = useRouter();
    const fetchAllNotifications = useCallback(async () => {
      if (!user || !isEnabled) return;
      try {
        const shownNotifications = await fetchShownNotifications(user.id);
        const newNotifications = await fetchNewNotifications(user.id);
        const allNotifications = [...newNotifications, ...shownNotifications];
        console.log('Fetched notifications:', { shown: shownNotifications, new: newNotifications });
        if (newNotifications.length > 0) {
          playNotificationSound();
          startBlinking();
        }
        setNotifications(allNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }, [user, isEnabled]);
  
    const startNotificationPolling = useCallback(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      fetchAllNotifications(); // Fetch immediately when starting
      intervalRef.current = setInterval(fetchAllNotifications, 30000);
    }, [fetchAllNotifications]);
  
    const stopNotificationPolling = useCallback(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);
  
    useEffect(() => {
      if (user) {
        initializeNotifications();
      }
      return () => {
        stopNotificationPolling();
        if (blinkTimeoutRef.current) {
          clearTimeout(blinkTimeoutRef.current);
        }
      };
    }, [user, stopNotificationPolling]);
  
    useEffect(() => {
      if (isEnabled && user) {
        startNotificationPolling();
      } else {
        stopNotificationPolling();
      }
    }, [isEnabled, user, startNotificationPolling, stopNotificationPolling]);
  
    const initializeNotifications = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const preference: any = await getUserNotificationPreference(user.id);
        setIsEnabled(preference);
        await fetchAllNotifications();
      } catch (error) {
        console.error('Error initializing notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const startBlinking = () => {
      setIsBlinking(true);
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
      blinkTimeoutRef.current = setTimeout(() => {
        setIsBlinking(false);
      }, 5000); // Stop blinking after 5 seconds
    };
    const playNotificationSound = () => {
      const audio = new Audio('https://res.cloudinary.com/drlyyxqh9/video/upload/v1726920353/Beams%20today/Message_Notification_iouwdw.mp3');
      audio.play();
    };
  
    const markAsRead = async (id: string) => {
      if (!user) return;
      try {
        await deleteNotification(id, user.id);
        setNotifications(prevNotifications => prevNotifications.filter(notif => notif.id !== id));
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    };
  
    const handleToggleNotifications = async (value: boolean) => {
      if (!user) return;
      try {
        await updateUserNotificationPreference(user.id, value);
        setIsEnabled(value);
      } catch (error) {
        console.error('Error updating notification preference:', error);
      }
    };
    const getIcon = (type: NotificationType) => {
      switch(type) {
        case 'ACHIEVEMENT': return <TickCircle variant="Bold" size={20} className="text-green-500" />;
        case 'CONTENT_UPDATE': return <Book1 variant="Bold" size={20} className="text-primary" />;
        case 'REMINDER': return <Clock variant="Bold" size={20} className="text-yellow-500" />;
        case 'SOCIAL': return <Message variant="Bold" size={20} className="text-purple-500" />;
      }
    };

    const formatNotificationTime = (date: Date) => {
      return format(new Date(date), 'MMM d, yyyy h:mm a');
    };

    const handleViewNotification = async (id: string, actionUrl: string) => {
      setIsOpen(false); 
      router.push(actionUrl);
    
    };
    const unreadCount = notifications.length;
    const popoverContentVariants = {
      hidden: { opacity: 0, height: 0 },
      visible: { 
        opacity: 1, 
        height: 'auto',
        transition: {
          height: {
            type: "spring",
            stiffness: 500,
            damping: 30
          },
          opacity: { duration: 0.2 }
        }
      },
      exit: { 
        opacity: 0,
        height: 0,
        transition: {
          height: {
            type: "spring",
            stiffness: 500,
            damping: 30
          },
          opacity: { duration: 0.2 }
        }
      }
    };
    const shatterVariants = {
      hidden: { opacity: 0, scale: 0, transition: { duration: 0.5 } },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
      exit: {
        opacity: 0,
        scale: 0,
        rotate: 20,
        transition: {
          duration: 0.3,
          type: "spring",
          damping: 20,
          stiffness: 300
        }
      }
    };
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
      <Popover isOpen={isOpen}  onOpenChange={handlePopoverOpen}>
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
        <PopoverContent >
        <motion.div 
          className="w-80 px-1 py-2"
          initial={false}
            animate={{ height: 'auto' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
  >
            <div className="w-full flex justify-between items-center mb-2">
              <h3 className="text-lg font-poppins font-semibold">Notifications</h3>
              <Switch 
              size="sm" 
              isSelected={isEnabled}
              onValueChange={handleToggleNotifications}
              aria-label="Enable notifications"
            />
            </div>
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
                    variants={shatterVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <div className="flex items-start space-x-3 p-2 rounded-lg bg-background">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm text-text font-medium">{notif.content}</p>
                        <p className="text-xs text-grey-2 mt-1">{formatNotificationTime(notif.createdAt)}</p>
                        <div className="flex justify-between items-center mt-2">
                          <Button
                            as="a"
                            size="sm"
                            className="text-xs hover:bg-transparent p-0 justify-start text-brand bg-transparent"
                            onClick={() => handleViewNotification(notif.id, notif.actionUrl)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="text-xs bg-transparent hover:bg-transparent text-grey-2"
                            onClick={() => markAsRead(notif.id)}
                          >
                            Mark as read
                          </Button>
                        </div>
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