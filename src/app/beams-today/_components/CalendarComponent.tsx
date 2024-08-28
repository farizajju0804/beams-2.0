'use client';

import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
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
      setIsOpen(false);
    };

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
    };

    const handleCalendarClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <Popover
        placement="bottom-end"
        shouldFlip={false}
        shouldUpdatePosition={false}
        
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
      >
        <PopoverTrigger >
          <Button className="bg-grey-1" isIconOnly>
            <CalendarIcon size="24" className="text-grey-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 m-0 min-w-[256px] flex">
          {/* <div > */}
            <Calendar
              value={selectedDate}
              onChange={handleDateChange}
              
              minValue={minValue}
              maxValue={maxValue}
              onClick={handleCalendarClick}
              calendarWidth={256}
              classNames={{
                gridWrapper:"w-full",
                content: 'w-[256px]'
              }}
              className="border-none m-0 min-w-full"
            />
          {/* </div> */}
        </PopoverContent>
      </Popover>
    );
  }
);

CalendarComponent.displayName = 'CalendarComponent';

export default CalendarComponent;