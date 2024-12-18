'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Checkbox, Divider } from "@nextui-org/react";
import ConnectionGame from './ConnectionGame';
import { updatePopupPreference } from '@/actions/connection/connectionGame';
import { useRouter } from 'next/navigation';

interface ConnectionGameWrapperProps {
  id: string;
  firstImage: string;
  secondImage : string;
  thirdImage : string;
  referenceLink: string;
  answer: string;
  beamsTodayId: string;
  letterChoicesStudent : string[];
  letterChoicesNonStudent : string[];
  title: string;
  hint: string;
  username?: string;
  answerExplanation: string;
  solutionPoints: string[];
  isCompleted?: boolean;
  gameDate: Date;
  popupPreference : boolean;
}
const ConnectionGameWrapper: React.FC<ConnectionGameWrapperProps> = ({
  id,
  firstImage,
  secondImage,
  thirdImage,
  referenceLink,
  answer,
  beamsTodayId,
  title,
  hint,
  username = "Player",
  answerExplanation,
  solutionPoints,
  isCompleted = false,
  gameDate,
  popupPreference,
  letterChoicesNonStudent,
  letterChoicesStudent
}) => {
  const router = useRouter();
  const [showRules, setShowRules] = useState<boolean>(!isCompleted && popupPreference);
  const [gameStarted, setGameStarted] = useState<boolean>(isCompleted || !popupPreference);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  const handleStartGame = async (): Promise<void> => {
    setShowRules(false);
    setGameStarted(true);
    
    if (dontShowAgain) {
      await updatePopupPreference();
    }
  };

  const handleClose = () => {
    router.back();
  };

  if (!gameStarted) {
    return (
      <Modal
        size="2xl"
        isOpen={showRules}
        onClose={handleClose}
        placement='center'
        className="bg-background"
        isDismissable={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row justify-start items-center">
                <h2 className="text-xl md:text-2xl font-bold text-text">Before you Start</h2>
                
              </ModalHeader>
              <ModalBody className="text-text">
              <ol className="list-decimal space-y-4 pl-4 text-base font-bold">
                    <li>
                      <span className="font-bold">Time Limit</span>
                      <p className="mt-1 font-normal">
                        You have 60 seconds to complete the game.
                      </p>
                    </li>
                    <li>
                      <span className="font-bold">Important</span>
                      <p className="mt-1 font-normal">
                        Do not refresh or go back during the game. Doing so will result in 0 Beams.
                      </p>
                    </li>
                  </ol>
                  <Divider/>
                <div className="">
                  <Checkbox
                    color="warning"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                  >
                    Don&apos;t show this message again
                  </Checkbox>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="warning"
                  variant="shadow"
                  onPress={handleStartGame}
                  className="w-full text-black text-lg font-semibold"
                >
                  I&apos;m Ready to Play
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }

  return (
    <ConnectionGame
      id={id}
      firstImage={firstImage}
      secondImage={secondImage}
      thirdImage={thirdImage}
      referenceLink={referenceLink}
      answer={answer}
      title={title}
      hint={hint}
      letterChoiceStudent={letterChoicesStudent}
      letterChoiceNonStudent={letterChoicesNonStudent}
      username={username}
      answerExplanation={answerExplanation}
      solutionPoints={solutionPoints}
      isCompleted={isCompleted}
      gameDate={gameDate}
    />
  );
};

export default ConnectionGameWrapper;