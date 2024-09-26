'use client'
import React from 'react'
import { AiFillFire, AiFillRocket, AiFillTrophy, AiFillFlag, AiFillBulb, AiFillHeart, AiOutlineGift, AiOutlineStar, AiFillQuestionCircle, AiFillStar, AiFillGift } from 'react-icons/ai'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'

const AchievementsModal = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  const RuleItem = ({ icon, title, description }: any) => (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-80">{description}</p>
      </div>
    </div>
  );

  const renderOverlay = () => {
    return (
      <Modal 
        size='2xl'
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        backdrop="blur"
        className="bg-background"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-text">Unlock Achievements & Earn Badges</h2>
              </ModalHeader>
              <ModalBody className="text-text">
                <div className="space-y-8">
                
                  <RuleItem 
                    icon={<AiFillFire className="text-orange-500" size={24} />}
                    title="Complete Activities & Earn Badges"
                    description="Badges are earned through completing specific tasks. Each badge comes with unique activities, and extra beams await upon completion!"
                  />
                  <RuleItem 
                    icon={<AiFillTrophy className="text-green-500" size={24} />}
                    title="Showcase Your Achievements"
                    description="Your earned badges will be proudly displayed on your dashboard. Flaunt them and show the world your progress!"
                  />
                  <RuleItem 
                    icon={<AiFillGift className="text-blue-500" size={24} />}
                    title="Exclusive Rewards for Each Badge"
                    description="Each completed badge brings with it not only bragging rights but exclusive rewards and extra beams to boost your progress!"
                  />
                 
                  <RuleItem 
                    icon={<AiFillHeart className="text-red-500" size={24} />}
                    title="Stay Inspired"
                    description="Celebrate each step of your journey and stay motivated as you climb higher."
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="warning" 
                  variant="shadow"
                  onPress={onClose}
                  className="mt-4 w-full font-lg font-semibold"
                >
                  Let&apos;s Unlock Some Badges!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className='w-full flex justify-between pl-6 my-4 pr-6'>
      <div className="flex flex-col items-start">
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Achievements</h1>
        <div className="border-b-2 border-brand mb-3 w-[60px]"></div>
      </div>
      <Button isIconOnly className='bg-transparent text-[#888888] cursor-pointer' onPress={onOpen}>
        <AiFillQuestionCircle size={24} />
      </Button>
      {renderOverlay()} 
    </div>
  )
}

export default AchievementsModal;
