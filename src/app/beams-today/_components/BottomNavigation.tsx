// Import React and necessary hooks/components from external libraries
'use client'  // This marks the component to be rendered on the client-side.
import React from "react";  // Import React for creating the component.
import { Button } from "@nextui-org/react";  // Import Button component from NextUI for styled buttons.
import { useRouter } from 'next/navigation'; // Import useRouter hook from Next.js for route navigation.
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";  // Import icons for the "Prev" and "Next" buttons.
import FormattedDate from "./FormattedDate";  // Import a custom component to format and display the date.

// Define the types for the component's props
type BottomNavigationProps = {
  currentDate: Date;  // The current date to be displayed.
  prevUrl?: string | null;  // The URL for the previous page (optional, can be null).
  nextUrl?: string | null;  // The URL for the next page (optional, can be null).
};

// BottomNavigation component definition
const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentDate, prevUrl, nextUrl }) => {
  const router = useRouter();  // Initialize the Next.js router to handle page navigation.

  // Function to handle the "Prev" button click event
  const handlePrevClick = () => {
    if (prevUrl) {  // Only navigate if prevUrl is provided
      router.push(prevUrl);  // Use Next.js router to navigate to the previous page.
    }
  };

  // Function to handle the "Next" button click event
  const handleNextClick = () => {
    if (nextUrl) {  // Only navigate if nextUrl is provided
      router.push(nextUrl);  // Use Next.js router to navigate to the next page.
    }
  };

  return (
    <div className="flex justify-between items-center z-[400] p-4 ">
      {/* "Prev" Button: Disabled if there is no prevUrl */}
      <Button size="sm" className="bg-grey-1 text-grey-2" 
              startContent={<ArrowLeft2 className="text-grey-2" size="16" />} 
              onPress={handlePrevClick} 
              isDisabled={!prevUrl}>
        Prev
      </Button>
      
      {/* Display the formatted current date in the center */}
      <div className="text-gray-1 text-sm">
        <FormattedDate date={currentDate.toISOString().split('T')[0]} />
      </div>

      {/* "Next" Button: Disabled if there is no nextUrl */}
      <Button size="sm" className="bg-grey-1 text-grey-2" 
              endContent={<ArrowRight2 className="text-grey-2" size="16"/>} 
              onPress={handleNextClick} 
              isDisabled={!nextUrl}>
        Next
      </Button>
    </div>
  );
};

export default BottomNavigation;  // Export the component for use in other parts of the application.
