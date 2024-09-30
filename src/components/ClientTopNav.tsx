// ClientTopNav.tsx
'use client'

import React from 'react'

import NotificationPopover from './NotificationPopover'
import UserButton from './user-button'


const ClientTopNav = () => {
  return (
    <div className='flex items-center justify-center gap-4 md:gap-8'>
      <div className='block'>
         <NotificationPopover/>
      </div>
      <UserButton />
    </div>
  )
}

export default ClientTopNav