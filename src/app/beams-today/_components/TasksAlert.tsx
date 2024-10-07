'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircle } from 'iconsax-react';

interface PointsAlertProps {
  message: string;
  completedTasks: number;
  totalTasks: number;
  duration?: number;
  badgeName: string;
  color: string;
}

export default function TasksAlert({
  message,
  completedTasks,
  totalTasks,
  duration = 6000,
  badgeName,
  color,
}: PointsAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: 50, scale: 0.8, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-4 right-5 md:right-6 lg:right-12 bg-background z-[250] shadow-defined p-4 max-w-xs w-full overflow-hidden"
          style={{ borderTop: `3px solid ${color}` }}
        >
          {/* Progress Bar at the top, shrinking over the alert's duration */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className="absolute top-0 left-0 h-[3px]"
            style={{ background: color }}
          />

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-1 right-1 text-grey-2 transition-colors"
            aria-label="Close alert"
          >
            <CloseCircle variant="Bold" size={18} />
          </button>

          {/* Badge Name */}
          <div className="flex flex-col w-full justify-between mb-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              className="w-full flex-shrink-0 flex"
            >
              <p className="font-semibold mb-1" style={{ color: color }}>
                {badgeName}
              </p>
            </motion.div>

            {/* Message */}
            <div className="mb-2 w-full">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-medium text-text"
              >
                {message}
              </motion.p>
            </div>
          </div>

          {/* Progress Bar with Squares */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              {[...Array(totalTasks)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ backgroundColor: "#E5E7EB" }}
                  animate={{
                    backgroundColor: index < completedTasks ? color : "#E5E7EB",
                  }}
                  transition={{ delay: index * 0.05 }}
                  className="h-3 w-3 rounded-sm"
                />
              ))}
            </div>

            {/* Completed Tasks Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end"
            >
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.6 }}
                className="text-xs font-semibold text-text"
                style={{ color: color }}
              >
                {completedTasks} / {totalTasks} done
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
