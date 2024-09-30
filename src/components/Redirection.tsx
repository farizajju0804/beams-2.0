"use client"

import { useCurrentUser } from "@/hooks/use-current-user"
import { Spinner } from "@nextui-org/react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

// Mocking the user object for demonstration; replace it with the actual currentUser() call.

// Predefined set of creative, fun messages.

export default function RedirectMessage() {
  const user:any = useCurrentUser();
  const [randomMessage, setRandomMessage] = useState("")
  const messages = [
    `${user.firstName}, remember you’re the sunshine in someone's cloudy day ☀️.`,
    `Hey ${user.firstName}, the world seems better just knowing you're in it 🌍💫.`,
    `You know, ${user.firstName}, even the stars can’t shine without a little darkness 🌟.`,
    `${user.firstName}, don’t forget – a little kindness goes a long way. You’ve got this! 💪💛.`,
    `Just a reminder, ${user.firstName}: you’re doing way better than you think 👍😊.`,
    `${user.firstName}, today’s your day to sparkle. Don’t hold back! ✨.`,
    `Hey ${user.firstName}, pause for a second – you've been nothing short of amazing 🏆.`,
    `${user.firstName}, the world’s a better place because you're here 🌸.`,
    `You’re one of a kind, ${user.firstName}. And that's your superpower 🦸‍♂️💥.`,
    `Remember, ${user.firstName}, even small steps can lead to great things 🚶‍♂️🌱.`,
    `${user.firstName}, take a breath – you’re exactly where you need to be 🌬️💖.`,
    `Hey ${user.firstName}, did anyone tell you today? You're doing great 🌟.`,
    `${user.firstName}, you light up this world more than you realize 🌈✨.`,
    `${user.firstName}, you’re not just a drop in the ocean, you’re the whole ocean in a drop 🌊.`,
    `Hey ${user.firstName}, you make the world feel like home 🏡💫.`,
    `${user.firstName}, you’re a walking reminder that good things happen every day 🌟💕.`,
    `You’ve got the kind of vibe that makes people feel better, ${user.firstName} 🌻.`,
    `Hey ${user.firstName}, just so you know, the world’s a little brighter with you in it 🌞💫.`,
    `Reminder, ${user.firstName}: the smallest moments often bring the biggest smiles 😊✨.`,
    `${user.firstName}, your energy is contagious in the best way possible ⚡️💖.`,
    `The world’s a playground, ${user.firstName}, don’t forget to have some fun today 🎠😄.`,
    `In case you forgot, ${user.firstName}, you’re already enough 🙌💛.`,
    `${user.firstName}, you’ve got the kind of magic that makes ordinary moments extraordinary ✨.`,
    `Hey ${user.firstName}, today’s a good day to celebrate just how far you’ve come 🎉.`,
    `You’re the reason someone’s smiling today, ${user.firstName}, keep that going 😊💫.`,
    `${user.firstName}, you’ve got a whole lot of strength inside you 💪💖.`,
    `${user.firstName}, your kindness is like a ripple that turns into waves of goodness 🌊💖.`,
  ];
  

  useEffect(() => {
    // Pick a random message when the component is mounted
    setRandomMessage(messages[Math.floor(Math.random() * messages.length)])
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-[200]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="text-center"
      >
        <Spinner/>
        <p className="mx-4 text-lg font-medium text-[#a2a2a2]">{randomMessage}</p>
      </motion.div>
    </div>
  )
}
