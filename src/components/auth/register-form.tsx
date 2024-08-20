"use client";

import React, { useState, useEffect } from "react";
import Step1Form from "./Step1";

const TOTAL_STEPS = 3;

const RegisterPage: React.FC = () => {

  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("currentStep") || "1", 10);
    }
    return 1;
  });

  // Update local storage whenever the step changes
  const handleNext = () => {
    setCurrentStep((prevStep) => {
      const nextStep = prevStep + 1;
      if (nextStep > TOTAL_STEPS) {
        localStorage.removeItem("currentStep");
       
      } else {
        localStorage.setItem("currentStep", nextStep.toString());
      }
      return nextStep;
    });
  };

  return (
    <div className="w-full flex items-center justify-center">
       <Step1Form  />
    </div>
  );
};

export default RegisterPage;
