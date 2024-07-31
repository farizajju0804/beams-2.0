'use client'
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button, Calendar } from "@nextui-org/react";
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    close: () => setIsCalendarOpen(false),
  }));

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCalendarOpen((prev) => !prev);
  };

  const handleDateChange = (date: DateValue | null) => {
    onDateChange(date);
    setIsCalendarOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  return (
    <div className="relative">
      <Button className='bg-gray-200' isIconOnly onClick={handleIconClick}>
        <CalendarIcon size="24" className='text-gray-600' />
      </Button>
      {isCalendarOpen && (
        <div ref={calendarRef} className="absolute -bottom-0 right-0 z-10 mt-2 rounded-md p-4 bg-white shadow-lg">
          <Calendar 
            value={selectedDate} 
            onChange={handleDateChange} 
            minValue={minValue} 
            maxValue={maxValue} 
          />
        </div>
      )}
    </div>
  );
});

CalendarComponent.displayName = 'CalendarComponent';

export default CalendarComponent;
