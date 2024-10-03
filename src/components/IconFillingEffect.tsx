
import React from "react";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";

interface IconFillingEffectProps {
  icon: string;
  filledColor: string;
  emptyColor?: string;
  beams: number;
  minPoints: number;
  maxPoints: number;
  totalIcons?: number; 
  iconSize?: number;
  iconGap?: number;
}

const iconLibraries: any = {
  fa: FaIcons,
  md: MdIcons,
  gi: GiIcons,
  // Add other libraries as needed
};

const DynamicIcon = ({ icon, ...props }: any) => {
  const [library, iconName]: any = icon.split('/');
  const IconComponent = iconLibraries[library]?.[iconName];

  if (!IconComponent) {
    console.error(`Icon not found: ${icon}`);
    return <div style={{ width: props.size, height: props.size }}></div>;
  }

  return <IconComponent {...props} />;
};

export default function IconFillingEffect({
  icon,
  filledColor,
  emptyColor = "#e5e5e5",
  beams,
  minPoints,
  maxPoints,
  totalIcons = 10,
  iconSize = 16,
  iconGap = 12,
}: IconFillingEffectProps) {
  const progress = Math.min(
    100,
    Math.round(((beams - minPoints) / (maxPoints - minPoints)) * 100)
  );
  const filledIcons = Math.ceil(progress / (100 / totalIcons));

  return (
    
    <div className="flex p-4  rounded-full shadow-defined md:gap-3 lg:gap-4 gap-2" style={{ gap: `${iconGap}px` }}>
      {[...Array(totalIcons)].map((_, i) => (
        <DynamicIcon
          key={i}
          icon={icon}
          size={iconSize}
          style={{ color: i < filledIcons ? filledColor : emptyColor }}
        />
      ))}
    </div>
  );
}
