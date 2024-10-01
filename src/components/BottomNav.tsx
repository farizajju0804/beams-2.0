"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Chart, BookSquare, Rank, Microscope, Cup } from "iconsax-react"
import { Spinner } from "@nextui-org/react"
import { useCurrentUser } from "@/hooks/use-current-user"

const navItems = [
  { icon: Microscope, label: "Beams Today", path: "/beams-today" },
  { icon: Chart, label: "Dashboard", path: "/dashboard" },
  { icon: BookSquare, label: "My Library", path: "/my-library" },
  { icon: Cup, label: "Levolution", path: "/levolution" },
  { icon: Rank, label: "Leaderboard", path: "/leaderboard" },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [selected, setSelected] = useState<number | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [randomMessage, setRandomMessage] = useState("")
  const user: any = useCurrentUser()

  const messages = [
    `${user?.firstName}, remember you're the sunshine in someone's cloudy day ☀️.`,
    `Hey ${user?.firstName}, the world seems better just knowing you're in it 🌍💫.`,
    `You know, ${user?.firstName}, even the stars can't shine without a little darkness 🌟.`,
    `${user?.firstName}, don't forget – a little kindness goes a long way. You've got this! 💪💛.`,
    `Just a reminder, ${user?.firstName}: you're doing way better than you think 👍😊.`,
    `${user?.firstName}, today's your day to sparkle. Don't hold back! ✨.`,
    `Hey ${user?.firstName}, pause for a second – you've been nothing short of amazing 🏆.`,
    `${user?.firstName}, the world's a better place because you're here 🌸.`,
    `You're one of a kind, ${user?.firstName}. And that's your superpower 🦸‍♂️💥.`,
    `Remember, ${user?.firstName}, even small steps can lead to great things 🚶‍♂️🌱.`,
    `${user?.firstName}, take a breath – you're exactly where you need to be 🌬️💖.`,
    `Hey ${user?.firstName}, did anyone tell you today? You're doing great 🌟.`,
    `${user?.firstName}, you light up this world more than you realize 🌈✨.`,
    `${user?.firstName}, you're not just a drop in the ocean, you're the whole ocean in a drop 🌊.`,
    `Hey ${user?.firstName}, you make the world feel like home 🏡💫.`,
    `${user?.firstName}, you're a walking reminder that good things happen every day 🌟💕.`,
    `You've got the kind of vibe that makes people feel better, ${user?.firstName} 🌻.`,
    `Hey ${user?.firstName}, just so you know, the world's a little brighter with you in it 🌞💫.`,
    `Reminder, ${user?.firstName}: the smallest moments often bring the biggest smiles 😊✨.`,
    `${user?.firstName}, your energy is contagious in the best way possible ⚡️💖.`,
    `The world's a playground, ${user?.firstName}, don't forget to have some fun today 🎠😄.`,
    `In case you forgot, ${user?.firstName}, you're already enough 🙌💛.`,
    `${user?.firstName}, you've got the kind of magic that makes ordinary moments extraordinary ✨.`,
    `Hey ${user?.firstName}, today's a good day to celebrate just how far you've come 🎉.`,
    `You're the reason someone's smiling today, ${user?.firstName}, keep that going 😊💫.`,
    `${user?.firstName}, you've got a whole lot of strength inside you 💪💖.`,
    `${user?.firstName}, your kindness is like a ripple that turns into waves of goodness 🌊💖.`,
  ]

  useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.path === pathname)
    setSelected(currentIndex !== -1 ? currentIndex : null)
  }, [pathname])

  useEffect(() => {
    if (redirecting) {
      setRandomMessage(messages[Math.floor(Math.random() * messages.length)])
    }
  }, [redirecting])

  const handleNavigation = (index: number) => {
    setSelected(index)
    setRedirecting(true)

  }

  return (
    <>
      <AnimatePresence>
        {redirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-background  z-[100]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="text-center"
            >
              <Spinner />
              <p className="mx-4 mt-4 text-lg font-medium text-[#a2a2a2]">{randomMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="md:hidden block bg-background shadow-defined-top z-[100] fixed bottom-0 left-0 right-0">
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
              <Link
                key={item.label}
                href={item.path}
                onClick={() => handleNavigation(index)}
              >
                <button
                  className="flex flex-col items-center justify-center w-fit h-12 relative"
                  disabled={redirecting}
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
                      variant={"Bold"}
                      color={selected === index ? "#f96f2e" : "#94A3B8"}
                    />
                  </motion.div>
                  {selected === index && (
          <motion.span
            className="text-[10px] mt-1 font-medium"
            animate={{
              color: "#f96f2e",
            }}
            style={{ zIndex: 1 }}
          >
            {item.label}
          </motion.span>
        )}
                </button>
              </Link>
            ))}
          </nav>
        </motion.div>
      </div>
    </>
  )
}