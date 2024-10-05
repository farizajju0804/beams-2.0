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
    <div className='font-display flex items-center text-grey-2'>
      <div className='text-xs md:text-sm '>{monthName}</div>
      <div className='relative flex items-center mx-1 md:mx-2 '>
        <div className='w-[2px] h-6 bg-grey-2'></div>
        <span className='text-lg md:text-xl  font-extrabold p-1'>{dayNumber}</span>
        <div className='w-[2px] h-6 bg-grey-2'></div>
      </div>
      <div className='text-xs md:text-sm '>{year}</div>
    </div>
  );
};

export default DateComponent;
