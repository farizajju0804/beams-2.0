"use client"
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { getLatestUserData } from "@/actions/auth/getLatestUserData";
import { signOut, useSession } from "next-auth/react";
import { ArrowDown2 } from "iconsax-react";
import { signOutUser } from "@/actions/auth/signout";

const getAvatarSrc = (user: any) => user?.image;

export default function UserButton() {
  const { user: storeUser, setUser: setStoreUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getLatestUserData();
        if (userData) {
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

  const handleSignOut = async () => {
    const result = await signOutUser();
    if (result.success) {
      await signOut({ callbackUrl: '/auth/login' });
    }
  };

  if (isLoading) {
    return null; 
  }

  const user = storeUser;

  if (!user) {
    return null; 
  }

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start" size="sm">
        <DropdownTrigger>
          <div className="flex items-center gap-2 cursor-pointer">
            <User   
              isFocusable={true}
              name={`${user.firstName}`}
              description={`Level ${user.level || 1} - ${user.levelName || 'Newbie'}`}
              avatarProps={{
                src: getAvatarSrc(user),
                size: "sm",
                showFallback: true,
                name: "",
                isBordered: true,
              }}
              classNames={{
                name: "font-medium"
              }}
            />
            <ArrowDown2 size={16}/>
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">{user.email}</p>
          </DropdownItem>
          <DropdownItem key="beams-today" onClick={() => handleNavigation("/beams-today")}>
            Beams Today
          </DropdownItem>
          <DropdownItem key="profile" onClick={() => handleNavigation("/my-profile")}>
            My Profile
          </DropdownItem>
          <DropdownItem onClick={handleSignOut} key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
