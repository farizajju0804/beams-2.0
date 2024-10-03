import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { InfoCircle } from 'iconsax-react'
import React from 'react'

interface LevelNameProps {

    levelNumber: number;
    minPoints: number;
    maxPoints: number;
    name: string;
    
  }

const LevelName = ({
    minPoints,
    maxPoints,
    levelNumber,
    name
}: LevelNameProps
) => {
  return (
    <div className="w-full flex items-center justify-center ">
    <div className="flex items-center gap-2 md:gap-4">
      <div className="flex items-start flex-col gap-1">
        <p className="text-xs mx-auto  md:text-base text-grey-2">Level {levelNumber}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm md:text-lg uppercase font-medium font-poppins text-text relative">
            <span className="inline-block" >
              {name}
              <sup className="absolute -top-1 -right-3">
                <Popover showArrow>
                  <PopoverTrigger>
                    <InfoCircle size={10} color="#808080" className="cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-left p-4">
                    <p className="text-xs w-full font-medium mb-2">Level {levelNumber} - {name}</p>
                    <p className="text-xs w-full text-grey-2">Beams Range: {minPoints} - {maxPoints}</p>
                  </PopoverContent>
                </Popover>
              </sup>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default LevelName