
import React from 'react'
import NotificationPopover from './NotificationPopover'
import UserButton from './user-button'
import { fetchAllNotifications } from '@/actions/notifications/notifications';
import { currentUser } from '@/libs/auth';
import { getLatestUserData } from '@/actions/auth/getLatestUserData';


const ClientTopNav = async() => {
  const user:any = await currentUser()
  const initialNotifications = await fetchAllNotifications(user.id);
  const userData = await getLatestUserData();
  return (
    <div className='flex items-center justify-center gap-4 md:gap-8'>
      <div className='block'>
         <NotificationPopover initialNotifications={initialNotifications} 
      userId={user.id} />
      </div>
      <UserButton initialUser={userData} />
    </div>
  )
}

export default ClientTopNav