import React from 'react';

// Define the props for the DateComponent, expecting a date string in 'YYYY-MM-DD' format
interface DateComponentProps {
  date: string;
}

// Functional component to display a formatted date
const DateComponent: React.FC<DateComponentProps> = ({ date }) => {
  // Array of month names for converting month number to name
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Split the date string into year, month, and day
  const [year, month, day] = date.split("-");
  
  // Get the month name by parsing the month number
  const monthName = monthNames[parseInt(month) - 1];
  
  // Parse the day number
  const dayNumber = parseInt(day);

  return (
    <div className='font-display flex items-center text-white'>
      {/* Display the month name */}
      <div className='text-sm md:text-lg'>{monthName}</div>
      
      {/* Container for the day with dividers */}
      <div className='relative flex items-center mx-2'>
        {/* Left divider line */}
        <div className='w-[2px] h-6 bg-white'></div>
        
        {/* Display the day number */}
        <span className='text-xl md:text-xl font-extrabold p-1'>{dayNumber}</span>
        
        {/* Right divider line */}
        <div className='w-[2px] h-6 bg-white'></div>
      </div>
      
      {/* Display the year */}
      <div className='text-sm md:text-lg'>{year}</div>
    </div>
  );
};

export default DateComponent;
