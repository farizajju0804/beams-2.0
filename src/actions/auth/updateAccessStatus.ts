'use server'

import { currentUser } from "@/libs/auth"
import { db } from "@/libs/db"

export const updateAccessStatus = async (submittedCode: string) => {
    const user = await currentUser()
    const userId = user?.id

    if (!userId) {
        console.log('No user')

        return { status: 'error', message: 'User not authenticated' }
    }


    // Find the access code in the database
    const accessCode = await db.accessCode.findUnique({
        where: { code: submittedCode }
    })

    // If no access code is found, return error status
    if (!accessCode) {
        console.log('Invalid access code')
        return { status: 'error', message: 'The Invitation Code is incorrect.' }
    }

    try {
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
    } catch (error) {
        console.error("Error updating user or deleting access code:", error)
        return { status: 'error', message: 'Network or server error. Please Check your internet or try again later.' }
    }
}