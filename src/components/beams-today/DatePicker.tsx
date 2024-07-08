import React from "react";
import { DatePicker, DatePickerProps } from "@nextui-org/react";
import { Calendar } from "iconsax-react";
import { DateValue } from "@internationalized/date";

interface CustomDatePickerProps {
  selectedDate: DateValue | null;
  handleDateChange: (date: DateValue | null) => void;
  highlightDates?: DateValue[];
  isInvalid?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  errorMessage?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  handleDateChange,
  highlightDates,
  isInvalid = false,
  isRequired = false,
  isReadOnly = false,
  isDisabled = false,
  errorMessage = "",
}) => {
  return (
    <DatePicker
      label="Select date"
      value={selectedDate}
      onChange={handleDateChange}
      isInvalid={isInvalid}
      isRequired={isRequired}
      isReadOnly={isReadOnly}
      isDisabled={isDisabled}
      errorMessage={errorMessage}
    //   startContent={<Calendar />}
      classNames={{
        base: "relative flex items-center",
        selectorButton: "flex items-center justify-center bg-white shadow-sm border border-gray-300 rounded-lg cursor-pointer",
        selectorIcon: "text-gray-500",
        popoverContent: "bg-white border border-gray-300 shadow-lg rounded-lg p-4",
        calendar: "w-full",
        calendarContent: "flex flex-col",
        timeInputLabel: "text-sm font-medium text-gray-700",
        timeInput: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm",
      }}
      dateInputClassNames={{
        base: "flex flex-col",
        label: "mb-1 text-sm font-medium text-gray-700",
        inputWrapper: "flex items-center",
        innerWrapper: "flex items-center border border-gray-300 rounded-lg",
        input: "py-2 px-3 flex-1 text-gray-900 bg-white rounded-lg focus:outline-none",
        helperWrapper: "mt-1",
        description: "text-sm text-gray-500",
        errorMessage: "text-sm text-red-600",
      }}
    />
  );
};

export default CustomDatePicker;
