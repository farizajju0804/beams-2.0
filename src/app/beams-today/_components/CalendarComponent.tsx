'use client';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
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

const CalendarComponent = forwardRef<CalendarComponentHandle, CalendarComponentProps>(
  ({ selectedDate, onDateChange, minValue, maxValue }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      close: () => setIsOpen(false),
    }));

    const handleDateChange = (date: DateValue | null) => {
      onDateChange(date);
      setIsOpen(false); // Close the calendar after selecting a date
    };

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
    };

    return (
      <Popover
        placement="bottom"
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
      >
        <PopoverTrigger>
          <Button className="bg-grey-1" isIconOnly>
            <CalendarIcon size="24" className="text-grey-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 m-0">
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            minValue={minValue}
            maxValue={maxValue}
            className="border-none m-0"
          />
        </PopoverContent>
      </Popover>
    );
  }
);

CalendarComponent.displayName = 'CalendarComponent';

export default CalendarComponent;
