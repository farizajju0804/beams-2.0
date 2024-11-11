import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { Clock, ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';

const TimeUpModal = ({ 
  isOpen, 
  onClose, 
  username = "Player", 
  answer = "Example",
  beamsTodayId 
}:any) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement='center'
      className=""
      classNames={{
        wrapper : "z-[250]"
      }}
    >
      <ModalContent>
        <div className="bg-background rounded-t-lg p-6">
          <ModalHeader className="flex items-center justify-center gap-3 p-0">
            <Clock className="w-8 h-8 text-brand" />
            <span className="text-2xl font-bold bg-gradient-to-r from-brand to-yellow bg-clip-text text-transparent">
              Time&apos;s Up!
            </span>
          </ModalHeader>
        </div>

        <ModalBody className="px-6 py-2">
          <div className="flex flex-col items-center text-center gap-6">
            <Image
              src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1731329754/achievements/clock-6731feb8097a8_pxasrh.webp"
              alt="Time's up illustration"
              width={200}
              height={200}
              className="shadow-defined mb-4 "
            />
            
            <div className="space-y-4">
              <p className="text-xl font-medium text-text">
                Aww, {username}! Just ran out of time! 🕒
              </p>
              
              <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-grey-2 mb-2">
                  The correct answer was:
                </p>
                <p className="text-lg font-bold text-primary">
                  {answer}
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <p className="text-base text-grey-2">
                  Don&apos;t worry! Every attempt makes you stronger. 💪
                </p>
               
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-center pb-6">
          <Button
            color="primary"
            variant='shadow'
            className="px-8 py-2  text-white font-medium rounded-full transition-all duration-200 flex items-center gap-2"
            onPress={onClose}
          >
            Continue 
            <ArrowRight2 className="w-4 h-4" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TimeUpModal;