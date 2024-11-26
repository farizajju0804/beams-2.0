'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Chip } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from 'framer-motion'
import FormattedDate from '@/app/beams-today/_components/FormattedDate'
import { Hashtag } from 'iconsax-react'
import { GoLinkExternal } from 'react-icons/go'

interface FactModalProps {
  isOpen: boolean
  onClose: () => void
  fact: {
    title: string
    date: Date
    finalImage: string
    category: {
      name: string
      color: string
    }
    hashtags: string[]
    referenceLink1?: string
    referenceLink2?: string,
    completed : boolean
  }
}

export function FactModal({ isOpen, onClose, fact }: FactModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }
  const hasBothLinks = fact.referenceLink1 && fact.referenceLink2;
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
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
                      src={fact.finalImage}
                      alt={fact.title}
                      width={1000}
                      height={1000}
                      className="object-cover w-full h-full"
                      
                    />
                    
                  </motion.div>
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
                          variant="bordered"
                          size="sm"
                          startContent={<Hashtag className="w-3 h-3" />}
                        >
                          {tag}
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
                        <Button as={Link} 
                        href={fact.referenceLink1} target="_blank" rel="noopener noreferrer"
                        isIconOnly variant="ghost" size="sm">
                            <GoLinkExternal className="w-3 h-3" />
                            
                            {hasBothLinks && (
                            <span className="font-medium text-[8px] absolute  bottom-[2px] right-[5px]">1</span>
                        )}
                        </Button>
                        
                        </div>
                    )}
                    {fact.referenceLink2 && (
                        <div className="flex flex-col items-center">
                        <Button as={Link} 
                        href={fact.referenceLink2} target="_blank" rel="noopener noreferrer"
                        isIconOnly variant="ghost" size="sm">
                            <GoLinkExternal className="w-3 h-3" />
                            {hasBothLinks && (
                            <span className="font-medium text-[8px] absolute  bottom-[2px] right-[5px]">2</span>
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