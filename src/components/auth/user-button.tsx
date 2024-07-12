import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from "@nextui-org/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function UserButton() {
  const user = useCurrentUser();
  const router = useRouter(); // Initialize router

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start" size="sm">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: user?.image || "https://i.pravatar.cc/150?u=a042581f4e29026024d"
            }}
            className="transition-transform"
            description={user?.email}
            name={user?.name}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in with</p>
            <p className="font-bold">{user?.email}</p>
          </DropdownItem>
          <DropdownItem key="library" onClick={() => handleNavigation("/library")}>
            My Library
          </DropdownItem>
          <DropdownItem key="profile" onClick={() => handleNavigation("/profile")}>
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
