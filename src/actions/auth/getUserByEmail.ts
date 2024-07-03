import {db} from '@/libs/db';

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


export const getUserByUsername = async (username:string) => {
    return await db.user.findUnique({
      where: {
        username,
      },
    });
  };
  

  export const getUserBySecurityQuestion = async (securityQuestion:string , securityAnswer:string) => {
    return await db.user.findFirst({
      where: {
        securityQuestion,
        securityAnswer,
      },
    });
  };