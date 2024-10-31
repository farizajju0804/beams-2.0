import React from "react"; // Importing React
import { InfoCircle } from "iconsax-react"; // Importing InfoCircle icon from iconsax-react
import { Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"; // Importing necessary components from NextUI
import IconFillingEffect from "@/components/IconFillingEffect"; // Importing a custom component for icon filling effects

// Interface for level configuration
interface LevelConfig {
  id: string; // Unique identifier for the level
  levelNumber: number; // Number representing the level
  minPoints: number; // Minimum points required for the level
  maxPoints: number; // Maximum points required for the level
  name: string; // Name of the level
  caption: string; // Caption or description for the level
  icon: string; // Icon representation for the level
  shadowColor: string; // Shadow color for styling
  bgColor: string; // Background color for styling
}

// Props interface for UserLevelIndicator component
interface UserLevelIndicatorProps {
  beams: number; // Number of beams a user has
  levels: LevelConfig[]; // Array of level configurations
}

// UserLevelIndicator component definition
export default function UserLevelIndicator({ beams = 0, levels }: UserLevelIndicatorProps) {
  return (
    <div className="w-full flex flex-col gap-8 px-6 md:px-8 mb-12 bg-background">
      {/* Mapping through the levels to create individual level indicators */}
      {levels.map((config) => {
        // Check if the user's beams fall within the current level's range
        const isWithinLevelRange = beams >= config.minPoints && beams <= config.maxPoints;
        const isAboveLevel = beams > config.maxPoints; // Check if the user is above the current level
        let progress = 0; // Variable to hold the progress percentage

        // Calculate progress percentage based on beams
        if (isWithinLevelRange) {
          progress = Math.min(100, Math.round(((beams - config.minPoints) / (config.maxPoints - config.minPoints)) * 100));
        } else if (isAboveLevel) {
          progress = 100; // If above level, set progress to 100%
        }

        return (
          <div key={config.id} className="relative flex flex-col gap-2 items-start">
            <Popover>
              <PopoverTrigger>
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-start flex-col gap-1">
                    {/* Level number display */}
                    <p className={`text-xs md:text-base text-grey-2 relative ${isWithinLevelRange || isAboveLevel ? 'font-bold' : ''}`}>
                      Level {config.levelNumber}
                      <sup className="absolute -top-1 -right-3">
                        <InfoCircle size={10} className="text-grey-2" /> {/* Info icon */}
                      </sup>
                    </p>
                    {/* Level name display */}
                    <p className={`text-sm md:text-lg font-medium uppercase font-poppins text-text `}
                       style={{ color: isAboveLevel ? config.bgColor : 'inherit' }}>
                      {config.name}
                    </p>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-fit text-left p-4">
                {/* Popover content displaying level information */}
                <p className="text-xs w-full font-medium mb-2">Level {config.levelNumber} - {config.name}</p>
                <p className="text-xs w-full text-grey-2">Beams Range: {config.minPoints} - {config.maxPoints}</p>
              </PopoverContent>
            </Popover>

            {/* Progress and button display */}
            <div className="max-w-full w-full flex items-center gap-2 md:gap-4 relative">
              <IconFillingEffect
                icon={config.icon} // Icon for the filling effect
                filledColor={config.bgColor} // Background color for the filling effect
                beams={beams} // User's current beams
                minPoints={config.minPoints} // Minimum points for the level
                maxPoints={config.maxPoints} // Maximum points for the level
                totalIcons={10} // Total icons for visual representation
                iconSize={16}  // Size of the icons
                iconGap={9}    // Gap between the icons
              />
              <div className="w-10 flex items-center justify-center">
                <Button 
                  variant="shadow" 
                  size="sm"
                  style={{
                    backgroundColor: (isWithinLevelRange || isAboveLevel) ? config.bgColor : "#e5e5e5", // Conditional background color
                    width: "100%",
                    height: "2rem",
                  }}
                  className={`${(isWithinLevelRange || isAboveLevel) ? 'text-white' : "text-black"} min-w-0 font-bold text-xs`}
                >
                  {progress}% {/* Displaying the progress percentage */}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
