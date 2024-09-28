'use client'

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Chart, Cup, BookSquare, Rank,  Microscope } from "iconsax-react"

const navItems = [
  { icon: Microscope, label: "Beams Today", path: "/beams-today" },
  { icon: Chart, label: "Dashboard", path: "/dashboard" },
  { icon: BookSquare, label: "My Library", path: "/my-library" },
  { icon: Rank, label: "Leaderboard", path: "/leaderboard" },
]

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.path === pathname)
    if (currentIndex !== -1) {
      setSelected(currentIndex)
    }
  }, [pathname])

  const handleNavigation = (index: number) => {
    setSelected(index)
    router.push(navItems[index].path)
  }

  return (
    <div className="md:hidden block bg-background shadow-defined z-[1000] fixed bottom-0 left-0 right-0">
      <motion.div
        className="bg-background rounded-2xl shadow-lg"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <nav className="flex items-center justify-around p-2">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              className="flex flex-col items-center justify-center w-fit h-12 relative"
              onClick={() => handleNavigation(index)}
            >
              <AnimatePresence>
                {selected === index && (
                  <motion.div
                    className="absolute bottom-0 w-1 h-1 rounded-full"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{ backgroundColor: "#f96f2e", zIndex: 2 }}
                  />
                )}
              </AnimatePresence>
              <motion.div
                animate={{
                  scale: selected === index ? 1.2 : 1,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ zIndex: 1 }}
              >
                <item.icon
                  size={14}
                  variant={"Bold" }
                  color={selected === index ? "#f96f2e" : "#94A3B8"}
                />
              </motion.div>
              <motion.span
                className="text-[10px] mt-1 font-medium"
                animate={{
                  color: selected === index ? "#f96f2e" : "#94A3B8",
                }}
                style={{ zIndex: 1 }}
              >
                {item.label}
              </motion.span>
            </button>
          ))}
        </nav>
      </motion.div>
    </div>
  )
}