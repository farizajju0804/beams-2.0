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
    <div className='font-display flex items-center text-grey-1'>
      <div className='text-sm md:text-xl'>{monthName}</div>
      <div className='relative flex items-center mx-2 md:mx-3'>
        <div className='w-[2px] h-6 bg-grey-1'></div>
        <span className='text-xl md:text-2xl font-extrabold p-1 md:p-2'>{dayNumber}</span>
        <div className='w-[2px] h-6 bg-grey-1'></div>
      </div>
      <div className='text-sm md:text-xl'>{year}</div>
    </div>
  );
};

export default DateComponent;
