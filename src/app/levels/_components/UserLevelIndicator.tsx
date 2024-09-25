"use client";

import React from "react";
import { Star1, Crown, Medal, Chart, Ranking } from "iconsax-react";

interface LevelConfig {
  icon: React.ElementType;
  title: string;
  bgColor: string;
  shadowColor: string;
  minBeams: number;
  maxBeams: number;
}

const levelConfigs: LevelConfig[] = [
  { icon: Star1, title: "NewBie", bgColor: "rgba(249, 111, 46, 1)", shadowColor: "rgba(249, 111, 46, 1)", minBeams: 0, maxBeams: 30 },
  { icon: Crown, title: "Rookie", bgColor: "rgba(0, 128, 0, 1)", shadowColor: "rgba(0, 128, 0, 0.3)", minBeams: 31, maxBeams: 60 },
  { icon: Medal, title: "Intermediate", bgColor: "rgba(0, 0, 255,1)", shadowColor: "rgba(0, 0, 255, 0.3)", minBeams: 61, maxBeams: 100 },
  { icon: Chart, title: "Expert", bgColor: "rgba(128, 0, 128, 1)", shadowColor: "rgba(128, 0, 128, 0.3)", minBeams: 101, maxBeams: 150 },
  { icon: Ranking, title: "Master", bgColor: "rgba(255, 0, 0, 1)", shadowColor: "rgba(255, 0, 0, 0.3)", minBeams: 151, maxBeams: 200 },
];

interface UserLevelIndicatorProps {
  beams: number;
}

export default function UserLevelIndicator({ beams = 0 }: UserLevelIndicatorProps) {
  console.log(`Total beams passed: ${beams}`);

  return (
    <div className="w-full flex flex-col gap-12 md:gap-8 px-6 mb-6 bg-background">
      {levelConfigs.map((config, idx) => {
        const Icon = config.icon;
        const isWithinLevelRange = beams >= config.minBeams && beams <= config.maxBeams;
        const isAboveLevel = beams > config.maxBeams;
        let progress = 0;

        // Calculate progress within the current level's range
        if (isWithinLevelRange) {
          progress = Math.min(100, Math.round(((beams - config.minBeams) / (config.maxBeams - config.minBeams)) * 100));
          console.log(`Level ${idx + 1} (${config.title}): progress = ${progress}%`);
        } else if (isAboveLevel) {
          progress = 100; // The level is fully completed
        }

        const filledIcons = Math.floor(progress / 12.5); // 8 icons per level, so 12.5% progress per icon

        console.log(`Level ${idx + 1} (${config.title}): filled icons = ${filledIcons}`);

        return (
          <div key={idx} className="grid gap-4 grid-cols-1 md:grid-cols-3 ">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <div
                className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: beams >= config.minBeams ? config.bgColor : "#e5e5e5",
                  boxShadow: `0px 4px 0px 0px rgba(0, 0, 0, 0.20), 0px 4px 0px 0px ${beams >= config.minBeams ? config.shadowColor : "#e5e5e5"}`,
                }}
              >
                <Icon size={20} variant="Bold" className={`${beams >= config.minBeams ? "text-white" : "text-black"}`} />
              </div>
              <div className="flex flex-col items-start">
                <p className="text-xs md:text-sm text-grey-2">Level {idx + 1}</p>
                <p className="text-sm md:text-lg font-medium font-poppins text-text">{config.title}</p>
              </div>
            </div>
          
            
            <div className="flex md:hidden  items-center md:justify-center">
            <div className="text-xs md:text-sm -fit p-3 flex  text-grey-2 items-center rounded-3xl bg-background shadow-defined justify-center">

                {config.minBeams} - {config.maxBeams} Beams
             
            </div>
            </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex  gap-3 shadow-defined bg-background rounded-3xl p-4">
                {/* Fill icons based on progress */}
                {[...Array(8)].map((_, i) => (
                  <Icon key={i} size={24} variant="Bold" style={{ color: i < filledIcons ? config.bgColor : "#e5e5e5" }} />
                ))}
              </div>
              <div className="w-12 h-12 flex items-center justify-center">
                <div
                  className="rounded-2xl flex items-center justify-center transition-all duration-300 ease-in-out"
                  style={{
                    width: `80px`,
                    backgroundColor: beams >= config.minBeams ? config.bgColor : "#e5e5e5",
                    height: "100%",
                    minWidth: "24px",
                    // boxShadow: `0px 4px 4px 0px ${beams >= config.minBeams ? config.shadowColor : "#e5e5e5"}`,
                  }}
                >
                  <span className={`${beams >= config.minBeams ? 'text-white' : "text-black"} font-bold text-xs`}>{progress}%</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex w-full items-center md:justify-center">
            <div className="w-fit p-3 flex text-sm text-grey-2 items-center rounded-3xl bg-background shadow-defined justify-center">

                {config.minBeams} - {config.maxBeams} Beams
             
            </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
