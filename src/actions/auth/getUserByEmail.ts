import db from '@/libs/db';

export const getUserByEmail = async(email: string) =>{
   try{
     const user = db.user.findUnique(
        {
            where : {
                email
            }
        
        }
      
    )
    return user;
}
catch {
    return null;
}
} 