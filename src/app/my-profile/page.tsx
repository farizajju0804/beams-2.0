// app/user-profile/page.tsx
'use server'
import { currentUser} from "@/libs/auth";
import UserProfile from "@/app/my-profile/_components/UserProfile";

import { getLatestUserData } from "@/actions/auth/getLatestUserData";

export default async function UserProfilePage() {
  const user = await getLatestUserData();
  const user2 = await currentUser();
  if (!user) {
    return <div>Please log in to view settings.</div>;
  }

  return (
  
  <>
  <UserProfile user={user}  isOAuth={user2?.isOAuth}/>
  </>);
}
