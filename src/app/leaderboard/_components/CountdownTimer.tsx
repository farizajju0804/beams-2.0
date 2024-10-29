import React from 'react';

// Interface to define the structure of a time unit (value and label)
interface TimeUnit {
  value: number; // The numeric value of the time unit (e.g., days, hours)
  label: string; // The label for the time unit (e.g., "Days", "Hours")
}

// Interface for the CountdownTimer component props
interface CountdownTimerProps {
  timeRemaining: number; // Time remaining in seconds
}

// CountdownTimer functional component
export const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeRemaining }) => {
  
  // Function to format the remaining time into days, hours, minutes, and seconds
  const formatTime = (time: number): TimeUnit[] => {
    const days = Math.floor(time / (24 * 60 * 60)); // Calculate days
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60)); // Calculate hours
    const minutes = Math.floor((time % (60 * 60)) / 60); // Calculate minutes
    const seconds = time % 60; // Calculate seconds

    // Return the formatted time as an array of time units
    return [
      { value: days, label: 'Days' },
      { value: hours, label: 'Hours' },
      { value: minutes, label: 'Minutes' },
      { value: seconds, label: 'Seconds' }
    ];
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2">
      {/* Flex container to display time units */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {formatTime(timeRemaining).map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            {/* Displaying the value of the time unit in a styled box */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center bg-background rounded-2xl shadow-defined mb-2">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-text">
                {unit.value.toString().padStart(2, '0')} {/* Pad with zeros */}
              </span>
            </div>
            {/* Displaying the label of the time unit */}
            <span className="text-xs sm:text-sm font-medium text-grey-2">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
