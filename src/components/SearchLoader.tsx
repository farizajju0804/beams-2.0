"use client"

import { useCurrentUser } from "@/hooks/use-current-user"
import { Spinner } from "@nextui-org/react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

// Mocking the user object for demonstration; replace it with the actual currentUser() call.

// Predefined set of creative, fun messages.

export default function SearchLoader() {
  const [randomMessage, setRandomMessage] = useState("")
  const messages: any = [
    `Searching for something amazing... hang tight! 🔍✨`,
    `Good things come to those who wait... just a moment more! ⏳💫`,
    `We’re finding just the right results for you... stay tuned! 🌟`,
    `Almost there! Your perfect result is just around the corner... 🚀✨`,
    `Just a few more seconds... the best results are on their way! 🔄💡`,
    `Fetching your results... good things are coming! 🛠️💪`,
    `Hang tight! We're bringing the magic to your search... ✨🪄`,
    `Great results take a moment... thank you for your patience! 🙏💖`,
    `Results are almost here... your search is our priority! 🚀💫`,
    `Patience pays off... we're finding the best results for you! ⏳💖`,
    `Working on it... get ready for something awesome! 💡⚡️`,
    `Finding what you need... results incoming! 🔍💫`,
    `Just a little longer... your perfect result is loading! ⏳💡`,
    `Great things are on their way... we're almost done! 🚀✨`,
    `Hold tight! We're gathering the best results for you right now... 🛠️💫`,
    `Good things are worth waiting for... your results are on their way! ⏳🌟`,
    `We’re almost there... your search is in progress! 🔄💡`,
    `Hang in there! Great results are being pulled up for you... 💫🔍`,
    `Thanks for your patience... your search results are coming right up! 🙏💡`,
    `Stay tuned! We're about to deliver the results you’re waiting for... 📊✨`,
  ];
  

  useEffect(() => {
    // Pick a random message when the component is mounted
    setRandomMessage(messages[Math.floor(Math.random() * messages.length)])
  }, [])

  return (
    <div className="flex items-center justify-center bg-background z-[200]">
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
