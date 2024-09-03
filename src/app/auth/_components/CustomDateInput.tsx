import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';

interface CustomDateInputProps {
  day: string;
  month: string;
  year: string;
  onDayChange: (day: string) => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  labelPlacement?: 'left' | 'top';
}

const CustomDateInput: React.FC<CustomDateInputProps> = ({
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
  labelPlacement = 'left',
}) => {
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const years = Array.from({ length: 65 }, (_, i) => (1950 + i).toString());

  return (
    <div className={`flex ${labelPlacement === 'left' ? 'items-center' : 'flex-col'} w-full`}>
      <label className={`text-xs text-grey-2 ${labelPlacement === 'left' ? 'mr-4' : 'mb-2'}`}>
        Date of Birth
      </label>
      <div className={`flex w-full justify-between ${labelPlacement === 'top' ? 'flex-wrap' : 'flex-1'}`}>
        <Select
          selectedKeys={month ? [month] : []}
          onSelectionChange={(keys) => onMonthChange(Array.from(keys)[0] as string)}
          placeholder="Month"
          className="w-[25%]"
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
          className="w-[25%]"
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
          className="w-[40%]"
          size="sm"
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
