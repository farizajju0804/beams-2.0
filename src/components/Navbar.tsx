'use client'
import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";

import Image from "next/image";
import UserButton from "./auth/user-button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useTheme } from "next-themes";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isMobile = window.innerWidth < 767;
  const { theme } = useTheme();
  const menuItems = [
    "Profile",
  ];
  const lightLogo = '/images/beams-today/beams-today.png';
  const darkLogo = '/images/beams-today/beams-today-dark.png';
  return (
    <Navbar className="max-w-none w-full bg-background" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className=" max-w-none w-full">
        {/* <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        /> */}
        <NavbarBrand>
          <Link href="/beams-today">
          <Image 
              src={theme === 'dark' ? darkLogo : lightLogo} 
              alt="logo"  
              width={isMobile ? 100 : 140} 
              height={isMobile ? 70 : 100} 
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
      <NavbarItem className="">
           <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem className="">
           <UserButton />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
