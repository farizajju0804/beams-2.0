"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Chart, Rank, Microscope, Cup, Game } from "iconsax-react"
import { Button } from "@nextui-org/react"
import { FaLightbulb } from "react-icons/fa"
import {  BiSolidJoystick } from "react-icons/bi"
import { HiHome } from "react-icons/hi2";

const navItems = [
  { icon: HiHome, label: "Home", path: "/home" },
  { icon: Microscope, label: "Beams Today", path: "/beams-today" },
  { icon: FaLightbulb, label: "Beams Facts", path: "/beams-facts" },
  { icon: BiSolidJoystick, label: "Beams Connect", path: "/beams-connect" },
  { icon: Chart, label: "Dashboard", path: "/dashboard" },
  { icon: Cup, label: "Achievements", path: "/achievements" },
  { icon: Rank, label: "Leaderboard", path: "/leaderboard" },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [selected, setSelected] = useState<number | null>(null)



  useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.path === pathname)
    setSelected(currentIndex !== -1 ? currentIndex : null)
  }, [pathname])



  return (
    <>
     
      <div className="custom-md:hidden  block bg-background shadow-defined-top z-[100] fixed bottom-0 left-0 right-0">
        <motion.div
          className="bg-background rounded-2xl shadow-lg"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <nav className="flex items-center justify-around py-1">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.path}
                prefetch={true}
              
              >
                <Button
                 isIconOnly={!selected}
                 radius="full"
              
                  className={`${selected === index ? "text-brand font-medium bg-transparent gap-2-1" : "bg-transparent  text-[#94A3B8]"} flex text-xs min-w-0 py-1 px-3 h-auto flex-col items-center justify-center w-fit  relative`}
                  startContent={
                      
                    <item.icon
                    size={18}
                    variant={"Bold"}
                   
                  />
                  }
                >

                  {selected === index && 
                     item.label}
         
                    
                </Button>
              </Link>
            ))}
          </nav>
        </motion.div>
      </div>
    </>
  )
}