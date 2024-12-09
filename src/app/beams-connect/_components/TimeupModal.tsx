import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { Clock, ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';

interface TimeUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  answer?: string;
  isAnswerWrong: boolean;
  
}

const TimeUpModal: React.FC<TimeUpModalProps> = ({ 
  isOpen, 
  onClose, 
  username = "Player", 
  answer = "Example",
  isAnswerWrong = false
}) => {

  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement='center'
      className=""
      classNames={{
        wrapper: "z-[250]"
      }}
    >
      <ModalContent>
        <div className="bg-background rounded-t-lg p-6">
          <ModalHeader className="flex items-center justify-center gap-3 p-0">
            <span className="text-2xl font-bold text-text">
              {isAnswerWrong ? 'Wrong Answer' : "Time's Up!"}
            </span>
          </ModalHeader>
        </div>

        <ModalBody className="px-6 py-2">
          <div className="flex flex-col items-center text-center gap-6">
            <Image
              src={isAnswerWrong 
                ? 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1733749154/Beams%20Connect/utils/wrong-answer_n9k0gj.webp' 
                : 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1731329754/achievements/clock-6731feb8097a8_pxasrh.webp'
              }
              alt="Time's up illustration"
              width={200}
              height={200}
              className="mb-4"
            />
            
            <div className="space-y-4">
              <p className="text-lg font-medium text-text">
                {isAnswerWrong 
                  ? `Oops, ${username}, that's not correct! Keep going, you'll nail it next time!` 
                  : `Oops, ${username}! You just ran out of time!`
                }
              </p>
              
              <div className="bg-grey-3 p-4 rounded-lg">
                <p className="text-sm text-grey-2 mb-2">
                  The correct answer is:
                </p>
                <p className="text-lg font-bold text-primary">
                  {answer}
                </p>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-center pb-6">
          <Button
            color="primary"
            variant='shadow'
            className="px-8 py-2 text-white font-semibold text-lg transition-all duration-200 flex items-center gap-2"
            onPress={onClose}
          >
              I&apos;ll Nail It Next Time!
            <ArrowRight2 className="w-4 h-4" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TimeUpModal;