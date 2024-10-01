import React from "react";
import { InfoCircle } from "iconsax-react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";

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

const iconLibraries:any = {
  fa: FaIcons,
  md: MdIcons,
  gi: GiIcons,
  // Add other libraries as needed
};

const DynamicIcon = ({ icon, ...props }:any) => {
  const [library, iconName]:any = icon.split('/');
  const IconComponent = iconLibraries[library]?.[iconName];

  if (!IconComponent) {
    console.error(`Icon not found: ${icon}`);
    return <div style={{ width: props.size, height: props.size }}></div>;
  }

  return <IconComponent {...props} />;
};

export default function UserLevelIndicator({ beams = 0, levels }: UserLevelIndicatorProps) {
  return (
    <div className="w-full flex flex-col gap-10 px-6 mb-6 bg-background">
      {levels.map((config, idx) => {
        const isWithinLevelRange = beams >= config.minPoints && beams <= config.maxPoints;
        const isAboveLevel = beams > config.maxPoints;
        let progress = 0;

        if (isWithinLevelRange) {
          progress = Math.min(100, Math.round(((beams - config.minPoints) / (config.maxPoints - config.minPoints)) * 100));
        } else if (isAboveLevel) {
          progress = 100;
        }

        const filledIcons = Math.ceil(progress / 10);
        const iconSize = 16;
        const iconGap = 12;
        const isLevelCompleted = beams >= config.minPoints;

        return (
          <div key={config.id} className="relative flex flex-col gap-2 items-start ">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex items-start flex-col gap-1">
                  <p className="text-xs md:text-base text-grey-2">Level {config.levelNumber}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm md:text-lg uppercase font-medium font-poppins text-text relative">
                      <span className="inline-block" style={{ color: isLevelCompleted ? config.bgColor : 'inherit' }}>
                        {config.name}
                        <sup className="absolute -top-1 -right-3">
                          <Popover showArrow>
                            <PopoverTrigger>
                              <InfoCircle size={10} color="#808080" className="cursor-pointer" />
                            </PopoverTrigger>
                            <PopoverContent className="w-fit text-left p-4">
                              <p className="text-xs w-full font-medium mb-2">Level {config.levelNumber} - {config.name}</p>
                              <p className="text-xs w-full text-grey-2">Beams Range: {config.minPoints} - {config.maxPoints}</p>
                            </PopoverContent>
                          </Popover>
                        </sup>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-full w-full flex items-center justify-between md:justify-start gap-2 md:gap-4 relative">
              <div className="flex gap-2 md:gap-4 shadow-defined bg-background rounded-3xl p-3">
                {[...Array(10)].map((_, i) => (
                  <DynamicIcon 
                    key={i} 
                    icon={config.icon} 
                    size={iconSize} 
                    style={{ color: i < filledIcons ? config.bgColor : "#e5e5e5" }} 
                  />
                ))}
              </div>
              <div className="hidden w-12 h-10 md:flex items-center justify-center">
                <Button 
                  variant="shadow" 
                  style={{
                    width: `80px`,
                    backgroundColor: isLevelCompleted ? config.bgColor : "#e5e5e5",
                    height: "100%",
                    minWidth: "24px",
                  }}
                  className={`${isLevelCompleted ? 'text-white' : "text-black"} font-bold text-xs w-12 h-10`}
                >
                  {progress}%
                </Button>
              </div>
              <div className="flex md:hidden items-center justify-center">
                <Button 
                  variant="shadow" 
                  size="sm"
                  style={{
                    backgroundColor: isLevelCompleted ? config.bgColor : "#e5e5e5",
                  }}
                  className={`${isLevelCompleted ? 'text-white' : "text-black"} p-[6px] min-w-0 font-bold text-xs`}
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