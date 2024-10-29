import IconFillingEffect from '@/components/IconFillingEffect'; // Importing the icon filling effect component
import { Cup } from 'iconsax-react'; // Importing the Cup icon from iconsax
import Link from 'next/link'; // Importing Link for navigation in Next.js
import React from 'react'; // Importing React

// Interface defining the structure of LevelDetails component props
interface LevelDetailsProps {
    userLevel: any; // User level details (could be typed more specifically)
    beams: number; // Number of beams the user has
}

// Functional component to display level details
const LevelDetails: React.FC<LevelDetailsProps> = ({ userLevel, beams }) => {
  return (
    <div className='w-full gap-3 pb-4 max-w-md rounded-3xl shadow-defined bg-background flex flex-col items-center justify-center'>
      {/* Header section displaying the user's level */}
      <div 
        style={{ backgroundColor: userLevel.bgColor }} // Dynamic background color based on user level
        className="flex items-center text-white w-full justify-center py-2 rounded-t-3xl"
      >
        <Cup variant='Bold' size={20} className="mr-2" /> {/* Icon representing the level */}
        <h2 className="text-sm md:text-lg font-poppins font-semibold">My Level</h2> {/* Level header */}
      </div>
      
      {/* Level details section */}
      <div className="flex items-center md:justify-start justify-center">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            {/* Displaying level number */}
            <p className="text-xs mx-auto md:text-base font-poppins font-medium uppercase">Level {userLevel.levelNumber}</p>
            <div className="flex items-center gap-2">
              {/* Displaying user level name */}
              <p className="text-xs md:text-base uppercase font-medium font-poppins text-text relative">
                <span className="inline-block">{userLevel.name}</span>
              </p>
            </div>
          </div>
          {/* Displaying the number of beams */}
          <p className="text-xs md:text-base mx-auto font-poppins font-medium">{beams} Beams</p>
        </div>
      </div>

      {/* Icon filling effect component */}
      <IconFillingEffect
        icon={userLevel.icon} // Icon for the level
        filledColor={userLevel.bgColor} // Color for the filled effect
        beams={beams} // Number of beams for the effect
        minPoints={userLevel.minPoints} // Minimum points required for this level
        maxPoints={userLevel.maxPoints} // Maximum points for this level
      />

      {/* Link to achievements page */}
      <Link
        href='/achievements' // Navigation link to the achievements page
        style={{ color: userLevel.bgColor }} // Dynamic text color based on user level
        className={`w-full underline font-medium mt-1 text-center mx-auto text-sm`}
      >
        View Progress {/* Link text */}
      </Link>
    </div>
  );
};

export default LevelDetails; // Exporting the component for use in other parts of the application
