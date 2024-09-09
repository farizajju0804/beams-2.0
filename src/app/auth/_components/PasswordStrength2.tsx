import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface PasswordStrengthProps {
  password: string; // Password input from the user
  onClose: () => void; // Optional function for closing the strength indicator
}

/**
 * PasswordStrength component evaluates the strength of a password
 * based on several rules (length, uppercase, lowercase, number, special character).
 */
const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, onClose }) => {
  const [barColor, setBarColor] = useState('bg-gray-500'); // Initial color of the strength bar

  // Password validation rules
  const rules = [
    {
      label: '8+ chars', // Rule label
      regex: /.{8,}/, // Rule: at least 8 characters
    },
    {
      label: 'Uppercase', // Rule label
      regex: /[A-Z]/, // Rule: must contain an uppercase letter
    },
    {
      label: 'Lowercase', // Rule label
      regex: /[a-z]/, // Rule: must contain a lowercase letter
    },
    {
      label: 'Number', // Rule label
      regex: /\d/, // Rule: must contain a number
    },
    {
      label: 'Special Character', // Rule label
      regex: /[^a-zA-Z0-9]/, // Rule: must contain a special character
      fullWidth: true, // Indicates that this rule should take more space in the layout
    },
  ];

  // Check if all validation rules are satisfied
  const allValid = password && rules.every(rule => rule.regex.test(password));

  useEffect(() => {
    // Calculate how many rules are satisfied
    const validRulesCount = rules.filter(rule => rule.regex.test(password)).length;

    // Update the color of the strength bar based on the number of valid rules
    if (validRulesCount === 0) {
      setBarColor('bg-gray-400'); // Weak password
    } else if (validRulesCount === rules.length) {
      setBarColor('bg-green-500'); // Strong password
    }
  }, [password, allValid]); // Re-run when password or validity changes

  return (
    <div className="w-full mt-4">
      {/* Strength bar */}
      <div className="w-full h-2 ">
        <div
          className={`h-full ${barColor} rounded-full`} 
          style={{ width: `${(rules.filter(rule => rule.regex.test(password)).length / rules.length) * 100}%` }} // Adjust width based on the number of valid rules
        ></div>
      </div>

      {/* Rules display */}
      <div className="w-full grid grid-cols-3 gap-4 mt-4">
        {rules.map((rule, index) => {
          const isValid = password && rule.regex.test(password); // Check if the rule is valid for the current password
          return (
            <div key={index} className={`flex items-center ${rule.fullWidth ? 'col-span-2' : ''}`}>
              {isValid ? (
                <FaCheckCircle className="text-green-400 mr-2" /> // Display check icon for valid rules
              ) : (
                <FaTimesCircle className="text-grey-2 mr-2" /> // Display cross icon for invalid rules
              )}
              <span className={`text-xs ${isValid ? 'text-green-500 font-medium' : 'text-grey-2'}`}>
                {rule.label} {/* Display rule label */}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrength; // Export the component
