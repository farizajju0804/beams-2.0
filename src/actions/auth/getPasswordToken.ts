import {db} from '@/libs/db'
export const getPasswordResetTokenByEmail = async (
    email : string
) => {
    try{
       const passwordToken = await db.passwordResetToken.findFirst({
        where : {
            email
        }
       })
       return passwordToken;
    }
    catch(error){
        return null;
    }
}


export const getPasswordResetTokenByToken = async (
    token : string
) => {
    try{
       const passwordToken = await db.passwordResetToken.findUnique({
        where : {
            token
        }
       })
       return passwordToken;
    }
    catch(error){
        return null;
    }
}