'use client'
import React from 'react'
import { AiFillFire, AiFillRocket, AiFillTrophy, AiFillFlag, AiFillBulb, AiFillHeart, AiFillQuestionCircle } from 'react-icons/ai'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { FaFlag } from 'react-icons/fa'

const LevelsModal = () => {
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
        hideCloseButton={true}
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        backdrop="blur"
        className="bg-background"
        classNames={{
          wrapper : 'z-[110]'
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-text">Level Up & Earn Beams</h2>
              </ModalHeader>
              <ModalBody className="text-text">
                <div className="space-y-8">
                  <RuleItem 
                    icon={<AiFillRocket className="text-blue-500" size={24} />}
                    title="Progress Through Levels"
                    description="As you gather more beams, you will level up! Keep pushing to reach higher levels!"
                  />
                  <RuleItem 
                    icon={<AiFillFire className="text-red-500" size={24} />}
                    title="Earn Beams Through Activities"
                    description="Earn beams by engaging in content, and participating in poll. The more active you are, the faster you level up!"
                  />
                  <RuleItem 
                    icon={<FaFlag className="text-green-500" size={24} />}
                    title="Unlock Achievements"
                    description="Achieve special badges and milestones as you reach certain levels. These will be a mark of your hard work and dedication!"
                  />
                  {/* <RuleItem 
                    icon={<AiFillTrophy className="text-yellow" size={24} />}
                    title="Reach Level Milestones"
                    description="Hit specific beam goals to level up. Each level requires a certain number of beams."
                  /> */}
                  {/* <RuleItem 
                    icon={<AiFillBulb className="text-purple" size={24} />}
                    title="Exclusive Level Rewards"
                    description="As you progress through the levels, you'll earn exclusive rewards like badges, titles, and even special content!"
                  /> */}
                  <RuleItem 
                    icon={<AiFillHeart className="text-pink-500" size={24} />}
                    title="Stay Motivated"
                    description="Every time you level up, you get closer to future! Don’t forget to check out your achievements and celebrate your progress!"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="warning" 
                  variant="shadow"
                  onPress={onClose}
                  className="mt-4 w-full text-black font-lg font-semibold"
                >
                  I&apos;m Ready to Level Up!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className='w-full flex justify-between px-4 md:px-8 my-4'>
      <div className="flex flex-col items-start">
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Levels</h1>
        <div className="border-b-2 border-brand mb-3 w-[60px]"></div>
      </div>
      <Button isIconOnly className='bg-transparent text-[#a2a2a2] cursor-pointer' onPress={onOpen}>
        <AiFillQuestionCircle size={24} />
      </Button>
      {renderOverlay()} 
    </div>
  )
}

export default LevelsModal
