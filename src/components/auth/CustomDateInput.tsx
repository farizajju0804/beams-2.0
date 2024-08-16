import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';

interface CustomDateInputProps {
  day: string;
  month: string;
  year: string;
  onDayChange: (day: string) => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
}

const CustomDateInput: React.FC<CustomDateInputProps> = ({
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
}) => {
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const years = Array.from({ length: 65 }, (_, i) => (1950 + i).toString());

  return (
    <div className="flex w-full items-center gap-2">
      <p className="w-fit text-sm font-medium">Date Of Birth</p>
      <div className="flex flex-1 gap-2 w-full">
      
        <Select
          selectedKeys={month ? [month] : []}
          onSelectionChange={(keys) => onMonthChange(Array.from(keys)[0] as string)}
          placeholder="Month"
          className="w-[35%]"
          size="sm"
        >
          {months.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </Select>
        <Select
          selectedKeys={day ? [day] : []}
          onSelectionChange={(keys) => onDayChange(Array.from(keys)[0] as string)}
          placeholder="Day"
          className="w-[30%]"
          size="sm"
          
        >
          {days.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </Select>
        <Select
          selectedKeys={year ? [year] : []}
          onSelectionChange={(keys) => onYearChange(Array.from(keys)[0] as string)}
          placeholder="Year"
          className="w-[35%] p-0"
          size="sm"
          classNames={{
            value : "w-fit text-xs"
          }}
        >
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default CustomDateInput;