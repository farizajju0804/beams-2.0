'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import ConnectionGame from './ConnectionGame';

interface ConnectionGameWrapperProps {
  id: string;
  image: string;
  answer: string;
  beamsTodayId: string;
  title: string;
  hint: string;
  username?: string;
  answerExplanation: string;
  solutionPoints: string[];
  isCompleted?: boolean;
  gameDate: Date;
}

const ConnectionGameWrapper: React.FC<ConnectionGameWrapperProps> = ({ 
  id, 
  image, 
  answer, 
  beamsTodayId, 
  title, 
  hint, 
  username = "Player", 
  answerExplanation, 
  solutionPoints, 
  isCompleted = false, 
  gameDate 
}) => {
    const [showRules, setShowRules] = useState<boolean>(!isCompleted);
  const [gameStarted, setGameStarted] = useState<boolean>(isCompleted);

 
  const handleStartGame = (): void => {
    setShowRules(false);
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <Modal 
        size="2xl"
        isOpen={showRules}
        onClose={() => {}}
        hideCloseButton
        placement='center'
        className="bg-background"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl mx-auto font-bold text-text">Before you Start</h2>
          </ModalHeader>
          <ModalBody className="text-text">
            <ol className="list-decimal space-y-4 pl-4">
             
              <li>
                <strong>Time Limit:</strong>
                <p className="mt-1 text-sm ">
                  You have only 60 seconds to answer each question. Make sure to think fast!
                </p>
              </li>
              <li>
                <strong>Important Warning:</strong>
                <p className="mt-1 text-sm opacity-80">
                  Do not refresh or go back during the game. Doing so will result in 0 Beams for the challenge.
                </p>
              </li>
              {/* <li>
                <strong>Jumbled Letters:</strong>
                <p className="mt-1 text-sm">
                  A 15-character string is provided as a visual clue. The answer is within these characters.
                </p>
              </li>
              <li>
                <strong>Hints Available:</strong>
                <p className="mt-1 text-sm ">
                  Hints are available if you get stuck, but using them will reduce your beams reward.
                </p>
              </li> */}
              
              
            </ol>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="warning"
              variant="shadow"
              onPress={handleStartGame}
              className="w-full text-black font-lg font-semibold"
            >
              I&apos;m Ready to Play!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <ConnectionGame
      id={id}
      image={image}
      answer={answer}
      beamsTodayId={beamsTodayId}
      title={title}
      hint={hint}
      username={username}
      answerExplanation={answerExplanation}
      solutionPoints={solutionPoints}
      isCompleted={isCompleted}
      gameDate={gameDate}
    />
  );
};

export default ConnectionGameWrapper;