'use server'

import { cookies } from 'next/headers'

export async function deleteAllCookies() {
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()

  allCookies.forEach(cookie => {
    cookieStore.delete(cookie.name)
  })

  return { success: true, message: 'All cookies deleted successfully' }
}