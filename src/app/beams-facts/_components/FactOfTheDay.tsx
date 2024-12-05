'use client'
import React, { useRef, useEffect } from "react";
import { markFactAsCompleted } from "@/actions/fod/fod";
import { AiFillQuestionCircle, AiFillStar } from 'react-icons/ai';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { RiFileListLine } from 'react-icons/ri';
import { GiCardRandom } from 'react-icons/gi';
import { FactDisplay } from "./Fact";

interface FactOfTheDayProps {
  userId: string;
  fact: any;
}

const RuleItem = ({ icon, title, description }: any) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 mt-1">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  </div>
);

const FactOfTheDay: React.FC<FactOfTheDayProps> = ({ userId, fact }) => {
 
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const clientDate = new Date().toLocaleDateString("en-CA");
  const revealLock = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  const handleCompletion = async () => {
    if (fact?.completed || revealLock.current || !fact) {
      return;
    }

    revealLock.current = true;
    

    try {
      const result = await markFactAsCompleted(userId, fact.id, clientDate);
      if (result) {
        // Handle successful completion
      }
    } catch (error) {
      console.error("Error marking fact as completed:", error);
    } finally {
      revealLock.current = false;
    }
  };

  useEffect(() => {
    if (!fact?.completed && fact.id) {
      // Start timer for 10-second completion
      timeoutRef.current = setTimeout(() => {
        handleCompletion();
      }, 10000);

    

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
      };
    }
  }, [fact?.completed]);

  const renderOverlay = () => {
    return (
      <Modal 
        size='2xl'
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        backdrop="blur"
        className="bg-background"
        classNames={{
          wrapper: 'z-[110]'
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl mx-auto font-bold text-text">Beams Facts</h2>
              </ModalHeader>
              <ModalBody className="text-text">
                <div className="space-y-8">
                  <RuleItem 
                    icon={<AiFillStar className="text-red-500" size={24} />}
                    title="Engaging Daily Facts"
                    description="Discover fun and interesting facts daily, each consumable in less than 30 seconds."
                  />
                  <RuleItem 
                    icon={<GiCardRandom className="text-blue-500" size={24} />}
                    title="Scratch Card Mechanism"
                    description="Reveal the fact of the day through an interactive scratch card experience."
                  />
                  <RuleItem 
                    icon={<RiFileListLine className="text-green-500" size={24} />}
                    title="Access Past Facts"
                    description="Review and explore past facts to stay informed and never miss out."
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
                  Start Discovering!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };


  return (
    <div 
      className="w-full mb-2 text-left relative max-w-lg md:rounded-3xl mx-auto"
    >
      <div className="px-6 lg:px-0 flex justify-between items-start lg:items-center">
        <div className="w-full flex-1">
          <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">
            Fact Of The Day 
          </h1>
          <div className="border-b-2 border-brand mb-4 w-full" style={{ maxWidth: '10%' }}></div>
        </div>
        <Button isIconOnly className='bg-transparent text-[#a2a2a2] cursor-pointer' onPress={onOpen}>
          <AiFillQuestionCircle size={24} /> 
        </Button>
        {renderOverlay()} 
      </div>
      {fact.id ? 
        <FactDisplay
          id={fact.id}
          date={fact.date}
          title={fact.title}
          fact={fact.fact}
          whyItsImportant={fact.whyItsImportant}
          thumbnail={fact.thumbnail}
          referenceLink1={fact.referenceLink1}
          referenceLink2={fact.referenceLink2}
          hashtags={fact.hashtags}
          category={fact.category}
        />
        : (
          <p className="text-lg text-left md:text-center font-semibold text-default-500 pl-6 md:pl-0">
            No fact available for today
          </p>
        )}
    </div>
  );
};

export default FactOfTheDay;