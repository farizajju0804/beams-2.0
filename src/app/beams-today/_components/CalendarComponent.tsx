'use client'; // Ensures this component is rendered on the client side in a Next.js environment.

import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react'; // React imports including forwardRef and hooks.
import { Button, Calendar, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'; // Import UI components from NextUI.
import { Calendar as CalendarIcon } from 'iconsax-react'; // Calendar icon from iconsax-react.
import { DateValue, CalendarDate } from '@internationalized/date'; // Types from internationalized date library.

interface CalendarComponentProps {
  selectedDate: DateValue | null; 
  topics:any;// The currently selected date, or null if no date is selected.
  onDateChange: (date: DateValue | null) => void; // Function to handle date changes.
  minValue: CalendarDate; // Minimum date that can be selected.
  maxValue: CalendarDate; // Maximum date that can be selected.
}

interface CalendarComponentHandle {
  close: () => void; // Method to allow the parent component to close the popover programmatically.
}

// The CalendarComponent is wrapped with forwardRef to expose methods to the parent component.
const CalendarComponent = forwardRef<CalendarComponentHandle, CalendarComponentProps>(
  ({ selectedDate, topics, onDateChange, minValue, maxValue }, ref) => {
    const [isOpen, setIsOpen] = useState(false); // State to manage the visibility of the popover.


    const availableDates = new Set(
      topics.map((topic:any) => {
        const date = new Date(topic.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      })
    );
    const isDateUnavailable = (date:any) => {
      const dateString = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
      return !availableDates.has(dateString);
    };

    // Expose a method to the parent component to close the popover using useImperativeHandle.
    useImperativeHandle(ref, () => ({
      close: () => setIsOpen(false), // Allows the parent component to programmatically close the popover.
    }));

    // Handle the date change, pass the selected date back to the parent component, and close the popover.
    const handleDateChange = (date: DateValue | null) => {
      onDateChange(date);
      setIsOpen(false); // Close the popover after a date is selected.
    };

    // Handle popover open/close state.
    const handleOpenChange = (open: boolean) => {
      setIsOpen(open); // Update the popover's open state based on user interaction.
    };

    // Prevent the calendar click from closing the popover.
    const handleCalendarClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Stop the event from propagating to prevent unintended popover closing.
    };

    return (
      <Popover
        placement="bottom-end" // Places the popover at the bottom right of the button.
        shouldFlip={false} // Prevents the popover from flipping to other positions.
        shouldUpdatePosition={false} // Prevents the popover from updating its position dynamically.
        isOpen={isOpen} // Controls whether the popover is open or closed.
        onOpenChange={handleOpenChange} // Handles changes in the popover's open state.
      >
        {/* Popover trigger is a button with a calendar icon */}
        <PopoverTrigger>
          <Button className="bg-grey-1" isIconOnly>
            <CalendarIcon size="24" className="text-grey-2" /> {/* Button to open the calendar */}
          </Button>
        </PopoverTrigger>
        
        {/* Popover content that contains the Calendar component */}
        <PopoverContent className="p-0 m-0 min-w-[256px] flex">
          <Calendar
            aria-label="Topic Dates"
            value={selectedDate} // The currently selected date.
            onChange={handleDateChange} // Handles the date change.
            minValue={minValue} // Minimum selectable date.
            maxValue={maxValue} // Maximum selectable date.
            onClick={handleCalendarClick} // Prevents the popover from closing when clicking inside the calendar.
            calendarWidth={256} // Sets a fixed width for the calendar.
            classNames={{
              gridWrapper: "w-full", // Ensures the calendar grid takes full width.
              content: 'w-[256px]', // Ensures the content is correctly sized.
            }}
            className="border-none m-0 min-w-full" // Calendar styling.
            isDateUnavailable={isDateUnavailable}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

CalendarComponent.displayName = 'CalendarComponent'; // Set the display name for the forwardRef component.

export default CalendarComponent; // Export the component for use in other parts of the application.
