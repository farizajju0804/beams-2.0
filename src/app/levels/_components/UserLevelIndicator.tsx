import React from "react";
import { FaStar, FaCrown, FaMedal, FaChartLine, FaTrophy } from "react-icons/fa";
import { InfoCircle } from "iconsax-react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";


const iconMap = {
  FaStar,
  FaCrown,
  FaMedal,
  FaChartLine,
  FaTrophy
};

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
    <div className="w-full flex flex-col gap-12 px-6 mb-6 bg-background">
      {levels.map((config, idx) => {
        const Icon = iconMap[config.icon as keyof typeof iconMap];
        const isWithinLevelRange = beams >= config.minPoints && beams <= config.maxPoints;
        const isAboveLevel = beams > config.maxPoints;
        let progress = 0;

        if (isWithinLevelRange) {
          progress = Math.min(100, Math.round(((beams - config.minPoints) / (config.maxPoints - config.minPoints)) * 100));
        } else if (isAboveLevel) {
          progress = 100;
        }

        const filledIcons = Math.ceil(progress / 10);
        const showPointer = isWithinLevelRange;

        const iconSize = 16;
        const iconGap = 12;
        const arrowLeftPosition = (filledIcons - 0.5) * (iconSize + iconGap);

        return (
          <div key={config.id} className="relative flex flex-col gap-2 items-start ">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex items-start flex-col gap-1">
                  <p className="text-xs md:text-base text-grey-2">Level {config.levelNumber}</p>
                  <div className="flex items-center gap-2">
                  <p className="text-sm md:text-lg uppercase font-medium font-poppins text-text relative">
        <span className="inline-block">
          {config.name}
          <sup className="absolute -top-1 -right-3">
            <Popover  showArrow>
              <PopoverTrigger>
                <InfoCircle size={10} color="#808080" className="cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent  className="w-fit text-left p-4">
                <p className="text-xs w-full  font-medium mb-2">Level {config.levelNumber} - {config.name}</p>
                <p className="text-xs w-full text-grey-2">Beams Range: {config.minPoints} - {config.maxPoints}</p>
              </PopoverContent>
            </Popover>
          </sup>
        </span>
      </p>
                   
                  </div>
                </div>
              </div>
              <div className="w-12 h-10 flex md:hidden items-center justify-center">
                {/* <div
                  className="rounded-2xl flex items-center justify-center transition-all duration-300 ease-in-out"
                  style={{
                    width: `80px`,
                    backgroundColor: beams >= config.minPoints ? config.bgColor : "#e5e5e5",
                    height: "100%",
                    minWidth: "24px",
                  }}
                >
                  <span className={`${beams >= config.minPoints ? 'text-white' : "text-black"} font-bold text-xs`}>{progress}%</span>
                </div> */}
                 <Button variant="shadow" 
                style={{
                  width: `80px`,
                  backgroundColor: beams >= config.minPoints ? config.bgColor : "#e5e5e5",
                  height: "100%",
                  minWidth: "24px",
                }}
                className={`${beams >= config.minPoints ? 'text-white' : "text-black"}  font-bold text-xs w-12 h-10`}>{progress}%</Button>
              </div>
            </div>
            <div className="max-w-full w-full flex flex-wrap items-center justify-center gap-4 relative">
              <div className="flex gap-4 shadow-defined bg-background rounded-3xl p-4">
                {[...Array(10)].map((_, i) => (
                  <Icon key={i} size={iconSize} style={{ color: i < filledIcons ? config.bgColor : "#e5e5e5" }} />
                ))}
              </div>
              <div className="hidden w-12 h-10 md:flex items-center justify-center">
                {/* <div
                  className="rounded-2xl flex items-center justify-center transition-all duration-300 ease-in-out"
                  style={{
                    width: `80px`,
                    backgroundColor: beams >= config.minPoints ? config.bgColor : "#e5e5e5",
                    height: "100%",
                    minWidth: "24px",
                  }}
                >
                  <span className={`${beams >= config.minPoints ? 'text-white' : "text-black"} font-bold text-xs`}>{progress}%</span>
                </div> */}
                <Button variant="shadow" 
                style={{
                  width: `80px`,
                  backgroundColor: beams >= config.minPoints ? config.bgColor : "#e5e5e5",
                  height: "100%",
                  minWidth: "24px",
                }}
                className={`${beams >= config.minPoints ? 'text-white' : "text-black"}  font-bold text-xs w-12 h-10`}>{progress}%</Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}