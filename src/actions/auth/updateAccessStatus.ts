'use server'

import { currentUser } from "@/libs/auth"
import { db } from "@/libs/db"

export const updateAccessStatus = async (submittedCode: string) => {
    const user = await currentUser()
    const userId = user?.id

    if (!userId) {
        return { status: 'error', message: 'User not authenticated' }
    }

    // Find the access code in the database
    const accessCode = await db.accessCode.findUnique({
        where: { code: submittedCode }
    })

    // If no access code is found, return error status
    if (!accessCode) {
        return { status: 'error', message: 'Invalid access code' }
    }

    // Update user's isAccessible field to true
    await db.user.update({
        where: { id: userId },
        data: { isAccessible: true }
    })

    // Delete the access code after use
    await db.accessCode.delete({
        where: { code: submittedCode }
    })

    // Return success
    return { status: 'success' }
}
