import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface PasswordStrengthProps {
  password: string;
  onClose: () => void;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, onClose }) => {
  const rules = [
    { label: '8+ chars', regex: /.{8,}/ },
    { label: 'Uppercase', regex: /[A-Z]/ },
    { label: 'Lowercase', regex: /[a-z]/ },
    { label: 'Number', regex: /\d/ },
    { label: 'Special Character', regex: /[^a-zA-Z0-9]/, fullWidth: true },
  ];

  const allValid = rules.every(rule => rule.regex.test(password));

  useEffect(() => {
    if (allValid) {
      onClose();
    }
  }, [allValid, onClose]);

  return (
    <div className="absolute top-10 w-full mt-2 bg-background shadow-lg rounded-lg p-4 z-10 transition-all duration-300 ease-in-out">
      <div className="grid grid-cols-2 gap-2">
        {rules.map((rule, index) => {
          const isValid = rule.regex.test(password);
          return (
            <div
              key={index}
              className={`flex items-center text-sm ${
                isValid ? 'text-green-500' : 'text-red-500'
              } transition-colors duration-300 ${
                rule.fullWidth ? 'col-span-2' : ''
              }`}
            >
              {isValid ? (
                <FaCheckCircle className="mr-2" />
              ) : (
                <FaTimesCircle className="mr-2" />
              )}
              <span>{rule.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrength;