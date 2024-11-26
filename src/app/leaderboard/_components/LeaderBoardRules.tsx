'use client'
import {  Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import {  AiFillClockCircle, AiFillCrown, AiFillThunderbolt, AiFillFire } from "react-icons/ai";
import { PiNumberCircleThreeDuotone } from 'react-icons/pi';

const RuleItem = ({ icon, title, description }:any) => (
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

export const LeaderboardRules = ({isOpen,onOpenChange}:any) => {
    
    return (
      <Modal 
      size='2xl'
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        backdrop="blur"
        className="bg-background"
        classNames={{
          wrapper : 'z-[250]'
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl mx-auto font-bold text-text">Leaderboard Rules</h2>
              </ModalHeader>
              <ModalBody className="text-text">
              <div className="space-y-4">
            <RuleItem 
              icon={<AiFillClockCircle className="text-blue-500" size={24} />}
              title="Weekly Competition"
              description={`Starts every Saturday at 11:00 AM (US Pacific Time) and ends the following Saturday at 10:59 AM (US Pacific Time).`}
            />
            <RuleItem 
              icon={<PiNumberCircleThreeDuotone className="text-green-500 text-2xl" />}
              title="Minimum Participation"
              description="Leaderboard results will only be announced when there are at least 3 entries in the current week."
              />
            <RuleItem 
              icon={<AiFillFire className="text-red-500" size={24} />}
              title="Point Accumulation"
              description="Only beams accumulated during the competition period will count."
            />
           <RuleItem 
            icon={<AiFillThunderbolt className="text-green-500" size={24} />}
            title="Tiebreakers"
            description="If there are ties in beam count, all users with the same beams will receive the same rank. However, for the weekly leaderboard display, the user who accumulated beams first will appear higher, showing only the top entry for each beam count."
          />

            <RuleItem 
              icon={<AiFillCrown className="text-yellow" size={24} />}
              title="Leaderboard Display"
              description="The top 10 users will be featured on the leaderboard each week."
            />
          </div>

              </ModalBody>
              <ModalFooter>
                   <Button 
                  color="warning" 
                  variant="shadow"
                  onPress={onClose}
                  className="mt-4 w-full text-black font-semibold text-lg"
                >
                  Got it!
                </Button>
                </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };