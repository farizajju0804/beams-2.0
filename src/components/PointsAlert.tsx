'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircle } from 'iconsax-react';
import { DynamicIcon } from './DynamicComponent';

interface PointsAlertProps {
  message: string;
  points: number;
  duration?: number;
  icon: string;
  color: string;
  onClose: () => void;
}

export default function PointsAlert({
    message,
    points,
    duration = 6000,
    icon,
    color,
    onClose
  }: PointsAlertProps) {
    const [isVisible, setIsVisible] = useState(true);
  
    useEffect(() => {
      console.log("PointsAlert isVisible:", isVisible); // Log PointsAlert visibility state
  
      const timer = setTimeout(() => {
        setIsVisible(false);
        console.log("PointsAlert visibility timed out"); // Log when the alert times out
        onClose();
      }, duration);
  
      return () => clearTimeout(timer);
    }, [duration, isVisible]);
  
    if (!isVisible) return null;
  
    const handleClose = () => {
      console.log("PointsAlert manually closed"); // Log when manually closed
      setIsVisible(false);
      onClose();
    };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: 50, scale: 0.8, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-4 right-5 md:right-6  lg:right-12 bg-background z-[250] shadow-defined p-4 max-w-xs w-full overflow-hidden"
          style={{ borderTop: `3px solid ${color}` }}
        >
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className="absolute top-0 left-0 h-[3px]"
            style={{ background: color }}
          />
          <button
            onClick={handleClose}
            className="absolute top-1 right-1 text-grey-2 transition-colors"
            aria-label="Close alert"
          >
            <CloseCircle  variant='Bold' size={18} />
          </button>
          <div className="flex items-center mb-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, delay: 0.2 }}
              className="w-8 h-8 rounded-full flex items-center flex-shrink-0  justify-center mr-3"
              style={{ background: `${color}33` }}  // Slightly transparent version of the color
            >
              <DynamicIcon size={20} icon={icon} style={{ color:color }}/>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-medium text-text"
            >
              {message}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <motion.span
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.5 }}
              className="text-sm font-semibold text-text"
              style={{ color: color }}
            >
              +{points} Beams
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
