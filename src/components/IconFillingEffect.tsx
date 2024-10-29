import React from "react"; // Importing React library
import * as FaIcons from "react-icons/fa"; // Importing Font Awesome icons
import * as MdIcons from "react-icons/md"; // Importing Material Design icons
import * as GiIcons from "react-icons/gi"; // Importing Game Icons
import * as AiIcons from "react-icons/ai"; // Importing Ant Design icons

// Interface defining the expected props for IconFillingEffect component
interface IconFillingEffectProps {
  icon: string;              // Icon identifier in the format 'library/iconName'
  filledColor: string;       // Color for filled icons
  emptyColor?: string;       // Color for empty icons (default is light gray)
  beams: number;             // Current number of beams to determine filling
  minPoints: number;         // Minimum points to calculate the progress
  maxPoints: number;         // Maximum points to calculate the progress
  totalIcons?: number;       // Total number of icons to display (default is 10)
  iconSize?: number;         // Size of the icons (default is 16)
  iconGap?: number;          // Gap between icons (default is 12)
}

// Object mapping icon libraries for easy access
const iconLibraries: any = {
  fa: FaIcons,
  md: MdIcons,
  gi: GiIcons,
  ai: AiIcons
  // Add other libraries as needed
};

// DynamicIcon component for rendering the appropriate icon based on the input
const DynamicIcon = ({ icon, ...props }: any) => {
  let IconComponent; // Variable to store the resolved icon component

  // Check if the icon is provided
  if (icon) {
    // Split the icon string into library and icon name
    const [library, iconName]: any = icon.split('/');
    IconComponent = iconLibraries[library]?.[iconName]; // Resolve the icon component from the library
  }

  // If the icon component is not found, log an error and return a placeholder div
  if (!IconComponent) {
    console.error(`Icon not found: ${icon}`);
    return <div style={{ width: props.size, height: props.size }}></div>; // Placeholder size matching icon size
  }

  // Render the resolved icon component with provided props
  return <IconComponent {...props} />;
};

// Main functional component for displaying the filling effect of icons
export default function IconFillingEffect({
  icon,
  filledColor,
  emptyColor = "#e5e5e5", // Default empty color
  beams,
  minPoints,
  maxPoints,
  totalIcons = 10, // Default total icons
  iconSize = 16,   // Default icon size
  iconGap = 12,    // Default icon gap
}: IconFillingEffectProps) {
  // Calculate the progress percentage based on the beams
  const progress = Math.min(
    100,
    Math.round(((beams - minPoints) / (maxPoints - minPoints)) * 100) // Ensure progress does not exceed 100
  );

  // Calculate the number of filled icons based on progress
  const filledIcons = Math.ceil(progress / (100 / totalIcons));

  return (
    <div className="flex p-2 bg-background rounded-full shadow-defined md:gap-3 lg:gap-4 gap-2" style={{ gap: `${iconGap}px` }}>
      {/* Render totalIcons based on the calculated filledIcons */}
      {[...Array(totalIcons)].map((_, i) => (
        <DynamicIcon
          key={i} // Unique key for each icon
          icon={icon} // Pass the icon prop to the DynamicIcon component
          size={iconSize} // Pass the size prop to the DynamicIcon component
          style={{ color: i < filledIcons ? filledColor : emptyColor }} // Set icon color based on filling
        />
      ))}
    </div>
  );
}
