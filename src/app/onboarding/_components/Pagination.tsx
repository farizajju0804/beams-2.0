import React, { useState } from 'react';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react'; // Icons for navigation
import { Button } from '@nextui-org/react'; // Button component from NextUI

interface PaginationProps {
  currentSlide: number;  // The current slide index
  totalSlides: number;   // Total number of slides
  onPrev: () => void;    // Function to handle "Previous" button click
  onNext: () => void;    // Function to handle "Next" button click
  onComplete: () => void; // Function to handle "Complete" action on the last slide
  completeBtnText: string; // Text to display on the "Complete" button
  isPending: boolean;    // State to show loading spinner and disable buttons during async actions
}

const Pagination: React.FC<PaginationProps> = ({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onComplete,
  completeBtnText,
  isPending, 
}) => {
  const [clickedArrow, setClickedArrow] = useState<string | null>(null); // Track the last clicked arrow

  const isFirstSlide = currentSlide === 0; // Check if it's the first slide
  const isLastSlide = currentSlide === totalSlides - 1; // Check if it's the last slide

  // Handle click on the "Previous" button
  const handlePrevClick = () => {
    setClickedArrow('left'); // Mark that the left arrow was clicked
    onPrev(); // Trigger the onPrev function
  };

  // Handle click on the "Next" button
  const handleNextClick = () => {
    setClickedArrow('right'); // Mark that the right arrow was clicked
    onNext(); // Trigger the onNext function
  };

  return (
    <div className="flex justify-center items-center space-x-8 mb-6">
      {/* Previous Button */}
      <Button
        size="sm"
        isIconOnly

        onClick={handlePrevClick}
        disabled={isFirstSlide} // Disable if it's the first slide
        className={`w-fit rounded-full transition-all duration-300 ${
          isFirstSlide ? 'bg-gray-100' : clickedArrow === 'left' ? 'bg-brand text-white' : 'bg-[#d2d2d2]'
        }`}
        aria-label="Previous slide"
      >
        <ArrowLeft2
          size="16"
          className={`${isFirstSlide ? 'text-[#9CA3AF]' : clickedArrow === 'left' ? 'text-white' : 'text-[#181818]'}`}
        />
      </Button>

      {/* Next or Complete Button */}
      {isLastSlide ? (
        <Button
          onClick={onComplete}
          className="px-6 py-2 bg-brand text-lg text-white font-medium"
          isLoading={isPending} // Show loading state when pending
        aria-label="Submit"
        >
          {completeBtnText}
        </Button>
      ) : (
        <Button
          isIconOnly
          size="sm"
          onClick={handleNextClick}
          className={`w-fit rounded-full transition-all duration-300 ${
            clickedArrow === 'right' ? 'bg-primary text-white' : 'bg-[#d2d2d2] text-[#181818]'
          }`}
          aria-label="Next slide"
          isDisabled={isPending} // Disable button when pending
        >
          <ArrowRight2 size="16" />
        </Button>
      )}
    </div>
  );
};

export default Pagination;
