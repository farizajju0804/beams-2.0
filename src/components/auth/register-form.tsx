"use client";

import React, { useState, useEffect } from "react";
import Step1Form from "./Step1";
import Step2Form from "./Step2";
import Step3Form from "./Step3";
import Step4Form from "./Step4";

const TOTAL_STEPS = 4;

const RegisterPage: React.FC = () => {
  // Retrieve the current step from local storage or default to step 1
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
        localStorage.removeItems("currentStep",'email');
      } else {
        localStorage.setItem("currentStep", nextStep.toString());
      }
      return nextStep;
    });
  };

  return (
    <div className="w-full flex items-center justify-center">
      {currentStep === 1 && <Step1Form onNext={handleNext} />}
      {currentStep === 2 && <Step2Form onNext={handleNext} />}
      {currentStep === 3 && <Step3Form onNext={handleNext} />}
      {currentStep === 4 && <Step4Form onNext={handleNext} />}
    </div>
  );
};

export default RegisterPage;
