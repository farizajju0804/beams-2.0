"use client";
import { Spinner } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function RedirectMessage({ username }: { username: string | undefined }) {
  const [randomMessage, setRandomMessage] = useState("");

  const messages: string[] = [
    `you’re the sunshine in someone's life! ☀️`,
    `the world is better because you're in it! 🌍💫`,
    `you’ve got this - a little kindness goes a long way! 💪💛`,
    `today’s your day to shine. Don’t hold back! ✨`,
    `pause for a second because you’re amazing! 🏆`,
    `you are one of a kind. And that's your superpower! 🦸‍♂️💥`,
    `take a deep breath – you’re exactly where you need to be! 🌬️💖`,
    `you truly light up this world! 🌈✨`,
    `do you know you make the world feel like home? 🏡💫`,
    `you are a walking reminder that there is goodness in the world! 🌟💕`,
    `you have the kind of vibe that makes people feel happy! 🌻`,
    `the world’s brighter because you are in it!`,
    `your positive energy is contagious! ⚡️💖`,
    `the world’s a playground, don’t forget to have some fun today! 🎠😄`,
    `in case you’ve forgotten, you’re incredible! 🙌💛`,
    `you’ve got the kind of magic that makes ordinary moments extraordinary ✨`,
    `today’s a great day to celebrate how far you’ve come in life 🎉`,
    `you’re the reason someone’s smiling today! 😊💫`,
    `your kindness is like a ripple that turns into waves of goodness! 🌊💖`
  ];

  useEffect(() => {
    // Pick a random message when the component is mounted
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    const formattedMessage = username 
      ? `${username}, ${randomMsg}` 
      : randomMsg.charAt(0).toUpperCase() + randomMsg.slice(1); // Ensure first letter is uppercase if no username
    setRandomMessage(formattedMessage);
  }, [username]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-[200]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="text-center"
      >
        <Spinner />
        <p className="mx-4 text-lg font-medium text-[#a2a2a2]">{randomMessage}</p>
      </motion.div>
    </div>
  );
}
