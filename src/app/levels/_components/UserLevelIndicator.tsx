import React from "react";
import { FaStar, FaCrown, FaMedal, FaChartLine, FaTrophy } from "react-icons/fa";

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
          <div key={config.id} className="relative grid gap-4 grid-cols-1 md:grid-cols-3 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                <div
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full hidden md:flex items-center justify-center"
                  style={{
                    backgroundColor: beams >= config.minPoints ? config.bgColor : "#e5e5e5",
                    boxShadow: `0px 4px 0px 0px rgba(0, 0, 0, 0.20), 0px 4px 0px 0px ${beams >= config.minPoints ? config.shadowColor : "#e5e5e5"}`,
                  }}
                >
                  <Icon size={16} className={`${beams >= config.minPoints ? "text-white" : "text-black"}`} />
                </div>
                <div className="flex items-center gap-4 ">
                  <p className="text-xs md:text-sm text-grey-2">Level {config.levelNumber}</p>
                  <p className="text-sm md:text-lg font-medium font-poppins text-text">{config.name}</p>
                </div>
              </div>
              
              <div className="flex md:hidden items-center md:justify-center">
                <div className="text-xs md:text-sm -fit p-3 flex text-grey-2 items-center rounded-3xl bg-background shadow-defined justify-center">
                  {config.minPoints} - {config.maxPoints} Beams
                </div>
              </div>
            </div>
            <div className="max-w-full flex items-center justify-center gap-4 relative">
            <div
                  className="w-fit p-3 md:w-12 md:h-12 rounded-full md:hidden flex items-center justify-center"
                  style={{
                    backgroundColor: beams >= config.minPoints ? config.bgColor : "#e5e5e5",
                    boxShadow: `0px 4px 0px 0px rgba(0, 0, 0, 0.20), 0px 4px 0px 0px ${beams >= config.minPoints ? config.shadowColor : "#e5e5e5"}`,
                  }}
                >
                  <Icon size={16} className={`${beams >= config.minPoints ? "text-white" : "text-black"}`} />
                </div>
              <div className="flex gap-3 md:gap-4 md:shadow-defined md:bg-background md:rounded-3xl md:p-4">
                {[...Array(10)].map((_, i) => (
                  <Icon key={i} size={iconSize} style={{ color: i < filledIcons ? config.bgColor : "#e5e5e5" }} />
                ))}
              </div>

              <div className="hidden w-12 h-12 md:flex items-center justify-center">
                <div
                  className="rounded-2xl flex items-center justify-center transition-all duration-300 ease-in-out"
                  style={{
                    width: `80px`,
                    backgroundColor: beams >= config.minPoints ? config.bgColor : "#e5e5e5",
                    height: "100%",
                    minWidth: "24px",
                  }}
                >
                  <span className={`${beams >= config.minPoints ? 'text-white' : "text-black"} font-bold text-xs`}>{progress}%</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex w-full items-center md:justify-center">
              <div className="w-fit p-3 flex text-sm text-grey-2 items-center rounded-3xl bg-background shadow-defined justify-center">
                {config.minPoints} - {config.maxPoints} Beams
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}