import React, { useState } from 'react';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import { Button } from '@nextui-org/react';

interface PaginationProps {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  completeBtnText: string;
  isPending: boolean; 
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

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === totalSlides - 1;

  const handlePrevClick = () => {
    setClickedArrow('left');
    onPrev();
  };

  const handleNextClick = () => {
    setClickedArrow('right');
    onNext();
  };

  return (
    <div className="flex justify-center items-center space-x-8 mb-6">
      <Button
  size="sm"
  isIconOnly
  onClick={handlePrevClick}
  disabled={isFirstSlide}
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

      {isLastSlide ? (
        <Button
          onClick={onComplete}
          className="px-6 py-2 bg-brand text-lg text-white font-medium"
          isLoading={isPending} 
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
          isDisabled={isPending} 
        >
          <ArrowRight2 size="16"  />
        </Button>
      )}
    </div>
  );
};

export default Pagination;
