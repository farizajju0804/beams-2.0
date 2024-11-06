// app/actions/auth.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function deleteCookies() {
  const cookieStore = cookies()
  
  console.log("cookies")
  cookieStore.delete('authjs.session-token')
  cookieStore.delete('.authjs.session-token')
  

  
  redirect('/auth/login')
}