import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@nextui-org/react';
import Image from 'next/image';

interface Level {
  levelNumber: number;
  maxPoints: number;
}

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  newPoints: number;
  caption: string;
  levelUp: boolean;
  currentLevel: Level;
  nextLevel: Level;
  currentPoints : number
}

const motivationalMessages: string[] = [
    "You're on fire! 🔥 Keep blazing through those lessons!",
    "Wow! You're learning faster than a cheetah on a caffeine rush! ☕️🐆",
    "You're not just smart, you're brilliant! 🌟 Einstein would be jealous!",
    "You're collecting points like a squirrel hoarding nuts for winter! 🐿️",
    "Your brain must be huge! 🧠 How do you even fit it in your head?",
    "You're not just climbing the learning ladder, you're taking the express elevator! 🚀",
    "If knowledge was a currency, you'd be Jeff Bezos rich! 💰",
    "Your dedication is so bright, I need sunglasses! 😎",
    "You're not just reaching for the stars, you're becoming one! ⭐️",
    "Your progress is more impressive than a cat learning to bark! 🐱🐶",
    "You're absorbing knowledge like a sponge in an ocean of wisdom! 🌊🧽",
    "If learning was an Olympic sport, you'd be taking home the gold! 🥇",
    "You're not just thinking outside the box, you've built a rocket ship! 🚀📦",
    "Your brain must be doing push-ups because it's getting stronger every day! 💪🧠",
    "You're leveling up faster than a video game character with cheat codes! 🎮",
    "Your curiosity is more infectious than a yawn in a boring meeting! 🥱😃",
    "You're not just connecting dots, you're creating constellations! ✨",
    "Your learning curve is so steep, it's practically vertical! 📈",
    "You're not just breaking records, you're setting new standards! 🏆",
    "If enthusiasm was electricity, you could power a small city! ⚡️🏙️"
  ];

  const RewardsModal: React.FC<RewardsModalProps> = ({ 
    isOpen, 
    onClose, 
    points, 
    newPoints, 
    levelUp, 
    currentLevel, 
    nextLevel,
    caption,
    currentPoints
  }) => {
    const [displayedPoints, setDisplayedPoints] = useState(points);
    const [message, setMessage] = useState<string>('');
    const audioRef = React.useRef<HTMLAudioElement>(null);
  
    const playLevelUpSound = useCallback(() => {
      if (audioRef.current) {
        audioRef.current.play();
        console.log('Playing level up sound');
      }
    }, []);
  
    const incrementPoints = useCallback(() => {
      const incrementStep = Math.ceil((newPoints - points) / 20);
      let currentPoints = points;
      const interval = setInterval(() => {
        currentPoints = Math.min(currentPoints + incrementStep, newPoints);
        setDisplayedPoints(currentPoints);
        if (currentPoints >= newPoints) {
          clearInterval(interval);
          console.log('Points increment completed:', currentPoints);
        }
      }, 50);
    }, [newPoints, points]);
  
    useEffect(() => {
      if (isOpen) {
        setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
        console.log('Modal opened with points:', { points, newPoints });
  
        if (levelUp) {
          console.log('Level Up! Current Level:', currentLevel, 'Next Level:', nextLevel);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          playLevelUpSound();
        }
  
        incrementPoints();
      }
    }, [isOpen, levelUp, incrementPoints, playLevelUpSound]);
  
    const modalVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
    };
  
    // Move console logs outside JSX
    if (levelUp) {
      console.log('Next level details:', nextLevel);
    }
    
    if (currentLevel || nextLevel) {
      console.log('Progress bar width calculation:', {
        points,
        newPoints,
        currentLevel: levelUp ? nextLevel : currentLevel,
      });
    }
  
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background shadow-defined rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-2 text-center text-text">
                  Awesome Progress! 🎉
                </h2>
                <Image
                  src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725632828/authentication/onboarding-popup_y2qcaa.webp"
                  alt="Celebration"
                  className="mx-auto mb-2"
                  width={100}
                  height={100}
                />
                <p className="text-sm text-center mb-3 text-grey-2">
                  {message}
                </p>
                <div className="mb-6">
                  <p className="text-center text-lg font-semibold mb-1 text-text">
                    You&apos;ve earned {newPoints - points} points!
                  </p>
                  {levelUp && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-3"
                  >
                    <h3 className="text-lg font-bold text-secondary-2 mb-1">
                      Level Up! 🚀
                    </h3>
                    <p className="text-sm text-grey-2">
                      You&apos;ve reached level {nextLevel?.levelNumber}!
                    </p>
                    <p className="text-sm text-grey-2 my-2">
                      {caption}
                    </p>
                  </motion.div>
                )}
                  <div className="bg-grey-1 h-3 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-brand"
                      initial={{ width: `${(points / (levelUp ? nextLevel?.maxPoints : currentLevel?.maxPoints)) * 100}%` }}
                      animate={{ width: `${(currentPoints / (levelUp ? nextLevel?.maxPoints : currentLevel?.maxPoints)) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-center mt-3 text-sm text-grey-2">
                    Total: {currentPoints} / {levelUp ? nextLevel?.maxPoints : currentLevel?.maxPoints}
                  </p>
                </div>
               
                <Button
                  onClick={onClose}
                  className="w-full bg-brand text-base text-white font-bold py-3 px-4 transition duration-200"
                >
                  Keep Learning!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
        <audio ref={audioRef} src="https://res.cloudinary.com/drlyyxqh9/video/upload/v1726498206/Beams%20today/Level_Up_ufjevv.mp3" preload="auto" />
      </AnimatePresence>
    );
  };
  
  export default RewardsModal;