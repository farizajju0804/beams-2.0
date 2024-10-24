'use client'
import { useEffect } from 'react'
import { validateSession } from '@/actions/auth/getSessionValid'
import { signOutUser } from '@/actions/auth/signout'
import { deleteAllCookies } from '@/utils/cookies'
import { useSession } from 'next-auth/react'


export const SessionValidator = () => {
  
  const {data : session} = useSession()

  useEffect(() => {
    const checkSession = async () => {
      if(session?.user){
      const sessionStatus = await validateSession()
      // console.log("SessionValidator: Fetched session status", sessionStatus)

      if (!sessionStatus?.isSessionValid || sessionStatus?.isBanned) {
        // console.log("SessionValidator: Session invalid or user banned, signing out")
        await signOutUser()
        await deleteAllCookies()  
      }
    }
  }

    checkSession()
  }, [])

  return null
}


