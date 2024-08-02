'use client'
import React, { forwardRef, useImperativeHandle } from 'react';
import { Button, Calendar, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { Calendar as CalendarIcon } from 'iconsax-react';
import { DateValue, CalendarDate } from '@internationalized/date';

interface CalendarComponentProps {
  selectedDate: DateValue | null;
  onDateChange: (date: DateValue | null) => void;
  minValue: CalendarDate;
  maxValue: CalendarDate;
}

interface CalendarComponentHandle {
  close: () => void;
}

const CalendarComponent = forwardRef<CalendarComponentHandle, CalendarComponentProps>(({ selectedDate, onDateChange, minValue, maxValue }, ref) => {
  useImperativeHandle(ref, () => ({
    close: () => {},
  }));

  const handleDateChange = (date: DateValue | null) => {
    onDateChange(date);
  };

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button className='bg-grey-1' isIconOnly>
          <CalendarIcon size="24" className='text-grey-2' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0 m-0'>
       
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            minValue={minValue}
            maxValue={maxValue}
            className='border-none m-0'
          />
        
      </PopoverContent>
    </Popover>
  );
});

CalendarComponent.displayName = 'CalendarComponent';

export default CalendarComponent;
