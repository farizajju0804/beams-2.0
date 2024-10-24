"use client"

import { Spinner } from "@nextui-org/react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

// Mocking the user object for demonstration; replace it with the actual currentUser() call.

// Predefined set of creative, fun messages.

export default function RedirectMessage() {
  const [randomMessage, setRandomMessage] = useState("")
  const messages:any = [
    `Remember you’re the sunshine in someone's cloudy day ☀️.`,
    `The world seems better just knowing you're in it 🌍💫.`,,
    `Don’t forget – a little kindness goes a long way. You’ve got this! 💪💛.`,
    `Just a reminder, you’re doing way better than you think 👍😊.`,
    `Today’s your day to sparkle. Don’t hold back! ✨.`,
    `Pause for a second – you've been nothing short of amazing 🏆.`,
    `The world’s a better place because you're here 🌸.`,
    `You’re one of a kind. And that's your superpower 🦸‍♂️💥.`,
    `Remember, even small steps can lead to great things 🚶‍♂️🌱.`,
    `Take a breath – you’re exactly where you need to be 🌬️💖.`,
    `Hey, did anyone tell you today? You're doing great 🌟.`,
    `You light up this world more than you realize 🌈✨.`,
    `You’re not just a drop in the ocean, you’re the whole ocean in a drop 🌊.`,
    `Hey, you make the world feel like home 🏡💫.`,
    `You’re a walking reminder that good things happen every day 🌟💕.`,
    `You’ve got the kind of vibe that makes people feel better 🌻.`,
    `Hey, just so you know, the world’s a little brighter with you in it 🌞💫.`,
    `Reminder: the smallest moments often bring the biggest smiles 😊✨.`,
    `Your energy is contagious in the best way possible ⚡️💖.`,
    `The world’s a playground, don’t forget to have some fun today 🎠😄.`,
    `In case you forgot, you’re already enough 🙌💛.`,
    `You’ve got the kind of magic that makes ordinary moments extraordinary ✨.`,
    `Hey, today’s a good day to celebrate just how far you’ve come 🎉.`,
    `You’re the reason someone’s smiling today, keep that going 😊💫.`,
    `You’ve got a whole lot of strength inside you 💪💖.`,
    `Your kindness is like a ripple that turns into waves of goodness 🌊💖.`,
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
