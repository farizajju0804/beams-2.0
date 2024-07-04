'use server'
import { db } from "@/libs/db"
import { getVerificationTokenByToken } from "@/actions/auth/getVerificationToken"
import { getUserByEmail } from "./getUserByEmail"
import { currentUser } from '@/libs/auth'

export const newEmail = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: "Token does not exist!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    await db.user.update({
        where: {
            id: user.id
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    });

    await db.verificationToken.delete({
        where: {
            id: existingToken.id
        }
    });

    return { success: "Email Updated!" };
}
