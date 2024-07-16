// app/user-profile/page.tsx
'use server'
import { currentUser} from "@/libs/auth";
import { settings } from "@/actions/auth/settings";
import UserProfile from "@/components/profile/UserProfile";
import Nav from "@/components/Navbar";

export default async function UserProfilePage() {
  const user = await currentUser();

  if (!user) {
    return <div>Please log in to view settings.</div>;
  }

  return (
  
  <>
  <UserProfile user={user} />
  </>);
}
