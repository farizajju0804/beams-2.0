import React, { useEffect, useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useUserStore } from "@/store/userStore";
import { getLatestUserData } from "@/actions/auth/getLatestUserData";


const getAvatarSrc = (user: any) => user?.image || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(`${user?.firstName || ''} ${user?.lastName || ''}`)}`;

export default function UserButton() {
  const { user: storeUser, setUser: setStoreUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getLatestUserData();
        if (userData) {
          console.log(userData)
          setStoreUser(userData); 
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserData();
  }, [setStoreUser]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  const user = storeUser;

  if (!user) {
    return null; 
  }

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start" size="sm">
        <DropdownTrigger>
          <Avatar 
            isBordered 
            src={getAvatarSrc(user)}
            imgProps={{ 
              onError: (e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(`${user.firstName || ''} ${user.lastName || ''}`)}`;
              }
            }}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in with</p>
            <p className="font-bold">{user.email}</p>
          </DropdownItem>
          <DropdownItem key="library" onClick={() => handleNavigation("/beams-today/library")}>
            My Library
          </DropdownItem>
          <DropdownItem key="profile" onClick={() => handleNavigation("/my-profile")}>
            My Profile
          </DropdownItem>
          <DropdownItem onClick={() => signOut()} key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
