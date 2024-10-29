import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'; // Importing NextUI components for popover functionality
import { InfoCircle } from 'iconsax-react'; // Importing InfoCircle icon from Iconsax
import React from 'react'; // Importing React

// Interface defining the expected props for LevelName component
interface LevelNameProps {
    levelNumber: number; // The level number
    minPoints: number;   // Minimum points for the level
    maxPoints: number;   // Maximum points for the level
    name: string;        // Name of the level
}

// Functional component for displaying level information
const LevelName = ({
    minPoints,
    maxPoints,
    levelNumber,
    name
}: LevelNameProps) => {
  return (
    <div className="w-full flex items-center justify-center"> {/* Centered container */}
      <div className="flex items-center gap-2 md:gap-4"> {/* Flex container for level info */}
        <div className="flex items-start flex-col gap-1"> {/* Column layout for level details */}
          <p className="text-xs mx-auto md:text-base text-grey-2">Level {levelNumber}</p> {/* Level number display */}
          <div className="flex items-center gap-2"> {/* Flex container for name and icon */}
            <p className="text-sm md:text-lg uppercase font-medium font-poppins text-text relative"> {/* Level name display */}
              <span className="inline-block">
                {name} {/* Level name */}
                <sup className="absolute -top-1 -right-3"> {/* Positioned sup tag for info icon */}
                  <Popover showArrow> {/* Popover component for additional information */}
                    <PopoverTrigger>
                      <InfoCircle size={10} color="#808080" className="cursor-pointer" /> {/* Info icon */}
                    </PopoverTrigger>
                    <PopoverContent className="w-fit text-left p-4"> {/* Popover content */}
                      <p className="text-xs w-full font-medium mb-2">Level {levelNumber} - {name}</p> {/* Level description */}
                      <p className="text-xs w-full text-grey-2">Beams Range: {minPoints} - {maxPoints}</p> {/* Points range */}
                    </PopoverContent>
                  </Popover>
                </sup>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exporting the LevelName component for use in other parts of the application
export default LevelName;
