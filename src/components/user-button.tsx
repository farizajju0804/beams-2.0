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

// const getAvatarSrc = (user: any) => user?.image || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(`${user?.firstName || ''} ${user?.lastName || ''}`)}`;
const getAvatarSrc = (user: any) => user?.image;

export default function UserButton() {
  const searchParams = useSearchParams();
  const { user: storeUser, setUser: setStoreUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referralUrl, setReferralUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check for referral param and open modal
    if (searchParams.get("referral") === "true") {
      openReferralModal();
    }
  }, [searchParams]);
  
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

  const openReferralModal = async () => {
    // Fetch the referral code before opening the modal
    const referralCode = await getOrCreateReferralCode();
    setReferralUrl(`${window.location.origin}/auth/register?referral=${referralCode}`);
    setIsModalOpen(true); // Open the modal after the URL is set
  };

  if (isLoading) {
    return null; 
  }

  const user = storeUser;

  if (!user) {
    return null; 
  }

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
                classNames={{ name: "font-medium" }}
              />
              <ArrowDown2 size={16} />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownSection showDivider>
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-bold">Signed in as</p>
                <p className="font-bold">{user.email}</p>
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Account" showDivider>
              <DropdownItem key="library" onClick={() => handleNavigation("/my-library")}>
                My Library
              </DropdownItem>
              <DropdownItem key="profile" onClick={() => handleNavigation("/my-profile")}>
                My Profile
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Support" showDivider>
              <DropdownItem key="FAQ" onClick={() => handleNavigation("/faq")}>
                FAQ
              </DropdownItem>
              <DropdownItem key="contact" onClick={() => handleNavigation("/contact-us")}>
                Contact
              </DropdownItem>
            </DropdownSection>
            <DropdownItem className="cursor-auto" key="theme">
              <ThemeSwitcher />
            </DropdownItem>
            <DropdownItem key="refer" onClick={openReferralModal} startContent={<Gift className="text-green-500" variant="Bold" />}>
              Refer A Friend
            </DropdownItem>
            <DropdownItem onClick={handleSignOut} startContent={<Logout className="text-red-500" variant="Bold" />} key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <ReferFriendModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen} // Close modal handler
        referralUrl={referralUrl} // Pass the referral URL as a prop
      />
    </>
  );
}
