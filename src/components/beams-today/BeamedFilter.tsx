import React from 'react';
import { Radio, RadioGroup } from "@nextui-org/react";

interface BeamedFilterProps {
  beamedStatus: string;
  setBeamedStatus: (status: string) => void;
}

const BeamedFilter: React.FC<BeamedFilterProps> = ({ beamedStatus, setBeamedStatus }) => {
  return (
    <RadioGroup
      value={beamedStatus}
      onValueChange={setBeamedStatus}
      orientation="horizontal"
      className="flex gap-4"
    >
      <Radio value="all">All</Radio>
      <Radio value="beamed">Beamed</Radio>
      <Radio value="unbeamed">Unbeamed</Radio>
    </RadioGroup>
  );
};

export default BeamedFilter;
