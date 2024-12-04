'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from "next/image"
import Link from "next/link"
import { Chip } from "@nextui-org/react"
import { GoLinkExternal } from 'react-icons/go'
import { CloseCircle } from 'iconsax-react'
import FormattedDate from '@/app/beams-today/_components/FormattedDate'
import { markFactAsCompleted2 } from '@/actions/fod/fod'
import { useTheme } from 'next-themes'



interface FactModalProps {
  isOpen: boolean
  onClose: (e?: React.MouseEvent) => void
  fact: {
    id: string
    title: string
    date: Date
    finalImage: string
    finalImageDark: string
    category: {
      name: string
      color: string
    }
    hashtags: string[]
    referenceLink1?: string
    referenceLink2?: string,
    completed: boolean
  }
  userId: string
}


const useOutsideClick = (ref: React.RefObject<HTMLDivElement>, callback: Function) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
export function FactModal({ isOpen, onClose, fact, userId }: FactModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const clientDate = new Date().toLocaleDateString("en-CA")
  const {theme} = useTheme()

  

  useEffect(() => {
    setIsMounted(true)
  }, [])

 
  useEffect(() => {
    const markAsCompleted = async () => {
      if (isOpen && !fact.completed) {
        try {
          await markFactAsCompleted2(userId, fact.id);
        } catch (error) {
          console.error("Error marking fact as completed:", error);
        }
      }
    };

    markAsCompleted();
  }, [isOpen, fact.completed, fact.id, userId, clientDate]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isMounted || !isOpen) return null;

  const hasBothLinks = fact.referenceLink1 && fact.referenceLink2;
  const currentImage = theme === "light" ? fact.finalImage : fact.finalImageDark;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };
  
  
  return (
    <div   onClick={handleBackdropClick}
    onMouseUp={handleBackdropClick}
    onMouseDown={handleBackdropClick} 
    className="fixed inset-0 z-[250] flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div className="relative z-50 my-auto w-full max-w-lg mx-auto h-auto">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} 
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              className="relative flex flex-col my-auto h-auto mx-0 md:mx-4 rounded-none md:rounded-lg bg-background shadow-xl overflow-y-auto"
            >
              <button
                onClick={onClose}
      
                className="absolute top-2 left-[calc(100%-32px)] text-default-500 z-50 rounded-full p-1 transition-colors"
              >
                <CloseCircle variant='Bold' className="h-5 w-5" />
                <span className="sr-only">Close modal</span>
              </button>

              <div className="p-4 flex flex-col">
                <div className="flex px-3 lg:px-6 flex-col gap-1">
                  <h2 className="text-xl md:text-2xl font-bold">{fact.title}</h2>
                  <p className="text-sm text-default-500 flex items-center">
                    <FormattedDate date={fact.date.toISOString().split('T')[0]}/>
                  </p>
                </div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="relative mt-4"
                >
                  <Image
                    src={currentImage}
                    alt={fact.title}
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </motion.div>

                <div className="mt-4">
                  <Chip
                    classNames={{
                      content: "text-xs font-semibold"
                    }}
                    as={Link}
                    href={`/beams-facts/category/${fact.category.name}`}
                    className="text-xs ml-3 text-white font-semibold py-1"
                    style={{ backgroundColor: `${fact.category.color}` }}
                  >
                    {fact.category.name}
                  </Chip>

                  <div className="flex w-full px-3 justify-between mt-4 items-center">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="flex flex-wrap gap-2"
                    >
                      {fact.hashtags.map((tag, index) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.2 }}
                        >
                          <Chip 
                            size="sm"
                            variant="flat" 
                            className="text-xs"
                            as={Link}
                            href={`/beams-facts/tag/${tag}`}
                          >
                            #{tag}
                          </Chip>
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                      className="flex gap-4"
                    >
                      {fact.referenceLink1 && (
                        <Link 
                          href={fact.referenceLink1}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <GoLinkExternal className="w-5 h-5" />
                          {hasBothLinks && (
                            <span className="font-medium text-[8px] absolute bottom-[2px] right-[5px]">1</span>
                          )}
                        </Link>
                      )}
                      {fact.referenceLink2 && (
                        <Link
                          href={fact.referenceLink2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <GoLinkExternal className="w-5 h-5" />
                          {hasBothLinks && (
                            <span className="font-medium text-[8px] absolute bottom-[2px] right-[5px]">2</span>
                          )}
                        </Link>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}