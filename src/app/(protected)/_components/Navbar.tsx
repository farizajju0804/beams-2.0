'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@nextui-org/react'
import path from 'path'
import UserButton from '@/components/auth/user-button'
const Navbar = () => {
    const pathname = usePathname()
  return (
    <nav className='bg-white flex justify-between items-center p-4 rounded-xl shadow-sm w-[600px]'>
        <div className='flex gap-x-2'>
        
            <Link href='/settings'>Settings</Link>
         

            <Link href='/admin'>Admin</Link>

        </div>
        <UserButton/>
        </nav>
  )
}

export default Navbar