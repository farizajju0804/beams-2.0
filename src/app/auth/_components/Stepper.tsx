"use client";

import React from "react";
import { motion } from "framer-motion";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps, stepLabels }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between relative px-4">
        {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step) => (
          <React.Fragment key={step}>
            <motion.div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold z-10 ${
                step <= currentStep ? "bg-primary text-white" : "bg-gray-200 text-gray-400"
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: (step - 1) * 0.1 }}
            >
              {step}
            </motion.div>
            {step < totalSteps && (
              <motion.div
                className="flex-1 h-1 bg-gray-200"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: (step - 1) * 0.1 }}
              >
                <motion.div
                  className="h-full bg-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: step < currentStep ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: step * 0.1 }}
                />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center text-center justify-between mt-2">
        {stepLabels.map((label, index) => (
          <motion.span
            key={index}
            className={`text-xs w-20 ${
              index + 1 <= currentStep ? "text-text font-medium" : "text-gray-400"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {label}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default Stepper; 