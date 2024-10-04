"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { CloseIcon } from "@/app/beams-today/_components/BeamsTodayRecents"

type AnimatedImageCardProps = {
  imageUrl: string
  name: string
}

export default function AnimatedImageCard({ imageUrl, name }: AnimatedImageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  return (
    <>
      <div className="overflow-hidden rounded-2xl shadow-defined bg-background">
        <motion.div
          className="relative w-full h-80 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleExpand}
        >
          <Image
            src={imageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
          />
        </motion.div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-center">{name}</h3>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={toggleExpand}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-background rounded-3xl shadow-defined w-full max-w-3xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[380px]">
                <Image
                  src={imageUrl}
                  alt={name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-t-lg"
                />
              </div>
              <div className="bg-background">
                <h2 className="text-lg md:text-2xl text-center font-bold mb-2">{name}</h2>
              </div>
              <motion.button
                className="absolute top-2 right-2 p-2 bg-background/50 rounded-full text-foreground hover:bg-background/75 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleExpand}
              >
                <CloseIcon />
               
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}