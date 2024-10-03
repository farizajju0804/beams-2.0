import React from 'react';
import { Modal, Button, ModalContent, Image } from "@nextui-org/react";
import { FaLightbulb } from 'react-icons/fa';

interface StreakModalProps {
 
  streakDay: number;
  streakMessage: string;
  isOpen: boolean;
  onClose: () => void;
  onCTA: () => void;
  ctaText: string;
}

export default function StreakModal({ 
 
  streakDay, 
  streakMessage, 
  isOpen, 
  onClose, 
  onCTA, 
  ctaText 
}: StreakModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="2xl"
      classNames={{
        base: "rounded-3xl",
        wrapper: "z-[110]",
      }}
    >
      <ModalContent>
        <div className="px-6 py-10 w-full flex flex-col items-center">
          <div className='flex w-full items-center flex-col mb-4'>
            <Image
              src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1727954482/achievements/flame-3d_mu1kmu.webp"
              alt="Streak Fire"
              width={0}
              height={0}
              className="w-full h-40"
            />
            <div className="flex items-center justify-center text-text -mt-4 text-[80px] font-bold">
              {streakDay}
            </div>
            <h2 className="text-2xl font-semibold text-text mb-8">Day Streak</h2>
          </div>
          
          <div className="flex justify-between w-full max-w-md mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div key={day} className="flex flex-col items-center">
                <span className="text-sm text-grey-2 mb-2">{day}</span>
                <Button 
                  isIconOnly 
                  variant='shadow' 
                  color={day <= streakDay ? 'primary' : 'default'} 
                  className={`text-xl p-2 h-fit min-w-0 ${day <= streakDay ? ' text-white' : 'bg-transparent text-grey-1'}`}
                >
                  <FaLightbulb />
                </Button>
              </div>
            ))}
          </div>
          
          <p className="text-center text-text mb-8 max-w-md text-lg font-semibold">
       
            {streakMessage}
          </p>
          
          <Button
            color="warning"
            variant="shadow"
            onPress={onCTA}
            className="w-full max-w-sm text-lg text-black font-semibold py-3 rounded-lg"
          >
            {ctaText}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}