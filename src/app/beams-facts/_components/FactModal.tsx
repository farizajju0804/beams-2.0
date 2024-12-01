'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Chip } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from 'framer-motion'
import FormattedDate from '@/app/beams-today/_components/FormattedDate'
import { GoLinkExternal } from 'react-icons/go'
import { markFactAsCompleted2 } from '@/actions/fod/fod'
import { useTheme } from 'next-themes'

interface FactModalProps {
  isOpen: boolean
  onClose: () => void
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

export function FactModal({ isOpen, onClose, fact, userId }: FactModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const clientDate = new Date().toLocaleDateString("en-CA");
  const {theme} = useTheme()
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const markAsCompleted = async () => {
      if (isOpen && !fact.completed) {
        try {
          const result = await markFactAsCompleted2(userId, fact.id);
          if (result) {
      
          }
        } catch (error) {
          console.error("Error marking fact as completed:", error);
        }
      }
    };

    markAsCompleted();
  }, [isOpen, fact.completed, fact.id, userId, clientDate]);

  if (!isMounted) {
    return null
  }

  const hasBothLinks = fact.referenceLink1 && fact.referenceLink2;

  const currentImage = theme === "light" ? fact.finalImage : fact.finalImageDark;
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      placement="center"
      className="bg-background"
    >
      <ModalContent>
        {(onClose) => (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ModalHeader className="flex flex-col gap-1 pt-4 px-8 pb-0">
                  <h2 className="text-xl md:text-2xl font-bold">{fact.title}</h2>
                  <p className="text-sm text-default-500 flex items-center">
                    <FormattedDate date={fact.date.toISOString().split('T')[0]}/>
                  </p>
                </ModalHeader>
                <ModalBody className="px-4 gap-0 py-0">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="relative aspect-auto w-full"
                  >
                    <Image
                      src={currentImage}
                      alt={fact.title}
                      width={1000}
                      height={1000}
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                  <Chip
           classNames={{
            content : "text-xs font-semibold"
        }}
        as={Link}
        href={`/beams-facts/category/${fact.category.name}`}
            className="text-xs text-white font-semibold mt-1 mb-3 py-1 mx-4 "
            style={{ backgroundColor: `${fact.category.color}` }}
          >
            {fact.category.name}
          </Chip>
                  <div className='flex w-full justify-between mb-4 items-center'>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="flex flex-wrap px-4 gap-2"
                    >
                      {fact.hashtags.map((tag, index) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.2 }}
                        >
                           <Chip 
                            key={tag}
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
                      className="flex flex-wrap gap-2 px-4"
                    >
                      <div className="flex gap-4">
                        {fact.referenceLink1 && (
                          <div className="flex flex-col items-center">
                            <Button 
                              as={Link} 
                              href={fact.referenceLink1} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              isIconOnly 
                              variant="light" 
                              size="sm"
                            >
                              <GoLinkExternal className="w-5 h-5" />
                              {hasBothLinks && (
                                <span className="font-medium text-[8px] absolute bottom-[2px] right-[5px]">1</span>
                              )}
                            </Button>
                          </div>
                        )}
                        {fact.referenceLink2 && (
                          <div className="flex flex-col items-center">
                            <Button 
                              as={Link} 
                              href={fact.referenceLink2} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              isIconOnly 
                              variant="light" 
                              size="sm"
                            >
                              <GoLinkExternal className="w-5 h-5" />
                              {hasBothLinks && (
                                <span className="font-medium text-[8px] absolute bottom-[2px] right-[5px]">2</span>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </ModalBody>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </ModalContent>
    </Modal>
  )
}