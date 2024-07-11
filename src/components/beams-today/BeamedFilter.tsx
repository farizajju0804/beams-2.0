// components/beams-today/BeamedFilter.tsx

import React from 'react';
import { Radio, RadioGroup } from "@nextui-org/react";

interface BeamedFilterProps {
  beamedStatus: string;
  setBeamedStatus: (status: string) => void;
  disabled: boolean;
}
const isMobile = window.innerWidth < 767;
const BeamedFilter: React.FC<BeamedFilterProps> = ({ beamedStatus, setBeamedStatus, disabled }) => {
  return (
    <RadioGroup
      value={beamedStatus}
      onValueChange={setBeamedStatus}
      orientation="horizontal"
      className="flex gap-4"
      isDisabled={disabled}
      size={isMobile ? 'sm' : 'md'}
    >
      <Radio value="all">All</Radio>
      <Radio value="beamed">Beamed</Radio>
      <Radio value="unbeamed">Unbeamed</Radio>
    </RadioGroup>
  );
};

export default BeamedFilter;
