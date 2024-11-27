'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button, Chip } from '@nextui-org/react'
import { markFactAsCompleted2 } from '@/actions/fod/fod'
import Link from 'next/link'
import { GoLinkExternal } from 'react-icons/go'

interface FlipFactCardProps {
  fact: any;
  index: number;
  userId: string;
}

export function FlipFactCard({ fact, index, userId }: FlipFactCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const hasBothLinks = fact.referenceLink1 && fact.referenceLink2;
 
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const markAsCompleted = async () => {
      if (isFlipped && !fact.isCompleted) {
        try {
          const result = await markFactAsCompleted2(userId, fact.id);
          if (result) {
            console.log('Fact marked as completed');
          }
        } catch (error) {
          console.error("Error marking fact as completed:", error);
        }
      }
    };

    markAsCompleted();
  }, [isFlipped, fact.isCompleted, fact.id, userId]);

  if (!isMounted || !fact) {
    return null;
  }

  return (
    <motion.div
      className="w-80 h-80 cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ 
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front of card - Title and Thumbnail */}
        <Card
          className="absolute w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden'
          }}
        >
          <CardContent className="p-0 pb-3 flex gap-3 flex-col items-center justify-start h-full">
            <div className="w-full h-64 relative overflow-hidden rounded-lg">
              <Image
                src={fact.thumbnail}
                alt={fact.title}
                width={2000}
                height={2000}
                className="object-cover w-full h-64"
              />
            </div>
            <div className="text-xl font-poppins font-medium text-center ">
              {fact.title}
            </div>
            <div className="flex  flex-wrap gap-2 ">
          {fact.hashtags.map((tag:any) => (
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
          ))}
           </div>
            <div className="flex items-center gap-2">
              <Chip
                style={{ backgroundColor: fact.category.color, color: '#fff' }}
                classNames={{
                  content: "text-xs font-semibold"
                }}
                as={Link}
                href={`/beams-facts/category/${fact.category.name}`}
              >
                {fact.category.name}
              </Chip>
            </div>
            <div className="flex gap-4">
          {fact.referenceLink1 && (
            <div className="flex flex-col items-center">
              <Button as={Link} 
              href={fact.referenceLink1} target="_blank" rel="noopener noreferrer"
              isIconOnly variant="light" size="sm">
                  <GoLinkExternal className="w-5 h-5" />
                
                {hasBothLinks && (
                <span className="font-medium text-[8px] absolute  bottom-[2px] right-[5px]">1</span>
              )}
              </Button>
            
            </div>
          )}
          {fact.referenceLink2 && (
            <div className="flex flex-col items-center">
              <Button as={Link} 
              href={fact.referenceLink1} target="_blank" rel="noopener noreferrer"
              isIconOnly variant="light" size="sm">
                  <GoLinkExternal className="w-5 h-5" />
                  {hasBothLinks && (
                  <span className="font-medium text-[8px] absolute  bottom-[2px] right-[5px]">2</span>
              )}
              </Button>
             
            </div>
          )}
        </div>
          </CardContent>
        </Card>

        {/* Back of card - Full Image */}
        <Card 
          className="absolute w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <CardContent className="p-4 h-full">
            <div className="relative w-full h-full">
              <Image
                src={fact.finalImage}
                alt={fact.title}
                width={2000}
                height={2000}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}