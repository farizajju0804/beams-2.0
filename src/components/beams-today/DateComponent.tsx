import React from 'react';

interface DateComponentProps {
  date: string;
}

const DateComponent: React.FC<DateComponentProps> = ({ date }) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [year, month, day] = date.split("-");
  const monthName = monthNames[parseInt(month) - 1];
  const dayNumber = parseInt(day);

  return (
    <div className='font-display flex items-center'>
      <div className='text-base md:text-2xl'>{monthName}</div>
      <div className='text-2xl md:text-4xl font-extrabold p-1 md:p-2 border-r-2 border-l-2 mx-2 md:mx-3'>{dayNumber}</div>
      <div className='text-base md:text-2xl'>{year}</div>
    </div>
  );
};

export default DateComponent;
