import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface PasswordStrengthProps {
  password: string;
  onClose: () => void;

}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, onClose }) => {
  const [barColor, setBarColor] = useState('bg-gray-500'); // Start with red


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
      fullWidth: true
    },
  ];

  const allValid = password && rules.every(rule => rule.regex.test(password));

  useEffect(() => {
    // Check how many rules are valid
    const validRulesCount = rules.filter(rule => rule.regex.test(password)).length;

    // Adjust bar color based on how many rules are satisfied
    if (validRulesCount === 0) {
      setBarColor('bg-gray-400');
    } else if (validRulesCount === rules.length) {
      setBarColor('bg-green-500');
    }

  }, [password, allValid]);

  return (
    <div className="w-full mt-4">
      <div className="w-full h-2 ">
        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${(rules.filter(rule => rule.regex.test(password)).length / rules.length) * 100}%` }}></div>
      </div>
      <div className="w-full grid grid-cols-3 gap-4 mt-4">
        {rules.map((rule, index) => {
          const isValid = password && rule.regex.test(password);
          return (
            <div key={index} className={`flex items-center ${
                rule.fullWidth ? 'col-span-2' : ''
              }`}>
              {isValid ? (
                <FaCheckCircle className="text-green-400 mr-2" />
              ) : (
                <FaTimesCircle className="text-grey-2 mr-2" />
              )}
              <span className={`text-xs ${isValid ? 'text-green-500 font-medium' : 'text-grey-2'}`}>{rule.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrength;
