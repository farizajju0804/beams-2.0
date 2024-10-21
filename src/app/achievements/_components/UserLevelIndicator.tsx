import React from "react";
import { InfoCircle } from "iconsax-react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import IconFillingEffect from "@/components/IconFillingEffect";

interface LevelConfig {
  id: string;
  levelNumber: number;
  minPoints: number;
  maxPoints: number;
  name: string;
  caption: string;
  icon: string;
  shadowColor: string;
  bgColor: string;
}

interface UserLevelIndicatorProps {
  beams: number;
  levels: LevelConfig[];
}

export default function UserLevelIndicator({ beams = 0, levels }: UserLevelIndicatorProps) {
  return (
    <div className="w-full flex flex-col gap-8 px-6 md:px-8 mb-12 bg-background">
      {levels.map((config) => {
        const isWithinLevelRange = beams >= config.minPoints && beams <= config.maxPoints;
        const isAboveLevel = beams > config.maxPoints;
        let progress = 0;

        if (isWithinLevelRange) {
          progress = Math.min(100, Math.round(((beams - config.minPoints) / (config.maxPoints - config.minPoints)) * 100));
        } else if (isAboveLevel) {
          progress = 100;
        }

        return (
          <div key={config.id} className="relative flex flex-col gap-2 items-start">
            <Popover >
              <PopoverTrigger>
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-start flex-col gap-1">
                    <p className={`text-xs md:text-base text-grey-2 relative ${isWithinLevelRange || isAboveLevel ? 'font-bold' : ''}`}>
                      Level {config.levelNumber}
                      <sup className="absolute -top-1 -right-3">
                        <InfoCircle size={10} color="#808080" />
                      </sup>
                    </p>
                    <p className={`text-sm md:text-lg font-medium uppercase font-poppins text-text `}
                       style={{ color: isAboveLevel ? config.bgColor : 'inherit' }}>
                      {config.name}
                    </p>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-fit text-left p-4">
                <p className="text-xs w-full font-medium mb-2">Level {config.levelNumber} - {config.name}</p>
                <p className="text-xs w-full text-grey-2">Beams Range: {config.minPoints} - {config.maxPoints}</p>
              </PopoverContent>
            </Popover>

            <div className="max-w-full w-full flex items-center gap-2 md:gap-4 relative">
              <IconFillingEffect
                icon={config.icon}
                filledColor={config.bgColor}
                beams={beams}
                minPoints={config.minPoints}
                maxPoints={config.maxPoints}
                totalIcons={10} // Adjust as needed
                iconSize={16}  // Adjust as needed
                iconGap={9}   // Adjust as needed
              />
              <div className="w-10 flex items-center justify-center">
                <Button 
                  variant="shadow" 
                  size="sm"
                  style={{
                    backgroundColor: (isWithinLevelRange || isAboveLevel) ? config.bgColor : "#e5e5e5",
                    width: "100%",
                    height: "2rem",
                  }}
                  className={`${(isWithinLevelRange || isAboveLevel) ? 'text-white' : "text-black"} min-w-0 font-bold text-xs`}
                >
                  {progress}%
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}