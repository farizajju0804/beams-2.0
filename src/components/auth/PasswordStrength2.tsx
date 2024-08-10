import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface PasswordStrengthProps {
  password: string;
  onClose: () => void;
  showCrackTime?: boolean;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, onClose, showCrackTime }) => {
  const rules = [
    {
      label: '8+ chars',
      regex: /.{8,}/,
    },
    {
      label: 'Uppercase',
      regex: /[A-Z]/,
    },
    {
      label: 'Lowercase',
      regex: /[a-z]/,
    },
    {
      label: 'Number',
      regex: /\d/,
    },
    {
      label: 'Special Character',
      regex: /[^a-zA-Z0-9]/,
    },
  ];

  const allValid = rules.every(rule => rule.regex.test(password));

  const crackTimeMessage = "It would take a hacker 3 million years to crack your password!";

  useEffect(() => {
    if (allValid && showCrackTime) {
      // No need to call onClose, keep the component open
    }
  }, [allValid, showCrackTime]);

  return (
    <div className="w-full mt-2 bg-background shadow-lg rounded-lg p-4 z-10">
      {allValid && showCrackTime ? (
        <div className="text-sm text-grey-2">
          {crackTimeMessage}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {rules.map((rule, index) => {
            const isValid = rule.regex.test(password);
            return (
              <div key={index} className="flex items-center">
                {isValid ? (
                  <FaCheckCircle className="text-green-500 mr-2" />
                ) : (
                  <FaTimesCircle className="text-red-500 mr-2" />
                )}
                <span className="text-sm">{rule.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;
