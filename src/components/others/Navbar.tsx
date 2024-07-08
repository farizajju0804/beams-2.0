"use client";
import React from "react";
import { FloatingNav } from "@/ui/FloatingNav";
export default function Navbar() {
  const navItems = [
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Contact",
      link: "/contact",
    
    },
  ];
  return (
    <div className="relative  w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}

