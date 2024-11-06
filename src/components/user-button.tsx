'use client'
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Spinner, DropdownSection, User } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { getLatestUserData } from "@/actions/auth/getLatestUserData";
import { signOut, useSession } from "next-auth/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ArrowDown2, Gift, Logout } from "iconsax-react";
import { signOutUser } from "@/actions/auth/signout";
import { ReferFriendModal } from "./ReferalModal";
import { getOrCreateReferralCode } from "@/actions/auth/getOrCreateReferralCode";
import { useReferralModalStore } from "@/store/referralStore";

import { ReferralStatus } from "@prisma/client";
import { deleteCookies } from "@/utils/cookies";

interface UserData {
  id: string,
  email: string | null,
  firstName: string | null,
  gender: string | null,
  dob: Date | null,
  lastName: string | null,
  image: string | null,
  grade: string | null,
  userType: string,
  isTwoFactorEnabled: boolean,
  userFormCompleted: boolean,
  onBoardingCompleted: boolean,
  referredById?: string | null,
  referralStatus?: ReferralStatus | null,
  level?: number,
  levelName?: string
}

interface UserButtonProps {
  initialUser: UserData | null;
}

const getAvatarSrc = (user: any) => user?.image;

export default function UserButton({ initialUser }: UserButtonProps) {
  const { user: storeUser, setUser: setStoreUser } = useUserStore();
  const router = useRouter();
  const { openModal } = useReferralModalStore();

  useState(() => {
    if (initialUser && !storeUser) {
      setStoreUser(initialUser);
    }
  });

  const handleNavigation = (path: string) => {
    router.push(path);
  };



  const user = storeUser;

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
    
      // await deleteCookies()
      await signOutUser();
  
      
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  
  // Define all possible menu items
  const menuItems = [
    // Profile Section
    <DropdownSection key="profile-section" title="Profile" showDivider>
      <DropdownItem
        key="signed-in"
        className="h-14 gap-2"
      >
        <div className="flex flex-col">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{user.email}</p>
        </div>
      </DropdownItem>
    </DropdownSection>,

    // Account Section
    <DropdownSection key="account-section" title="Account" showDivider>
      <DropdownItem
        key="library"
        onClick={() => handleNavigation("/my-library")}
      >
        My Library
      </DropdownItem>
      <DropdownItem
        key="profile"
        onClick={() => handleNavigation("/my-profile")}
      >
        My Profile
      </DropdownItem>
    </DropdownSection>,

    // Support Section
    <DropdownSection key="support-section" title="Support" showDivider>
      <DropdownItem
        key="faq"
        onClick={() => handleNavigation("/faq")}
      >
        FAQ
      </DropdownItem>
      <DropdownItem
        key="contact"
        onClick={() => handleNavigation("/contact-us")}
      >
        Contact
      </DropdownItem>
    </DropdownSection>,

    // Theme Switcher
    <DropdownItem
      key="theme"
      className="cursor-auto"
    >
      <ThemeSwitcher />
    </DropdownItem>,

    // Conditionally add Refer A Friend item
    ...(user.referredById === null && user.referralStatus === null ? [
      <DropdownItem
        key="refer"
        onClick={openModal}
        startContent={<Gift className="text-green-500" variant="Bold" />}
      >
        Refer A Friend
      </DropdownItem>
    ] : []),

    // Logout Item
    <DropdownItem
      key="logout"
      // onClick={customSignOut}
      onClick={handleSignOut}
      startContent={<Logout className="text-red-500" variant="Bold" />}
      color="danger"
    >
      Log Out
    </DropdownItem>
  ];

  return (
    <>
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
                classNames={{ name: "font-medium max-w-24 truncate" }}
              />
              <ArrowDown2 size={16} />
            </div>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="User Actions" 
            variant="flat" 
            itemClasses={{
              base: "gap-4",
            }}
          >
            {menuItems}
          </DropdownMenu>
        </Dropdown>
      </div>
      <ReferFriendModal />
    </>
  );
}