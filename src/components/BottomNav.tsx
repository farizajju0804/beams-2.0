"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Chart, BookSquare, Rank, Microscope, Cup } from "iconsax-react"
import { Button, Spinner } from "@nextui-org/react"


const navItems = [
  { icon: Microscope, label: "Beams Today", path: "/beams-today" },
  { icon: BookSquare, label: "Beams Facts", path: "/beams-facts" },
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
     
      <div className="md:hidden  block bg-background shadow-defined-top z-[100] fixed bottom-0 left-0 right-0">
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
                // onClick={() => handleNavigation(index)}
              >
                <Button
                 isIconOnly={!selected}
                 radius="full"
                //  variant={selected === index ? "shadow" : 'light'}
                //  color={selected === index ? "primary" : 'default'}
                  className={`${selected === index ? "text-brand font-medium bg-transparent gap-2-1" : "bg-transparent  text-[#94A3B8]"} flex text-xs min-w-0 py-1 px-3 h-auto flex-col items-center justify-center w-fit  relative`}
                  startContent={
                      
                    <item.icon
                    size={18}
                    variant={"Bold"}
                    // color={selected === index ? "#f96f2e" : "#94A3B8"}
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