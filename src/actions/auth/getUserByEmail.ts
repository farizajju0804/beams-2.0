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


  

export const getUserBySecurityAnswers = async (securityAnswer1: string, securityAnswer2: string) => {
  return await db.user.findFirst({
    where: {
      AND: [
        { securityAnswer1: { equals: securityAnswer1, mode: 'insensitive' } },
        { securityAnswer2: { equals: securityAnswer2, mode: 'insensitive' } },
      ],
    },
  });
};

  