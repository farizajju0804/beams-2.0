
'use client'
import React, { useState } from 'react';
import { AiFillTrophy, AiFillBook, AiFillClockCircle, AiFillMessage } from 'react-icons/ai';
import { Popover, PopoverTrigger, PopoverContent, Badge, Button } from "@nextui-org/react";
import { NotificationIcon } from './NotificationIcon';
import { format } from 'date-fns';
import { Notification, NotificationType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { deleteNotification } from '@/actions/notifications/notifications';



interface NotificationPopoverProps {
  initialNotifications: Notification[];
  userId: string;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ initialNotifications = [], userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const getIcon = (type: NotificationType) => {
    switch(type) {
      case 'ACHIEVEMENT':
        return <AiFillTrophy className="text-brand" size={28} />;
      case 'CONTENT_UPDATE':
        return <AiFillBook className="text-green-500" size={28} />;
      case 'REMINDER':
        return <AiFillClockCircle className="text-blue-500" size={28} />;
      case 'SOCIAL':
        return <AiFillMessage className="text-pink-500" size={28} />;
      default:
        return <AiFillMessage className="text-gray-500" size={28} />;
    }
  };

  const formatNotificationTime = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  const handleNotificationClick = async (id: string, actionUrl: string) => {
    try {
      await deleteNotification(id, userId);
      setNotifications(prevNotifications => prevNotifications.filter(notif => notif.id !== id));
      setIsOpen(false);
      router.push(actionUrl);
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const unreadCount = notifications?.length ?? 0;

  return (
    <Popover backdrop='opaque' isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button isIconOnly className="bg-background">
          {unreadCount > 0 ? (
            <Badge content={unreadCount} color="danger" shape="circle" size="sm">
              <NotificationIcon size={24} className="text-brand" />
            </Badge>
          ) : (
            <NotificationIcon size={24} className="text-[#a2a2a2]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='shadow-defined'>
        <div className="w-80 px-1 py-2">
          <h3 className="text-lg font-poppins font-medium">Notifications</h3>
          <div className="w-full h-[1px] rounded-full my-1 border-[0.5] bg-grey-1"></div>
          {!notifications || notifications.length === 0 ? (
            <p className="text-grey-2 text-center py-4">
              Looks like your notifications are on a coffee break ☕!
            </p>
          ) : (
            notifications.map((notif, index) => (
              <div key={notif.id}>
                <div 
                  className="flex items-start space-x-3 p-2 rounded-lg bg-background cursor-pointer hover:bg-grey-1"
                  onClick={() => handleNotificationClick(notif.id, notif.actionUrl as string)}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-text font-medium">{notif.content}</p>
                    <p className="text-xs text-[#a2a2a2] mt-1">{formatNotificationTime(notif.createdAt)}</p>
                  </div>
                </div>
                {index < notifications.length - 1 && (
                  <div className="w-full h-[1px] rounded-full my-2 border-[0.5] bg-grey-1"></div>
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;


