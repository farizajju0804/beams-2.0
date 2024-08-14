import {db} from '@/libs/db';

export const getUserById = async(id: any) =>{
    try{
      const user = db.user.findUnique(
         {
             where : {
                 id
             }
         
         }
     )
     return user;
    
 }
 catch {
     return null;
 }
 } 